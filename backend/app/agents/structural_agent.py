"""Structural Health Monitoring Agent — deterministic MVP with Granite summarization."""
from __future__ import annotations
import logging
from typing import List, Optional
from sqlalchemy.orm import Session

from app.database.models import HeritageSite, StructuralObservation
from app.schemas.schemas import StructuralResult
from app.services.granite_service import call_granite
from app.prompts.prompts import STRUCTURAL_PROMPT

logger = logging.getLogger(__name__)

CONDITION_ORDER = ["GOOD", "FAIR", "POOR", "CRITICAL"]
RISK_ORDER = ["LOW", "MODERATE", "HIGH", "CRITICAL"]


def _worst_condition(conditions: List[str]) -> str:
    best = 0
    for c in conditions:
        idx = CONDITION_ORDER.index(c) if c in CONDITION_ORDER else 0
        best = max(best, idx)
    return CONDITION_ORDER[best]


def _worst_risk(risks: List[str]) -> str:
    best = 0
    for r in risks:
        idx = RISK_ORDER.index(r) if r in RISK_ORDER else 0
        best = max(best, idx)
    return RISK_ORDER[best]


async def run_structural_agent(site_id: str, db: Session) -> StructuralResult:
    """Execute the Structural Health Monitoring Agent."""
    site = db.query(HeritageSite).filter(HeritageSite.id == site_id).first()
    if not site:
        raise ValueError(f"Site not found: {site_id}")

    obs_list = db.query(StructuralObservation).filter(
        StructuralObservation.site_id == site_id
    ).order_by(StructuralObservation.inspection_date.desc()).all()

    if not obs_list:
        return StructuralResult(
            site_id=site_id,
            site_name=site.name,
            condition="GOOD",
            risk_level="LOW",
            observations=["No demo inspection records available"],
            recommended_action="Schedule initial inspection. No data in demo dataset.",
            confidence=0.4,
            human_inspection_required=True,
            data_source="SIMULATED_DEMO",
        )

    conditions = [o.condition for o in obs_list]
    risks = [o.risk_level for o in obs_list]
    overall_condition = _worst_condition(conditions)
    overall_risk = _worst_risk(risks)
    all_obs = []
    all_damage = []
    for o in obs_list:
        all_obs.extend(o.observations or [])
        all_damage.extend(o.damage_indicators or [])

    # Deterministic recommendation
    if overall_condition == "CRITICAL":
        deterministic_rec = "URGENT: Human inspection required immediately. Potential conservation concern — not a professional structural assessment."
    elif overall_condition == "POOR":
        deterministic_rec = "Priority inspection recommended within 30 days. Potential conservation concern — human expert required."
    elif overall_condition == "FAIR":
        deterministic_rec = "Schedule inspection within 6 months. Monitor identified concerns — human verification required before action."
    else:
        deterministic_rec = "Routine monitoring. Next inspection per ASI schedule."

    # Confidence from observation age
    confidence = min(0.85, sum(o.confidence for o in obs_list) / len(obs_list))
    human_required = overall_condition in ("POOR", "CRITICAL") or overall_risk in ("HIGH", "CRITICAL")

    # Try Granite for summary
    recommended_action = deterministic_rec
    try:
        primary_obs = obs_list[0]
        prompt = STRUCTURAL_PROMPT.format(
            site_name=site.name,
            zone=primary_obs.zone or "General",
            condition=overall_condition,
            risk_level=overall_risk,
            observations="; ".join(all_obs[:5]),
            damage_indicators="; ".join(all_damage[:5]) or "None",
        )
        granite_response = await call_granite(prompt, max_tokens=120)
        if granite_response:
            recommended_action = granite_response
    except Exception as e:
        logger.warning(f"Granite structural summary failed: {e}")

    return StructuralResult(
        site_id=site_id,
        site_name=site.name,
        condition=overall_condition,
        risk_level=overall_risk,
        observations=list(dict.fromkeys(all_obs))[:10],
        recommended_action=recommended_action,
        confidence=round(confidence, 2),
        human_inspection_required=human_required,
        data_source="SIMULATED_DEMO",
    )
