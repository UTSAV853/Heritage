"""
HeritageGuardian AI - Sites Routes
CRUD endpoints for heritage site management.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

from ..models.db_config import get_db
from ..models.database import Site

router = APIRouter(prefix="/api/sites", tags=["sites"])


class SiteResponse(BaseModel):
    id: int
    name: str
    location: Optional[str]
    description: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]
    site_type: Optional[str]
    established_year: Optional[int]
    unesco_status: bool
    max_visitor_capacity: int
    health_score: float
    is_active: bool

    class Config:
        from_attributes = True


@router.get("/", response_model=List[SiteResponse])
def get_all_sites(db: Session = Depends(get_db)):
    return db.query(Site).filter(Site.is_active == True).all()


@router.get("/{site_id}", response_model=SiteResponse)
def get_site(site_id: int, db: Session = Depends(get_db)):
    site = db.query(Site).filter(Site.id == site_id).first()
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")
    return site


@router.get("/{site_id}/summary")
def get_site_summary(site_id: int, db: Session = Depends(get_db)):
    """Get comprehensive site summary including all alert counts."""
    site = db.query(Site).filter(Site.id == site_id).first()
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")

    from ..models.database import StructuralAlert, EncroachmentAlert, ConservationTask
    active_structural = db.query(StructuralAlert).filter(
        StructuralAlert.site_id == site_id,
        StructuralAlert.is_resolved == False
    ).count()
    active_encroachment = db.query(EncroachmentAlert).filter(
        EncroachmentAlert.site_id == site_id,
        EncroachmentAlert.is_resolved == False
    ).count()
    open_tasks = db.query(ConservationTask).filter(
        ConservationTask.site_id == site_id,
        ConservationTask.status != "Completed"
    ).count()

    return {
        "site": {
            "id": site.id,
            "name": site.name,
            "location": site.location,
            "latitude": site.latitude,
            "longitude": site.longitude,
            "site_type": site.site_type,
            "health_score": site.health_score,
            "unesco_status": site.unesco_status,
            "max_visitor_capacity": site.max_visitor_capacity
        },
        "alerts": {
            "structural": active_structural,
            "encroachment": active_encroachment,
            "conservation_tasks": open_tasks
        }
    }
