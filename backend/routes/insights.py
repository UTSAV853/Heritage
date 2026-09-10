"""
HeritageGuardian AI - Traceable Conservation Insights & Unified Alerts Routes
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime

from ..models.db_config import get_db
from ..models.database import UnifiedAlert, ConservationInsight, Site

router = APIRouter(prefix="/api/insights", tags=["insights"])


@router.get("")
@router.get("/")
def get_insights(
    site_id: Optional[int] = None,
    category: Optional[str] = None,
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    List evidence-traceable conservation insights.
    """
    q = db.query(ConservationInsight)
    if site_id:
        q = q.filter(ConservationInsight.site_id == site_id)
    if category:
        q = q.filter(ConservationInsight.insight_category == category)

    insights = q.order_by(ConservationInsight.created_at.desc()).limit(limit).all()

    return [
        {
            "id": i.id,
            "site_id": i.site_id,
            "site_name": i.site.name if i.site else None,
            "insight_category": i.insight_category,
            "title": i.title,
            "summary": i.summary,
            "deterministic_evidence": i.deterministic_evidence,
            "granite_interpretation": i.granite_interpretation,
            "uncertainty_score": i.uncertainty_score,
            "action_priority": i.action_priority,
            "requires_human_review": i.requires_human_review,
            "created_at": i.created_at.isoformat() if i.created_at else None
        }
        for i in insights
    ]


@router.get("/site/{site_id}")
def get_insights_for_site(site_id: int, db: Session = Depends(get_db)):
    """Get insights specific to a heritage site."""
    site = db.query(Site).filter(Site.id == site_id).first()
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")
    return get_insights(site_id=site_id, db=db)


# ─────────────────────────────────────────────
# UNIFIED ALERTS ENDPOINTS
# ─────────────────────────────────────────────
alerts_router = APIRouter(prefix="/api/alerts", tags=["alerts"])


class AlertReviewRequest(BaseModel):
    action: str  # VERIFY, DISMISS, RESOLVE
    notes: Optional[str] = None
    officer_name: Optional[str] = "Heritage Officer"


@alerts_router.get("")
@alerts_router.get("/")
def get_unified_alerts(
    site_id: Optional[int] = None,
    severity: Optional[str] = None,
    review_status: Optional[str] = None,
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db)
):
    """
    Get all active unified alerts with deterministic evidence and human review status.
    """
    q = db.query(UnifiedAlert)
    if site_id:
        q = q.filter(UnifiedAlert.site_id == site_id)
    if severity:
        q = q.filter(UnifiedAlert.severity == severity)
    if review_status:
        q = q.filter(UnifiedAlert.human_review_status == review_status)

    alerts = q.order_by(UnifiedAlert.created_at.desc()).limit(limit).all()

    return [
        {
            "id": a.id,
            "site_id": a.site_id,
            "site_name": a.site.name if a.site else None,
            "observation_id": a.observation_id,
            "alert_type": a.alert_type,
            "severity": a.severity,
            "title": a.title,
            "description": a.description,
            "evidence": a.evidence,
            "detection_method": a.detection_method,
            "recommended_action": a.recommended_action,
            "human_review_status": a.human_review_status,
            "created_at": a.created_at.isoformat() if a.created_at else None,
            "resolved_at": a.resolved_at.isoformat() if a.resolved_at else None
        }
        for a in alerts
    ]


@alerts_router.post("/{alert_id}/review")
def review_unified_alert(
    alert_id: int,
    req: AlertReviewRequest,
    db: Session = Depends(get_db)
):
    """
    Update human review status of an alert (VERIFY, DISMISS, RESOLVE).
    """
    alert = db.query(UnifiedAlert).filter(UnifiedAlert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    act = req.action.upper()
    if act == "RESOLVE":
        alert.human_review_status = "RESOLVED"
        alert.resolved_at = datetime.utcnow()
    elif act == "VERIFY":
        alert.human_review_status = "VERIFIED"
    elif act == "DISMISS":
        alert.human_review_status = "DISMISSED"
        alert.resolved_at = datetime.utcnow()
    else:
        raise HTTPException(status_code=400, detail="Action must be VERIFY, DISMISS, or RESOLVE.")

    db.commit()
    return {
        "status": "success",
        "alert_id": alert.id,
        "human_review_status": alert.human_review_status,
        "resolved_at": alert.resolved_at.isoformat() if alert.resolved_at else None,
        "officer_notes": req.notes
    }
