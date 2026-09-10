"""
HeritageGuardian AI - Core Ingestion Engine
Orchestrates fetching, document storage, parsing, validation, deduplication,
and database persistence for all external public data sources.
"""

import hashlib
import json
import logging
import time
from datetime import datetime
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session

from ...models.database import (
    DataSource, IngestionRun, SourceDocument, Observation, Site
)
from ..adapters.base import BaseAdapter
from ..adapters.open_meteo_adapter import OpenMeteoEnvironmentalAdapter
from ..adapters.wikipedia_adapter import WikipediaHeritageAdapter
from ..adapters.unesco_adapter import UnescoWorldHeritageAdapter
from ..validators.observation_validator import ObservationValidator
from ..deduplication.deduplication_engine import DeduplicationEngine

logger = logging.getLogger(__name__)


class IngestionEngine:
    """
    Central coordinator for data source ingestion runs.
    """

    def __init__(self):
        self._adapters: Dict[str, BaseAdapter] = {}
        # Register default authoritative adapters
        self.register_adapter(OpenMeteoEnvironmentalAdapter())
        self.register_adapter(WikipediaHeritageAdapter())
        self.register_adapter(UnescoWorldHeritageAdapter())

    def register_adapter(self, adapter: BaseAdapter):
        self._adapters[adapter.source_name] = adapter
        logger.info(f"Registered ingestion adapter: {adapter.source_name} ({adapter.domain})")

    def get_adapter(self, source_name: str) -> Optional[BaseAdapter]:
        return self._adapters.get(source_name)

    def list_adapters(self) -> List[Dict[str, Any]]:
        return [
            {
                "name": a.source_name,
                "domain": a.domain,
                "tier": a.authority_tier,
                "reliability": a.default_reliability
            }
            for a in self._adapters.values()
        ]

    async def run_source_ingestion(
        self,
        db: Session,
        source_id: int,
        site_id: Optional[int] = None
    ) -> Dict[str, Any]:
        """
        Execute an ingestion run for a specific DataSource ID.
        """
        source = db.query(DataSource).filter(DataSource.id == source_id).first()
        if not source:
            return {"error": f"DataSource ID {source_id} not found."}

        adapter = self._adapters.get(source.name)
        if not adapter:
            # Fallback lookup by domain or partial name match
            for a in self._adapters.values():
                if a.domain in (source.domain or "") or source.name in a.source_name:
                    adapter = a
                    break

        if not adapter:
            return {"error": f"No active adapter registered for source '{source.name}'."}

        start_time = time.time()
        run = IngestionRun(
            source_id=source.id,
            status="RUNNING",
            started_at=datetime.utcnow()
        )
        db.add(run)
        db.commit()

        # Target sites to query
        sites_query = db.query(Site).filter(Site.is_active == True)
        if site_id:
            sites_query = sites_query.filter(Site.id == site_id)
        sites = sites_query.all()

        records_fetched = 0
        records_validated = 0
        records_stored = 0
        records_deduped = 0
        records_rejected = 0
        last_error = None

        for site in sites:
            try:
                # 1. Fetch
                raw_bundle = await adapter.fetch(site)
                raw_payload = raw_bundle.get("raw_payload", {})
                records_fetched += 1

                # 2. Store Raw SourceDocument with SHA256 hash for provenance
                raw_str = json.dumps(raw_payload, sort_keys=True)
                content_hash = hashlib.sha256(raw_str.encode("utf-8")).hexdigest()

                doc = SourceDocument(
                    source_id=source.id,
                    external_identifier=f"{site.id}-{int(time.time())}",
                    title=f"Telemetry Snapshot for {site.name}",
                    document_url=raw_bundle.get("source_url", source.source_url),
                    publication_date=datetime.utcnow(),
                    retrieval_timestamp=datetime.utcnow(),
                    raw_payload=raw_payload,
                    content_hash=content_hash,
                    processing_status="PROCESSED"
                )
                db.add(doc)
                db.flush()

                # 3. Parse
                parsed_items = adapter.parse(raw_bundle)

                # 4. Validate and Deduplicate each item
                for item in parsed_items:
                    item["site_id"] = site.id
                    item["data_origin"] = "EXTERNAL_SOURCE"

                    is_valid, status, validated_item = ObservationValidator.validate(item)
                    if not is_valid:
                        records_rejected += 1
                        continue

                    records_validated += 1

                    # 5. Deduplicate
                    dedup_res = DeduplicationEngine.process_observation(db, validated_item, adapter.source_name)
                    action = dedup_res["action"]

                    if action == "INSERT_NEW":
                        new_obs = Observation(
                            site_id=site.id,
                            zone_id=validated_item.get("zone_id"),
                            source_document_id=doc.id,
                            data_origin="EXTERNAL_SOURCE",
                            observation_type=validated_item["observation_type"],
                            observation_date=validated_item.get("observation_date", datetime.utcnow()),
                            metric_name=validated_item["metric_name"],
                            metric_value=validated_item["metric_value"],
                            unit=validated_item.get("unit"),
                            severity=validated_item.get("severity", "Low"),
                            confidence_score=validated_item.get("confidence_score", 1.0),
                            details=validated_item.get("details"),
                            raw_metadata=validated_item.get("raw_metadata"),
                            status="VALIDATED",
                            is_consolidated=False,
                            consolidated_count=1,
                            contributing_sources=[adapter.source_name],
                            has_conflicts=False,
                            requires_human_review=False
                        )
                        db.add(new_obs)
                        records_stored += 1
                    elif action in ("CONSOLIDATE_MATCH", "FLAG_CONFLICT"):
                        records_deduped += 1
                        records_stored += 1
                    elif action == "DUPLICATE_IGNORED":
                        records_deduped += 1

                db.commit()

            except Exception as e:
                last_error = str(e)
                logger.error(f"Error ingesting {source.name} for site {site.name}: {e}")

        # Finalize run
        duration = round(time.time() - start_time, 2)
        run_status = "SUCCESS" if not last_error else ("PARTIAL" if records_stored > 0 else "FAILED")

        run.status = run_status
        run.completed_at = datetime.utcnow()
        run.records_fetched = records_fetched
        run.records_validated = records_validated
        run.records_stored = records_stored
        run.records_deduplicated = records_deduped
        run.records_rejected = records_rejected
        run.execution_duration_sec = duration
        run.error_message = last_error

        # Update DataSource metadata
        if run_status in ["SUCCESS", "PARTIAL"]:
            source.last_successful_retrieval = datetime.utcnow()
            source.failure_count = 0
            source.records_count = (source.records_count or 0) + records_stored
        else:
            source.last_failed_retrieval = datetime.utcnow()
            source.failure_count = (source.failure_count or 0) + 1

        db.commit()

        # Trigger Unified Analysis Engine after new records ingested
        try:
            from ...analysis.unified_analysis import unified_analysis_engine
            unified_analysis_engine.analyze_all_sites(db)
        except Exception as an_err:
            logger.warning(f"Post-ingestion analysis trigger warning: {an_err}")

        return {
            "run_id": run.id,
            "source_id": source.id,
            "source_name": source.name,
            "status": run_status,
            "records_fetched": records_fetched,
            "records_stored": records_stored,
            "records_deduplicated": records_deduped,
            "records_rejected": records_rejected,
            "duration_sec": duration,
            "error": last_error
        }


# Global singleton instance
ingestion_engine = IngestionEngine()
