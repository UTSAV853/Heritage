"""
HeritageGuardian AI - Wikipedia / Wikimedia Heritage Documentation Adapter
Authoritative Tier 2 public documentation & conservation history feed.
"""

import httpx
import time
import logging
from typing import Dict, Any, List
from datetime import datetime

from .base import BaseAdapter

logger = logging.getLogger(__name__)


class WikipediaHeritageAdapter(BaseAdapter):
    """
    Adapter querying Wikipedia MediaWiki API for verified monument documentation,
    historical events, and protection status updates.
    """

    API_URL = "https://en.wikipedia.org/w/api.php"

    @property
    def source_name(self) -> str:
        return "Wikipedia Heritage Documentation Feed"

    @property
    def domain(self) -> str:
        return "en.wikipedia.org"

    @property
    def authority_tier(self) -> str:
        return "TIER_2"

    @property
    def default_reliability(self) -> float:
        return 0.88

    async def health_check(self) -> Dict[str, Any]:
        start = time.time()
        try:
            async with httpx.AsyncClient(timeout=4.0) as client:
                headers = {"User-Agent": "HeritageGuardian/1.0 (conservation.platform@heritage.org)"}
                resp = await client.get(
                    self.API_URL,
                    params={"action": "query", "meta": "siteinfo", "format": "json"},
                    headers=headers
                )
                latency = round((time.time() - start) * 1000, 1)
                if resp.status_code == 200:
                    return {"status": "HEALTHY", "latency_ms": latency, "message": "Wikipedia MediaWiki API accessible."}
                return {"status": "DEGRADED", "latency_ms": latency, "message": f"Status {resp.status_code}"}
        except Exception as e:
            return {"status": "UNAVAILABLE", "latency_ms": round((time.time() - start) * 1000, 1), "message": str(e)}

    async def fetch(self, site: Any) -> Dict[str, Any]:
        site_name = getattr(site, "name", "Modhera Sun Temple")
        title = site_name.replace(" ", "_")

        headers = {"User-Agent": "HeritageGuardian/1.0 (conservation.platform@heritage.org)"}
        params = {
            "action": "query",
            "prop": "extracts|info",
            "exintro": "1",
            "explaintext": "1",
            "inprop": "url",
            "titles": title,
            "format": "json"
        }

        start_time = datetime.utcnow()
        async with httpx.AsyncClient(timeout=6.0) as client:
            resp = await client.get(self.API_URL, params=params, headers=headers)
            resp.raise_for_status()
            data = resp.json()

        return {
            "source_name": self.source_name,
            "source_domain": self.domain,
            "authority_tier": self.authority_tier,
            "site_id": getattr(site, "id", None),
            "site_name": site_name,
            "retrieval_timestamp": start_time.isoformat(),
            "source_url": str(resp.request.url),
            "raw_payload": data
        }

    def parse(self, raw_payload: Dict[str, Any]) -> List[Dict[str, Any]]:
        raw = raw_payload.get("raw_payload", {})
        pages = raw.get("query", {}).get("pages", {})
        site_id = raw_payload.get("site_id")
        site_name = raw_payload.get("site_name", "")

        observations = []
        for page_id, page in pages.items():
            if page_id == "-1":
                continue
            extract = page.get("extract", "")
            title = page.get("title", site_name)
            word_count = len(extract.split())

            observations.append({
                "site_id": site_id,
                "observation_type": "CONSERVATION_INCIDENT",
                "observation_date": datetime.utcnow(),
                "metric_name": "documentation_completeness_words",
                "metric_value": float(word_count),
                "unit": "words",
                "severity": "Low",
                "confidence_score": 0.90,
                "details": f"Official documentation record for {title}: {extract[:240]}...",
                "raw_metadata": {
                    "source": self.source_name,
                    "page_id": page_id,
                    "full_url": page.get("fullurl")
                }
            })

        return observations
