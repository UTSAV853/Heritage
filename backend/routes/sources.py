"""
HeritageGuardian AI - Data Sources & Ingestion Management Routes
Provides source discovery, health probes, ingestion logs, and manual refresh controls.
"""

from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime

from ..models.db_config import get_db
from ..models.database import DataSource, IngestionRun
from ..ingestion.engine.ingestion_engine import ingestion_engine

router = APIRouter(prefix="/api/sources", tags=["sources"])


class DataSourceResponse(BaseModel):
    id: int
    name: str
    domain: Optional[str]
    source_url: Optional[str]
    source_type: Optional[str]
    authority_tier: Optional[str]
    country_scope: Optional[str]
    reliability_score: float
    is_active: bool
    last_successful_retrieval: Optional[datetime]
    last_failed_retrieval: Optional[datetime]
    failure_count: int
    records_count: int
    rate_limit_per_minute: int

    class Config:
        from_attributes = True


@router.get("", response_model=List[DataSourceResponse])
@router.get("/", response_model=List[DataSourceResponse])
def get_all_sources(db: Session = Depends(get_db)):
    """List all registered external and internal heritage data sources."""
    return db.query(DataSource).order_by(DataSource.authority_tier.asc(), DataSource.name.asc()).all()


@router.get("/{source_id}", response_model=DataSourceResponse)
def get_source(source_id: int, db: Session = Depends(get_db)):
    """Get single data source details with connectivity metadata."""
    source = db.query(DataSource).filter(DataSource.id == source_id).first()
    if not source:
        raise HTTPException(status_code=404, detail="Data source not found")
    return source


@router.post("/{source_id}/refresh")
async def refresh_source(
    source_id: int,
    site_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Trigger manual on-demand ingestion run for a specific source.
    """
    source = db.query(DataSource).filter(DataSource.id == source_id).first()
    if not source:
        raise HTTPException(status_code=404, detail="Data source not found")

    result = await ingestion_engine.run_source_ingestion(db, source_id, site_id)
    return result


@router.get("/health/probe")
async def probe_all_adapters():
    """Probe connectivity across all registered ingestion adapters."""
    results = {}
    for name, adapter in ingestion_engine._adapters.items():
        try:
            status = await adapter.health_check()
            results[name] = status
        except Exception as e:
            results[name] = {"status": "UNAVAILABLE", "message": str(e)}
    return {"adapters": results, "timestamp": datetime.utcnow().isoformat()}
