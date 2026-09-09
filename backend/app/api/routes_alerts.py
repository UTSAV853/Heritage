"""API routes — Alerts."""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.database.models import ConservationAlert, HeritageSite
from app.schemas.schemas import AlertListItem, AlertCreateRequest

router = APIRouter(prefix="/alerts", tags=["alerts"])


@router.get("", response_model=List[AlertListItem])
def list_alerts(
    site_id: Optional[str] = Query(None),
    severity: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(ConservationAlert)
    if site_id:
        query = query.filter(ConservationAlert.site_id == site_id)
    if severity:
        query = query.filter(ConservationAlert.severity == severity.upper())
    if status:
        query = query.filter(ConservationAlert.status == status.upper())
    alerts = query.order_by(ConservationAlert.timestamp.desc()).limit(50).all()

    result = []
    for a in alerts:
        site = db.query(HeritageSite).filter(HeritageSite.id == a.site_id).first()
        result.append(AlertListItem(
            id=a.id,
            site_id=a.site_id,
            site_name=site.name if site else None,
            severity=a.severity,
            category=a.category or "",
            agent=a.agent or "",
            title=a.title,
            description=a.description or "",
            evidence=a.evidence or [],
            recommendation=a.recommendation or "",
            status=a.status,
            human_verification_required=a.human_verification_required,
            timestamp=a.timestamp,
            data_source=a.data_source or "SIMULATED_DEMO",
        ))
    return result


@router.post("", response_model=AlertListItem, status_code=201)
def create_alert(request: AlertCreateRequest, db: Session = Depends(get_db)):
    site = db.query(HeritageSite).filter(HeritageSite.id == request.site_id).first()
    if not site:
        raise HTTPException(status_code=404, detail=f"Site '{request.site_id}' not found")
    alert = ConservationAlert(
        site_id=request.site_id,
        severity=request.severity.upper(),
        category=request.category,
        agent=request.agent,
        title=request.title,
        description=request.description,
        evidence=request.evidence,
        recommendation=request.recommendation,
        status="PENDING_REVIEW",
        human_verification_required=True,
        data_source="API_SUBMITTED",
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return AlertListItem(
        id=alert.id,
        site_id=alert.site_id,
        site_name=site.name,
        severity=alert.severity,
        category=alert.category or "",
        agent=alert.agent or "",
        title=alert.title,
        description=alert.description or "",
        evidence=alert.evidence or [],
        recommendation=alert.recommendation or "",
        status=alert.status,
        human_verification_required=alert.human_verification_required,
        timestamp=alert.timestamp,
        data_source=alert.data_source,
    )


@router.patch("/{alert_id}/status")
def update_alert_status(alert_id: str, status: str, db: Session = Depends(get_db)):
    alert = db.query(ConservationAlert).filter(ConservationAlert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    valid_statuses = ["PENDING_REVIEW", "IN_PROGRESS", "RESOLVED"]
    if status.upper() not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Status must be one of {valid_statuses}")
    alert.status = status.upper()
    db.commit()
    return {"id": alert_id, "status": alert.status}
