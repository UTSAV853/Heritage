"""API routes — Agent runs/operations center."""
from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.database.models import AgentRun
from app.schemas.schemas import AgentRunSummary
from app.services.granite_service import granite_available

router = APIRouter(prefix="/agents", tags=["agents"])

AGENT_LIST = [
    {
        "id": "orchestrator",
        "name": "Heritage Orchestrator",
        "role": "Central coordinator — parses user goals and dispatches specialized agents",
        "status": "ACTIVE",
        "priority": "P0",
    },
    {
        "id": "visitor-flow",
        "name": "Visitor Flow Management Agent",
        "role": "Analyzes visitor pressure and recommends redistribution",
        "status": "ACTIVE",
        "priority": "P0",
    },
    {
        "id": "storytelling",
        "name": "Personalized Heritage Storytelling Agent",
        "role": "Generates grounded personalized heritage experiences",
        "status": "ACTIVE",
        "priority": "P0",
    },
    {
        "id": "structural",
        "name": "Structural Health Monitoring Agent",
        "role": "Assesses demo structural observations and flags conservation concerns",
        "status": "ACTIVE",
        "priority": "P1",
    },
    {
        "id": "encroachment",
        "name": "Encroachment Detection Agent",
        "role": "Flags potential boundary violations for human verification",
        "status": "ACTIVE",
        "priority": "P1",
    },
    {
        "id": "conservation",
        "name": "Conservation Reporting Agent",
        "role": "Synthesizes agent outputs into prioritized conservation recommendations",
        "status": "ACTIVE",
        "priority": "P0",
    },
]


@router.get("")
def list_agents():
    return {
        "agents": AGENT_LIST,
        "granite_available": granite_available(),
        "demo_mode": not granite_available(),
    }


@router.get("/runs", response_model=List[AgentRunSummary])
def list_agent_runs(
    request_id: Optional[str] = Query(None),
    agent: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    limit: int = Query(default=50, le=200),
    db: Session = Depends(get_db),
):
    query = db.query(AgentRun)
    if request_id:
        query = query.filter(AgentRun.request_id == request_id)
    if agent:
        query = query.filter(AgentRun.agent.ilike(f"%{agent}%"))
    if status:
        query = query.filter(AgentRun.status == status.upper())
    runs = query.order_by(AgentRun.created_at.desc()).limit(limit).all()
    return [
        AgentRunSummary(
            id=r.id,
            request_id=r.request_id,
            agent=r.agent,
            status=r.status,
            start_time=r.start_time,
            end_time=r.end_time,
            duration_ms=r.duration_ms,
            input_summary=r.input_summary,
            output_summary=r.output_summary,
            error=r.error,
        )
        for r in runs
    ]
