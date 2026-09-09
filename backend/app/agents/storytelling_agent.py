"""Personalized Heritage Storytelling Agent.

Retrieves grounded content from the knowledge base.
Uses Granite for personalization — never for fact generation.
"""
from __future__ import annotations
import json
import logging
from typing import List, Optional
from sqlalchemy.orm import Session

from app.database.models import HeritageSite, HeritageZone, HeritageContent, VisitorMetric
from app.schemas.schemas import HeritageGuideRequest, HeritageGuideResult, HeritageStop, VisitorFlowResult
from app.services.granite_service import call_granite_json
from app.prompts.prompts import STORYTELLING_PROMPT

logger = logging.getLogger(__name__)


def _select_content(
    content_items: List[HeritageContent],
    interests: List[str],
    duration_minutes: int,
) -> List[HeritageContent]:
    """Select content items that match interests within time budget."""
    normalized_interests = [i.lower().strip() for i in interests]

    def score(item: HeritageContent) -> float:
        s = 0.0
        item_tags = [t.lower() for t in (item.tags or [])]
        for interest in normalized_interests:
            if interest in item_tags or interest in item.content_type.lower() or interest in item.title.lower():
                s += 2.0
            if any(interest in tag for tag in item_tags):
                s += 1.0
        return s

    scored = sorted(content_items, key=score, reverse=True)
    selected = []
    total_time = 0
    for item in scored:
        if total_time + item.estimated_duration_minutes <= duration_minutes:
            selected.append(item)
            total_time += item.estimated_duration_minutes
        if total_time >= duration_minutes:
            break
    if not selected and scored:
        selected = scored[:2]
    return selected


def _build_content_context(items: List[HeritageContent]) -> str:
    parts = []
    for item in items:
        parts.append(
            f"[{item.content_type.upper()}] {item.title} (Era: {item.era or 'Unknown'})\n"
            f"{item.body}\n"
            f"Source: {item.source}\n"
            f"Estimated visit: {item.estimated_duration_minutes} min\n"
            f"Tags: {', '.join(item.tags or [])}"
        )
    return "\n\n---\n\n".join(parts)


def _build_flow_context(flow: Optional[VisitorFlowResult]) -> str:
    if not flow:
        return "Visitor flow data unavailable."
    lines = [
        f"Site occupancy: {flow.occupancy_percent:.1f}% ({flow.status})",
        f"Trend: {flow.trend}",
    ]
    if flow.zone_breakdown:
        for z in flow.zone_breakdown:
            lines.append(f"  {z.zone_name}: {z.occupancy_percent:.1f}% ({z.pressure})")
    return "\n".join(lines)


def _fallback_itinerary(
    site: HeritageSite,
    selected: List[HeritageContent],
    flow: Optional[VisitorFlowResult],
    request: HeritageGuideRequest,
) -> HeritageGuideResult:
    """Deterministic fallback when Granite is unavailable."""
    stops = []
    # Sort by pressure if crowd avoidance preferred
    zone_pressure = {}
    if flow and request.crowd_preference == "avoid_crowds":
        for zf in flow.zone_breakdown:
            zone_pressure[zf.zone_name] = zf.occupancy_percent

    for item in selected:
        # Map content to zone
        zone_name = site.name  # default
        for z in (flow.zone_breakdown if flow else []):
            if any(k in item.title.lower() for k in z.zone_name.lower().split()):
                zone_name = z.zone_name
                break

        stops.append(HeritageStop(
            zone=zone_name,
            title=item.title,
            description=item.body[:300] + "..." if len(item.body) > 300 else item.body,
            duration_minutes=item.estimated_duration_minutes,
            tags=item.tags or [],
            content_id=item.id,
        ))

    total_duration = sum(s.duration_minutes for s in stops)
    sources = list({item.source for item in selected if item.source})
    interests_str = ", ".join(request.interests) if request.interests else "general heritage"

    return HeritageGuideResult(
        title=f"Your {request.duration_minutes}-Minute Heritage Experience at {site.name}",
        summary=(
            f"A personalized {request.duration_minutes}-minute tour of {site.name} focused on "
            f"{interests_str}. This itinerary covers {len(stops)} key stops based on your preferences "
            f"and current site conditions. [DEMO CONTENT — grounded in verified heritage sources]"
        ),
        recommended_stops=stops,
        reason=(
            f"Selected based on: interests ({interests_str}), "
            f"time budget ({request.duration_minutes} min), "
            f"crowd preference ({request.crowd_preference})."
        ),
        estimated_duration_minutes=total_duration,
        sources=sources,
        ai_enhanced=False,
        data_source="DEMO_CONTENT",
    )


async def run_storytelling_agent(
    request: HeritageGuideRequest,
    db: Session,
    flow_result: Optional[VisitorFlowResult] = None,
) -> HeritageGuideResult:
    """Execute the Personalized Heritage Storytelling Agent."""
    site = db.query(HeritageSite).filter(HeritageSite.id == request.site_id).first()
    if not site:
        raise ValueError(f"Site not found: {request.site_id}")

    # Retrieve relevant content (grounded retrieval)
    all_content = db.query(HeritageContent).filter(HeritageContent.site_id == request.site_id).all()
    if not all_content:
        return HeritageGuideResult(
            title="Insufficient Information",
            summary="Insufficient information available in the current knowledge base for this site.",
            recommended_stops=[],
            reason="No heritage content found for this site.",
            estimated_duration_minutes=0,
            sources=[],
        )

    selected = _select_content(all_content, request.interests, request.duration_minutes)
    content_context = _build_content_context(selected)
    flow_context = _build_flow_context(flow_result)

    # Try Granite for personalized response
    try:
        prompt = STORYTELLING_PROMPT.format(
            site_name=site.name,
            duration_minutes=request.duration_minutes,
            interests=", ".join(request.interests) if request.interests else "general heritage",
            crowd_preference=request.crowd_preference,
            complexity=request.complexity,
            content_context=content_context,
            flow_context=flow_context,
        )
        granite_result = await call_granite_json(prompt, max_tokens=900)
        if granite_result and "recommended_stops" in granite_result:
            # Validate and build result from Granite output
            raw_stops = granite_result.get("recommended_stops", [])
            stops = []
            for rs in raw_stops[:6]:  # cap at 6
                if isinstance(rs, dict) and "title" in rs:
                    stops.append(HeritageStop(
                        zone=rs.get("zone", site.name),
                        title=rs.get("title", "Heritage Stop"),
                        description=rs.get("description", "")[:500],
                        duration_minutes=int(rs.get("duration_minutes", 15)),
                        tags=rs.get("tags", [])[:8],
                        content_id=None,
                    ))

            sources = granite_result.get("sources", [item.source for item in selected])
            return HeritageGuideResult(
                title=granite_result.get("title", f"Your Heritage Experience at {site.name}"),
                summary=granite_result.get("summary", ""),
                recommended_stops=stops or _fallback_itinerary(site, selected, flow_result, request).recommended_stops,
                reason=granite_result.get("reason", ""),
                estimated_duration_minutes=granite_result.get("estimated_duration_minutes", sum(s.duration_minutes for s in stops)),
                sources=sources[:5],
                ai_enhanced=True,
                data_source="DEMO_CONTENT",
            )
    except Exception as e:
        logger.warning(f"Granite storytelling failed: {e} — using fallback")

    return _fallback_itinerary(site, selected, flow_result, request)
