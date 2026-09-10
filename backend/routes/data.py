"""
HeritageGuardian AI - Normalized Data, Manual Entry & Quality Routes
Provides unified access to external and manual observations, quality metrics,
and manual observation submission.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

from ..models.db_config import get_db
from ..models.database import (
    Observation, Site, HeritageZone, DataSource, IngestionRun
)
from ..ingestion.validators.observation_validator import ObservationValidator
from ..ingestion.deduplication.deduplication_engine import DeduplicationEngine
from ..analysis.unified_analysis import unified_analysis_engine

router = APIRouter(prefix="/api/data", tags=["data"])


class ManualObservationRequest(BaseModel):
    site_id: int
    zone_id: Optional[int] = None
    observation_type: str = Field(..., description="VISITOR_FLOW, STRUCTURAL_INTEGRITY, ENVIRONMENTAL_CONDITION, ENCROACHMENT, CONSERVATION_INCIDENT")
    metric_name: str
    metric_value: float
    unit: Optional[str] = None
    severity: Optional[str] = "Low"
    details: Optional[str] = None
    inspector_name: Optional[str] = None
    observation_date: Optional[datetime] = None


@router.get("")
@router.get("/")
def get_observations(
    site_id: Optional[int] = None,
    origin: Optional[str] = Query(None, description="ALL, EXTERNAL_SOURCE, MANUAL_ENTRY, IMPORTED_DATA, SIMULATED"),
    observation_type: Optional[str] = None,
    severity: Optional[str] = None,
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """
    Query normalized observations across all sources with filtering.
    """
    q = db.query(Observation)

    if site_id:
        q = q.filter(Observation.site_id == site_id)
    if origin and origin != "ALL":
        q = q.filter(Observation.data_origin == origin)
    if observation_type:
        q = q.filter(Observation.observation_type == observation_type)
    if severity:
        q = q.filter(Observation.severity == severity)

    total = q.count()
    records = q.order_by(Observation.observation_date.desc()).offset(offset).limit(limit).all()

    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "records": [
            {
                "id": o.id,
                "site_id": o.site_id,
                "site_name": o.site.name if o.site else None,
                "zone_id": o.zone_id,
                "zone_name": o.zone.name if o.zone else None,
                "data_origin": o.data_origin,
                "observation_type": o.observation_type,
                "observation_date": o.observation_date.isoformat() if o.observation_date else None,
                "metric_name": o.metric_name,
                "metric_value": o.metric_value,
                "unit": o.unit,
                "severity": o.severity,
                "confidence_score": o.confidence_score,
                "details": o.details,
                "status": o.status,
                "is_consolidated": o.is_consolidated,
                "consolidated_count": o.consolidated_count,
                "contributing_sources": o.contributing_sources or [],
                "has_conflicts": o.has_conflicts,
                "conflict_details": o.conflict_details,
                "requires_human_review": o.requires_human_review
            }
            for o in records
        ]
    }


@router.get("/quality")
def get_data_quality_metrics(db: Session = Depends(get_db)):
    """
    Get data health, provenance breakdown, and ingestion summary.
    """
    total_obs = db.query(Observation).count()
    validated_obs = db.query(Observation).filter(Observation.status == "VALIDATED").count()
    consolidated_obs = db.query(Observation).filter(Observation.is_consolidated == True).count()
    conflicts_obs = db.query(Observation).filter(Observation.has_conflicts == True).count()
    review_required = db.query(Observation).filter(Observation.requires_human_review == True).count()

    # Provenance breakdown
    origin_counts = dict(
        db.query(Observation.data_origin, func.count(Observation.id))
        .group_by(Observation.data_origin)
        .all()
    )

    # Ingestion runs
    total_runs = db.query(IngestionRun).count()
    success_runs = db.query(IngestionRun).filter(IngestionRun.status == "SUCCESS").count()
    failed_runs = db.query(IngestionRun).filter(IngestionRun.status == "FAILED").count()

    last_run = db.query(IngestionRun).order_by(IngestionRun.started_at.desc()).first()

    return {
        "total_records": total_obs,
        "validated_records": validated_obs,
        "consolidated_records": consolidated_obs,
        "conflicting_records": conflicts_obs,
        "human_review_required": review_required,
        "origin_breakdown": {
            "EXTERNAL_SOURCE": origin_counts.get("EXTERNAL_SOURCE", 0),
            "MANUAL_ENTRY": origin_counts.get("MANUAL_ENTRY", 0),
            "IMPORTED_DATA": origin_counts.get("IMPORTED_DATA", 0),
            "SIMULATED": origin_counts.get("SIMULATED", 0)
        },
        "ingestion_runs": {
            "total": total_runs,
            "success": success_runs,
            "failed": failed_runs,
            "last_run_timestamp": last_run.started_at.isoformat() if last_run else None,
            "last_run_status": last_run.status if last_run else "IDLE"
        }
    }


@router.post("/manual")
def submit_manual_observation(
    req: ManualObservationRequest,
    db: Session = Depends(get_db)
):
    """
    Manual observation entry by authorized personnel.
    Validates, attaches MANUAL_ENTRY provenance, and executes unified analysis.
    """
    site = db.query(Site).filter(Site.id == req.site_id).first()
    if not site:
        raise HTTPException(status_code=404, detail=f"Site ID {req.site_id} not found.")

    obs_date = req.observation_date or datetime.utcnow()
    raw_dict = {
        "site_id": req.site_id,
        "zone_id": req.zone_id,
        "data_origin": "MANUAL_ENTRY",
        "observation_type": req.observation_type,
        "metric_name": req.metric_name,
        "metric_value": req.metric_value,
        "unit": req.unit,
        "severity": req.severity or "Low",
        "details": req.details,
        "observation_date": obs_date,
        "confidence_score": 0.95
    }

    # 1. Validate
    is_valid, status, validated_dict = ObservationValidator.validate(raw_dict)
    if not is_valid:
        raise HTTPException(
            status_code=400,
            detail=f"Validation failed: {validated_dict.get('rejection_reason')}"
        )

    # 2. Deduplicate / Check conflicts
    inspector_label = f"Manual Entry ({req.inspector_name or 'Field Officer'})"
    dedup = DeduplicationEngine.process_observation(db, validated_dict, inspector_label)

    # Authorized manual entries always store their own primary Observation record with MANUAL_ENTRY provenance
    obs = Observation(
        site_id=req.site_id,
        zone_id=req.zone_id,
        data_origin="MANUAL_ENTRY",
        observation_type=validated_dict["observation_type"],
        observation_date=validated_dict["observation_date"],
        metric_name=validated_dict["metric_name"],
        metric_value=validated_dict["metric_value"],
        unit=validated_dict.get("unit"),
        severity=validated_dict.get("severity", "Low"),
        confidence_score=validated_dict.get("confidence_score", 0.95),
        details=validated_dict.get("details"),
        status="VALIDATED",
        is_consolidated=(dedup["action"] == "CONSOLIDATE_MATCH"),
        consolidated_count=1,
        contributing_sources=[inspector_label],
        has_conflicts=dedup.get("has_conflicts", False),
        conflict_details=dedup.get("conflict_details"),
        requires_human_review=dedup.get("requires_human_review", False)
    )
    db.add(obs)
    db.commit()
    db.refresh(obs)
    obs_id = obs.id

    # 3. Trigger unified analysis engine for the site
    analysis_res = unified_analysis_engine.analyze_site(db, req.site_id)

    return {
        "status": "success",
        "message": "Manual observation successfully validated and stored into unified conservation pipeline.",
        "observation_id": obs_id,
        "data_origin": "MANUAL_ENTRY",
        "analysis": analysis_res
    }


@router.get("/runs")
def get_ingestion_runs(limit: int = 20, db: Session = Depends(get_db)):
    """Get recent ingestion run history."""
    runs = db.query(IngestionRun).order_by(IngestionRun.started_at.desc()).limit(limit).all()
    return [
        {
            "id": r.id,
            "source_id": r.source_id,
            "source_name": r.source.name if r.source else "Unknown",
            "status": r.status,
            "started_at": r.started_at.isoformat() if r.started_at else None,
            "completed_at": r.completed_at.isoformat() if r.completed_at else None,
            "records_fetched": r.records_fetched,
            "records_stored": r.records_stored,
            "records_deduplicated": r.records_deduplicated,
            "records_rejected": r.records_rejected,
            "duration_sec": r.execution_duration_sec,
            "error_message": r.error_message
        }
        for r in runs
    ]


@router.get("/{observation_id}")
def get_observation(observation_id: int, db: Session = Depends(get_db)):
    """Get single observation record with complete provenance and traceable source document."""
    obs = db.query(Observation).filter(Observation.id == observation_id).first()
    if not obs:
        raise HTTPException(status_code=404, detail="Observation record not found")

    return {
        "id": obs.id,
        "site_id": obs.site_id,
        "site_name": obs.site.name if obs.site else None,
        "zone_id": obs.zone_id,
        "zone_name": obs.zone.name if obs.zone else None,
        "data_origin": obs.data_origin,
        "observation_type": obs.observation_type,
        "observation_date": obs.observation_date.isoformat() if obs.observation_date else None,
        "metric_name": obs.metric_name,
        "metric_value": obs.metric_value,
        "unit": obs.unit,
        "severity": obs.severity,
        "confidence_score": obs.confidence_score,
        "details": obs.details,
        "status": obs.status,
        "is_consolidated": obs.is_consolidated,
        "consolidated_count": obs.consolidated_count,
        "contributing_sources": obs.contributing_sources or [],
        "has_conflicts": obs.has_conflicts,
        "conflict_details": obs.conflict_details,
        "requires_human_review": obs.requires_human_review,
        "source_document": {
            "id": obs.source_document.id,
            "source_name": obs.source_document.source.name if obs.source_document and obs.source_document.source else None,
            "document_url": obs.source_document.document_url if obs.source_document else None,
            "retrieval_timestamp": obs.source_document.retrieval_timestamp.isoformat() if obs.source_document else None,
            "content_hash": obs.source_document.content_hash if obs.source_document else None
        } if obs.source_document else None
    }
