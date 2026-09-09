"""API routes — Sites."""
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.database.models import HeritageSite, HeritageZone
from app.schemas.schemas import SiteListItem, SiteDetail, ZoneSummary

router = APIRouter(prefix="/sites", tags=["sites"])


@router.get("", response_model=List[SiteListItem])
def list_sites(db: Session = Depends(get_db)):
    sites = db.query(HeritageSite).all()
    return [
        SiteListItem(
            id=s.id, name=s.name, slug=s.slug,
            description=s.description or "",
            location=s.location or "",
            site_type=s.site_type or "",
            total_capacity=s.total_capacity or 0,
            tags=s.tags or [],
        )
        for s in sites
    ]


@router.get("/{site_id}", response_model=SiteDetail)
def get_site(site_id: str, db: Session = Depends(get_db)):
    site = db.query(HeritageSite).filter(
        (HeritageSite.id == site_id) | (HeritageSite.slug == site_id)
    ).first()
    if not site:
        raise HTTPException(status_code=404, detail=f"Site '{site_id}' not found")
    zones = db.query(HeritageZone).filter(HeritageZone.site_id == site.id).order_by(HeritageZone.order_index).all()
    return SiteDetail(
        id=site.id, name=site.name, slug=site.slug,
        description=site.description or "",
        location=site.location or "",
        site_type=site.site_type or "",
        total_capacity=site.total_capacity or 0,
        tags=site.tags or [],
        established_year=site.established_year,
        state=site.state or "Gujarat",
        country=site.country or "India",
        zones=[ZoneSummary(id=z.id, name=z.name, slug=z.slug, capacity=z.capacity, zone_type=z.zone_type) for z in zones],
        data_source=site.data_source or "VERIFIED_PUBLIC",
    )
