"""Encroachment Detection Agent — safe MVP using demo/boundary data."""
from __future__ import annotations
import logging
from typing import List, Optional
from sqlalchemy.orm import Session

from app.database.models import HeritageSite, EncroachmentObservation
from app.schemas.schemas import EncroachmentResult
from app.services.granite_service import call_granite
from app.prompts.prompts import ENCROACHMENT_PROMPT

logger = logging.getLogger(__name__)


async def run_encroachment_agent(site_id: str, db: Session) -> EncroachmentResult:
    """Execute the Encroachment Detection Agent."""
    site = db.query(HeritageSite).filter(HeritageSite.id == site_id).first()
    if not site:
        raise ValueError(f"Site not found: {site_id}")

    obs_list = db.query(EncroachmentObservation).filter(
        EncroachmentObservation.site_id == site_id
    ).order_by(EncroachmentObservation.observation_date.desc()).all()

    if not obs_list:
        return EncroachmentResult(
            site_id=site_id,
            potential_encroachment=False,
            confidence=0.3,
            evidence=["No demo observation records available"],
            recommended_verification="Schedule initial boundary survey. No data in demo dataset.",
            status="NO_DATA",
            data_source="SIMULATED_DEMO",
        )

    # Aggregate — flag if any confirmed potential encroachment
    flagged = [o for o in obs_list if o.potential_encroachment]
    has_encroachment = bool(flagged)
    confidence = max((o.confidence for o in flagged), default=0.0) if flagged else 0.85
    all_evidence = []
    for o in obs_list:
        all_evidence.extend(o.evidence or [])
    all_evidence = list(dict.fromkeys(all_evidence))[:8]
    status = flagged[0].status if flagged else "VERIFIED_CLEAR"
    rec = (
        flagged[0].recommended_verification if flagged
        else "No potential encroachment detected in demo data. Routine periodic monitoring sufficient."
    )

    # Try Granite for cautious narrative
    try:
        primary = obs_list[0]
        prompt = ENCROACHMENT_PROMPT.format(
            site_name=site.name,
            location=primary.location_description or "General boundary",
            potential_encroachment=has_encroachment,
            confidence=confidence,
            evidence="; ".join(all_evidence[:3]) or "Demo data only",
        )
        granite_response = await call_granite(prompt, max_tokens=100)
        if granite_response:
            rec = granite_response
    except Exception as e:
        logger.warning(f"Granite encroachment summary failed: {e}")

    return EncroachmentResult(
        site_id=site_id,
        potential_encroachment=has_encroachment,
        confidence=round(confidence, 2),
        evidence=all_evidence,
        recommended_verification=rec,
        status=status,
        data_source="SIMULATED_DEMO",
    )
