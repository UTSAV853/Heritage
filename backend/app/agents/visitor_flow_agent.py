"""Visitor Flow Management Agent.

Calculates visitor pressure deterministically.
Uses Granite only for recommendation wording.
"""
from __future__ import annotations
import logging
from datetime import datetime, timedelta
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database.models import HeritageSite, HeritageZone, VisitorMetric
from app.schemas.schemas import VisitorFlowResult, ZoneFlowResult
from app.services.granite_service import call_granite
from app.prompts.prompts import VISITOR_FLOW_PROMPT

logger = logging.getLogger(__name__)

# DEMO / PROPOSED THRESHOLDS — not from an authoritative source
THRESHOLDS = {
    "LOW":      (0,   60),
    "MODERATE": (60,  80),
    "HIGH":     (80,  95),
    "CRITICAL": (95, 200),
}


def _classify_pressure(occupancy_pct: float) -> str:
    for label, (lo, hi) in THRESHOLDS.items():
        if lo <= occupancy_pct < hi:
            return label
    return "CRITICAL"


def _calculate_trend(metrics: List[VisitorMetric]) -> str:
    """Compare last 2 hours vs previous 2 hours."""
    if len(metrics) < 2:
        return "STABLE"
    recent = [m.visitor_count for m in metrics[-4:]]
    older = [m.visitor_count for m in metrics[-8:-4]]
    if not older:
        return "STABLE"
    recent_avg = sum(recent) / len(recent)
    older_avg = sum(older) / len(older)
    if older_avg == 0:
        return "STABLE"
    change = (recent_avg - older_avg) / older_avg
    if change > 0.10:
        return "INCREASING"
    elif change < -0.10:
        return "DECREASING"
    return "STABLE"


def _deterministic_recommendation(status: str, trend: str, critical_zones: List[str]) -> str:
    if status == "CRITICAL":
        return f"Immediate action: halt new entries. Consider temporary closure. Critical zones: {', '.join(critical_zones) or 'site-wide'}."
    elif status == "HIGH":
        zones_msg = f" Focus on: {', '.join(critical_zones)}." if critical_zones else ""
        action = "Redirect visitors to lower-pressure zones." + zones_msg
        if trend == "INCREASING":
            action += " Trend is increasing — activate overflow management protocol."
        return action
    elif status == "MODERATE":
        if trend == "INCREASING":
            return "Moderate pressure with increasing trend — prepare contingency redistribution."
        return "Moderate pressure — monitor and maintain current visitor flow."
    else:
        return "Visitor pressure is low — normal operations recommended."


async def run_visitor_flow_agent(
    site_id: str,
    db: Session,
    override_visitors: Optional[int] = None,
) -> VisitorFlowResult:
    """Execute the Visitor Flow Management Agent."""
    site = db.query(HeritageSite).filter(HeritageSite.id == site_id).first()
    if not site:
        raise ValueError(f"Site not found: {site_id}")

    # Get last 8 hours of site-level metrics
    cutoff = datetime.utcnow() - timedelta(hours=8)
    metrics = (
        db.query(VisitorMetric)
        .filter(VisitorMetric.site_id == site_id, VisitorMetric.zone_id == None, VisitorMetric.timestamp >= cutoff)
        .order_by(VisitorMetric.timestamp)
        .all()
    )

    # Latest metric
    latest = metrics[-1] if metrics else None
    current_visitors = override_visitors or (latest.visitor_count if latest else int(site.total_capacity * 0.5))
    capacity = site.total_capacity

    # Deterministic calculations
    occupancy_pct = round(current_visitors / capacity * 100, 1) if capacity else 0
    status = _classify_pressure(occupancy_pct)
    trend = _calculate_trend(metrics)

    # Zone breakdown
    zone_results: List[ZoneFlowResult] = []
    zones = db.query(HeritageZone).filter(HeritageZone.site_id == site_id).order_by(HeritageZone.order_index).all()
    critical_zones = []

    for zone in zones:
        zone_cutoff = datetime.utcnow() - timedelta(hours=1)
        zone_metric = (
            db.query(VisitorMetric)
            .filter(VisitorMetric.zone_id == zone.id, VisitorMetric.timestamp >= zone_cutoff)
            .order_by(desc(VisitorMetric.timestamp))
            .first()
        )
        zone_visitors = zone_metric.visitor_count if zone_metric else int(zone.capacity * 0.4)
        zone_occupancy = round(zone_visitors / zone.capacity * 100, 1) if zone.capacity else 0
        zone_pressure = _classify_pressure(zone_occupancy)
        if zone_pressure in ("HIGH", "CRITICAL"):
            critical_zones.append(zone.name)
        zone_results.append(ZoneFlowResult(
            zone_id=zone.id,
            zone_name=zone.name,
            visitors=zone_visitors,
            capacity=zone.capacity,
            occupancy_percent=zone_occupancy,
            pressure=zone_pressure,
        ))

    deterministic_rec = _deterministic_recommendation(status, trend, critical_zones)

    # Try Granite for enhanced wording
    ai_enhanced = False
    reason = deterministic_rec
    try:
        prompt = VISITOR_FLOW_PROMPT.format(
            site_name=site.name,
            current_visitors=current_visitors,
            capacity=capacity,
            occupancy_percent=occupancy_pct,
            trend=trend,
            critical_zones=", ".join(critical_zones) if critical_zones else "None",
            deterministic_recommendation=deterministic_rec,
        )
        granite_response = await call_granite(prompt, max_tokens=180)
        if granite_response:
            reason = granite_response
            ai_enhanced = True
    except Exception as e:
        logger.warning(f"Granite visitor flow enhancement failed: {e}")

    confidence = 0.85 if len(metrics) >= 4 else 0.65

    return VisitorFlowResult(
        site_id=site_id,
        site_name=site.name,
        status=status,
        occupancy_percent=occupancy_pct,
        current_visitors=current_visitors,
        capacity=capacity,
        trend=trend,
        critical_zones=critical_zones,
        recommended_action=deterministic_rec,
        reason=reason,
        confidence=confidence,
        zone_breakdown=zone_results,
        data_source="SIMULATED_DEMO",
        ai_enhanced=ai_enhanced,
    )
