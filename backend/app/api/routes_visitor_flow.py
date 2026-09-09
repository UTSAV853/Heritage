"""API routes — Visitor Flow."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.schemas.schemas import VisitorFlowResult, VisitorFlowAnalyzeRequest
from app.agents.visitor_flow_agent import run_visitor_flow_agent

router = APIRouter(prefix="/visitor-flow", tags=["visitor-flow"])


@router.get("/{site_id}", response_model=VisitorFlowResult)
async def get_visitor_flow(site_id: str, db: Session = Depends(get_db)):
    try:
        return await run_visitor_flow_agent(site_id, db)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Visitor flow analysis failed: {e}")


@router.post("/analyze", response_model=VisitorFlowResult)
async def analyze_visitor_flow(request: VisitorFlowAnalyzeRequest, db: Session = Depends(get_db)):
    try:
        return await run_visitor_flow_agent(request.site_id, db, override_visitors=request.override_visitors)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Visitor flow analysis failed: {e}")
