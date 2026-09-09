"""Conservation Reporting Agent.

Synthesizes visitor flow, structural, and encroachment data.
Uses Granite for report narrative — never for autonomous decisions.
"""
from __future__ import annotations
import json
import logging
from typing import List, Optional
from sqlalchemy.orm import Session

from app.database.models import HeritageSite, ConservationAlert
from app.schemas.schemas import (
    ConservationReportRequest, ConservationReportResult,
    ConservationFactor, ConservationRecommendation,
    VisitorFlowResult, StructuralResult, EncroachmentResult,
)
from app.services.granite_service import call_granite_json
from app.prompts.prompts import CONSERVATION_PROMPT

logger = logging.getLogger(__name__)

PRIORITY_ORDER = ["LOW", "MODERATE", "HIGH", "CRITICAL"]


def _max_priority(*values: Optional[str]) -> str:
    scores = {p: i for i, p in enumerate(PRIORITY_ORDER)}
    best = "LOW"
    for v in values:
        if v and v in scores and scores[v] > scores[best]:
            best = v
    return best


def _visitor_to_priority(status: Optional[str]) -> str:
    mapping = {"LOW": "LOW", "MODERATE": "MODERATE", "HIGH": "HIGH", "CRITICAL": "CRITICAL"}
    return mapping.get(status or "", "LOW")


def _structural_to_priority(condition: Optional[str]) -> str:
    mapping = {"GOOD": "LOW", "FAIR": "MODERATE", "POOR": "HIGH", "CRITICAL": "CRITICAL"}
    return mapping.get(condition or "", "LOW")


def _fallback_report(
    site: HeritageSite,
    visitor_flow: Optional[VisitorFlowResult],
    structural: Optional[StructuralResult],
    encroachment: Optional[EncroachmentResult],
    alerts: List[ConservationAlert],
) -> ConservationReportResult:
    """Deterministic conservation report without Granite."""
    factors = []
    recommendations = []
    priority_votes = []

    if visitor_flow:
        vf_prio = _visitor_to_priority(visitor_flow.status)
        priority_votes.append(vf_prio)
        factors.append(ConservationFactor(
            category="Visitor Pressure",
            description=f"Visitor occupancy at {visitor_flow.occupancy_percent:.1f}% ({visitor_flow.status}). Trend: {visitor_flow.trend}.",
            severity=vf_prio,
            evidence=[
                f"Current simulated visitors: {visitor_flow.current_visitors}/{visitor_flow.capacity}",
                f"Trend: {visitor_flow.trend}",
                *[f"Zone: {z.zone_name} — {z.occupancy_percent:.1f}% ({z.pressure})" for z in visitor_flow.zone_breakdown],
            ],
        ))
        if vf_prio in ("HIGH", "CRITICAL"):
            recommendations.append(ConservationRecommendation(
                priority=1,
                action=visitor_flow.recommended_action,
                rationale=f"Visitor pressure at {visitor_flow.status} level risks physical and atmospheric degradation of heritage fabric.",
                human_verification_required=True,
            ))

    if structural:
        s_prio = _structural_to_priority(structural.condition)
        priority_votes.append(s_prio)
        factors.append(ConservationFactor(
            category="Structural Condition",
            description=f"Demo structural assessment: {structural.condition} condition, {structural.risk_level} risk. {structural.disclaimer}",
            severity=s_prio,
            evidence=structural.observations,
        ))
        if s_prio in ("MODERATE", "HIGH", "CRITICAL"):
            recommendations.append(ConservationRecommendation(
                priority=2,
                action=structural.recommended_action,
                rationale="Demo structural data suggests potential conservation concern — professional inspection required.",
                human_verification_required=True,
            ))

    if encroachment and encroachment.potential_encroachment:
        priority_votes.append("MODERATE")
        factors.append(ConservationFactor(
            category="Potential Encroachment",
            description=f"Demo observation: potential encroachment detected (confidence: {encroachment.confidence:.0%}). {encroachment.disclaimer}",
            severity="MODERATE",
            evidence=encroachment.evidence,
        ))
        recommendations.append(ConservationRecommendation(
            priority=3,
            action=encroachment.recommended_verification,
            rationale="Potential boundary concern flagged — human verification required before any action.",
            human_verification_required=True,
        ))

    if alerts:
        for alert in alerts[:3]:
            factors.append(ConservationFactor(
                category=f"Alert: {alert.category}",
                description=alert.description,
                severity=alert.severity,
                evidence=alert.evidence or [],
            ))
            priority_votes.append(alert.severity)

    if not factors:
        factors.append(ConservationFactor(
            category="General Status",
            description="No significant concerns identified in available demo data.",
            severity="LOW",
            evidence=["Demo data only — full assessment requires live data"],
        ))
        recommendations.append(ConservationRecommendation(
            priority=1,
            action="Maintain routine monitoring and inspection schedule.",
            rationale="No critical issues detected in current demo data.",
            human_verification_required=False,
        ))

    overall_priority = _max_priority(*priority_votes)

    recommendations.append(ConservationRecommendation(
        priority=99,
        action="All conservation decisions require human expert review and appropriate government authority approval.",
        rationale="AI recommendations are decision-support only — not authoritative conservation directives.",
        human_verification_required=True,
    ))
    recommendations.sort(key=lambda r: r.priority)

    summary = (
        f"[DEMO AI REPORT — not an official conservation document]\n"
        f"Conservation priority for {site.name}: {overall_priority}. "
        f"Analysis based on {len(factors)} factor(s) from simulated demo data. "
        f"Human expert review required before any conservation action."
    )

    return ConservationReportResult(
        priority=overall_priority,
        site=site.name,
        site_id=site.id,
        factors=factors,
        recommendations=recommendations,
        human_verification_required=True,
        summary=summary,
        ai_enhanced=False,
        data_source="AI_GENERATED_DEMO",
    )


async def run_conservation_agent(
    request: ConservationReportRequest,
    db: Session,
    visitor_flow: Optional[VisitorFlowResult] = None,
    structural: Optional[StructuralResult] = None,
    encroachment: Optional[EncroachmentResult] = None,
) -> ConservationReportResult:
    """Execute the Conservation Reporting Agent."""
    site = db.query(HeritageSite).filter(HeritageSite.id == request.site_id).first()
    if not site:
        raise ValueError(f"Site not found: {request.site_id}")

    alerts = db.query(ConservationAlert).filter(
        ConservationAlert.site_id == request.site_id,
        ConservationAlert.status == "PENDING_REVIEW",
    ).limit(5).all()

    # Build summary strings for Granite prompt
    vf_status = f"{visitor_flow.status} ({visitor_flow.occupancy_percent:.1f}% occupancy, {visitor_flow.trend} trend)" if visitor_flow else "Unavailable"
    st_status = f"{structural.condition} condition, {structural.risk_level} risk" if structural else "Unavailable"
    enc_status = f"Potential encroachment (confidence {encroachment.confidence:.0%})" if (encroachment and encroachment.potential_encroachment) else ("No encroachment detected" if encroachment else "Unavailable")
    alerts_summary = "; ".join(f"{a.severity}: {a.title}" for a in alerts) or "None"

    # Try Granite-enhanced report
    try:
        prompt = CONSERVATION_PROMPT.format(
            site_name=site.name,
            visitor_flow_status=vf_status,
            structural_status=st_status,
            encroachment_status=enc_status,
            alerts_summary=alerts_summary,
        )
        granite_result = await call_granite_json(prompt, max_tokens=900)
        if granite_result and "priority" in granite_result:
            raw_factors = granite_result.get("factors", [])
            raw_recs = granite_result.get("recommendations", [])

            factors = [
                ConservationFactor(
                    category=f.get("category", ""),
                    description=f.get("description", ""),
                    severity=f.get("severity", "LOW"),
                    evidence=f.get("evidence", []),
                ) for f in raw_factors if isinstance(f, dict)
            ]
            recommendations = [
                ConservationRecommendation(
                    priority=r.get("priority", 1),
                    action=r.get("action", ""),
                    rationale=r.get("rationale", ""),
                    human_verification_required=r.get("human_verification_required", True),
                ) for r in raw_recs if isinstance(r, dict)
            ]
            # Always append human verification reminder
            recommendations.append(ConservationRecommendation(
                priority=99,
                action="All conservation decisions require human expert review and government authority approval.",
                rationale="AI recommendations are decision-support only.",
                human_verification_required=True,
            ))
            recommendations.sort(key=lambda r: r.priority)

            return ConservationReportResult(
                priority=granite_result.get("priority", "MODERATE"),
                site=site.name,
                site_id=site.id,
                factors=factors or _fallback_report(site, visitor_flow, structural, encroachment, alerts).factors,
                recommendations=recommendations,
                human_verification_required=True,
                summary=granite_result.get("summary", f"Conservation assessment for {site.name} — DEMO AI REPORT."),
                ai_enhanced=True,
                data_source="AI_GENERATED_DEMO",
            )
    except Exception as e:
        logger.warning(f"Granite conservation report failed: {e} — using fallback")

    return _fallback_report(site, visitor_flow, structural, encroachment, alerts)
