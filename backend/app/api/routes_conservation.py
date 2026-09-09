"""API routes — Conservation Reports."""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.database.models import ConservationReport, HeritageSite
from app.schemas.schemas import ConservationReportRequest, ConservationReportResult
from app.agents.conservation_agent import run_conservation_agent

router = APIRouter(prefix="/conservation", tags=["conservation"])


@router.post("/report", response_model=ConservationReportResult)
async def generate_conservation_report(
    request: ConservationReportRequest,
    db: Session = Depends(get_db),
):
    try:
        return await run_conservation_agent(request, db)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Conservation report failed: {e}")


@router.get("/sites/{site_id}", response_model=List[dict])
def get_site_conservation_history(
    site_id: str,
    limit: int = Query(default=10, le=50),
    db: Session = Depends(get_db),
):
    site = db.query(HeritageSite).filter(
        (HeritageSite.id == site_id) | (HeritageSite.slug == site_id)
    ).first()
    if not site:
        raise HTTPException(status_code=404, detail=f"Site '{site_id}' not found")
    reports = (
        db.query(ConservationReport)
        .filter(ConservationReport.site_id == site.id)
        .order_by(ConservationReport.created_at.desc())
        .limit(limit)
        .all()
    )
    return [
        {
            "id": r.id,
            "site_id": r.site_id,
            "request_id": r.request_id,
            "priority": r.priority,
            "summary": r.summary,
            "factors": r.factors,
            "recommendations": r.recommendations,
            "human_verification_required": r.human_verification_required,
            "visitor_flow_status": r.visitor_flow_status,
            "structural_status": r.structural_status,
            "encroachment_status": r.encroachment_status,
            "data_source": r.data_source,
            "created_at": r.created_at.isoformat() if r.created_at else None,
        }
        for r in reports
    ]
