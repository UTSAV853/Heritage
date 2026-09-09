"""API routes — Orchestrator."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.schemas.schemas import OrchestratorRequest, OrchestratorResult
from app.orchestrator.orchestrator import run_orchestrator

router = APIRouter(prefix="/orchestrator", tags=["orchestrator"])


@router.post("/run", response_model=OrchestratorResult)
async def run_orchestrator_endpoint(request: OrchestratorRequest, db: Session = Depends(get_db)):
    try:
        return await run_orchestrator(request, db)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        import traceback
        raise HTTPException(status_code=500, detail=f"Orchestrator failed: {e}\n{traceback.format_exc()}")
