"""API routes — Heritage Guide (Storytelling)."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.schemas.schemas import HeritageGuideRequest, HeritageGuideResult
from app.agents.storytelling_agent import run_storytelling_agent

router = APIRouter(prefix="/heritage-guide", tags=["heritage-guide"])


@router.post("", response_model=HeritageGuideResult)
async def generate_heritage_guide(request: HeritageGuideRequest, db: Session = Depends(get_db)):
    try:
        return await run_storytelling_agent(request, db)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Heritage guide generation failed: {e}")
