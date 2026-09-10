"""
HeritageGuardian AI - Agent Routes
Endpoints for all five AI agents + orchestrator.
"""

import os
import uuid
import logging
from pathlib import Path
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Body
from fastapi.responses import JSONResponse, Response
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime

from ..models.db_config import get_db
from ..models.database import (
    Inspection, EncroachmentAlert, AgentLog, ConservationTask, VisitorData, Site
)
from ..orchestrator.orchestrator import orchestrator, get_activity_log
from ..agents.visitor_agent import visitor_agent
from ..services.granite_service import granite_service

router = APIRouter(prefix="/api/agents", tags=["agents"])
logger = logging.getLogger(__name__)

UPLOAD_DIR = Path(os.getenv("UPLOAD_DIR", "./uploads"))
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".tiff"}
MAX_FILE_SIZE_MB = int(os.getenv("MAX_UPLOAD_SIZE_MB", "10"))


def validate_image_upload(file: UploadFile) -> None:
    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File type not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        )


async def save_upload(file: UploadFile) -> str:
    validate_image_upload(file)
    content = await file.read()
    if len(content) > MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"File too large. Max size: {MAX_FILE_SIZE_MB}MB")

    filename = f"{uuid.uuid4().hex}{Path(file.filename or 'upload.jpg').suffix}"
    path = UPLOAD_DIR / filename
    path.write_bytes(content)
    return str(path)


# ─────────────────────────────────────────────
# STRUCTURAL AGENT
# ─────────────────────────────────────────────
@router.post("/structural/analyze")
async def analyze_structural(
    site_name: str = Form(...),
    site_id: Optional[int] = Form(None),
    image: Optional[UploadFile] = File(None),
    previous_image: Optional[UploadFile] = File(None),
    sensor_moisture: Optional[float] = Form(None),
    sensor_temperature: Optional[float] = Form(None),
    db: Session = Depends(get_db)
):
    """Analyze uploaded heritage structure image for damage and deterioration."""
    image_path = None
    prev_image_path = None

    if image and image.filename:
        image_path = await save_upload(image)
    if previous_image and previous_image.filename:
        prev_image_path = await save_upload(previous_image)

    sensor_readings = {}
    if sensor_moisture is not None:
        sensor_readings["moisture_level"] = sensor_moisture
    if sensor_temperature is not None:
        sensor_readings["temperature"] = sensor_temperature

    result = await orchestrator.run_structural_analysis(
        site_name=site_name,
        image_path=image_path,
        previous_image_path=prev_image_path,
        sensor_readings=sensor_readings if sensor_readings else None,
        site_id=site_id
    )

    # Persist to DB if site_id provided
    if site_id:
        try:
            inspection = Inspection(
                site_id=site_id,
                inspection_date=datetime.utcnow(),
                image_path=image_path,
                previous_image_path=prev_image_path,
                risk_level=result["risk_level"],
                risk_score=result["risk_score"],
                confidence_score=result["confidence_score"],
                detected_issues=result["detected_issues"],
                ai_analysis=result.get("granite_reasoning", ""),
                recommendations=result["recommendations"],
                priority=result["priority"],
                sensor_readings=sensor_readings or {}
            )
            db.add(inspection)

            # Update site health score
            site = db.query(Site).filter(Site.id == site_id).first()
            if site:
                site.health_score = 100 - result["risk_score"]

            db.commit()
            result["inspection_id"] = inspection.id
        except Exception as e:
            logger.error(f"DB persist error: {e}")

    return result


@router.get("/structural/demo")
async def structural_demo(site_name: str = "Modhera Sun Temple"):
    """Returns a pre-built demo analysis without requiring image upload."""
    return await orchestrator.run_structural_analysis(site_name=site_name)


# ─────────────────────────────────────────────
# VISITOR AGENT
# ─────────────────────────────────────────────
@router.get("/visitor/demo/{site_name:path}")
async def visitor_demo(site_name: str = "Modhera Sun Temple"):
    """Demo visitor data without DB."""
    return visitor_agent.get_current_visitor_data(site_name)


@router.get("/visitor/{site_id}")
async def get_visitor_data(
    site_id: int,
    db: Session = Depends(get_db)
):
    """Get current visitor flow data for a site."""
    site = db.query(Site).filter(Site.id == site_id).first()
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")

    result = await orchestrator.run_visitor_analysis(
        site_name=site.name,
        max_capacity=site.max_visitor_capacity,
        site_id=site_id
    )

    # Persist snapshot
    try:
        vd = VisitorData(
            site_id=site_id,
            visitor_count=result["current_visitor_count"],
            zone_data=result["zone_data"],
            crowd_level=result["crowd_level"],
            occupancy_percentage=result["occupancy_percentage"],
            peak_hour=result["is_peak_hour"],
            estimated_wait_time=result["estimated_wait_time_minutes"],
            is_simulated=True
        )
        db.add(vd)
        db.commit()
    except Exception as e:
        logger.error(f"Visitor DB error: {e}")

    return result


# ─────────────────────────────────────────────
# ENCROACHMENT AGENT
# ─────────────────────────────────────────────
@router.post("/encroachment/analyze")
async def analyze_encroachment(
    site_name: str = Form(...),
    site_id: Optional[int] = Form(None),
    image: Optional[UploadFile] = File(None),
    historical_image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    """Analyze images for potential encroachment near heritage boundaries."""
    image_path = None
    hist_path = None

    if image and image.filename:
        image_path = await save_upload(image)
    if historical_image and historical_image.filename:
        hist_path = await save_upload(historical_image)

    result = await orchestrator.run_encroachment_analysis(
        site_name=site_name,
        image_path=image_path,
        historical_image_path=hist_path,
        site_id=site_id
    )

    # Persist if detected and site_id provided
    if site_id and result.get("encroachment_detected"):
        try:
            alert = EncroachmentAlert(
                site_id=site_id,
                image_path=image_path,
                historical_image_path=hist_path,
                encroachment_type=result.get("encroachment_type", "Unknown"),
                confidence_score=result.get("confidence", 0),
                severity=result.get("severity", "Unknown"),
                location_description=result.get("detected_changes", [{}])[0].get("location", ""),
                ai_analysis=result.get("granite_reasoning", ""),
                recommended_action="\n".join(result.get("action_plan", []))
            )
            db.add(alert)
            db.commit()
            result["alert_id"] = alert.id
        except Exception as e:
            logger.error(f"Encroachment DB error: {e}")

    return result


@router.get("/encroachment/demo")
async def encroachment_demo(site_name: str = "Modhera Sun Temple"):
    """Demo encroachment analysis."""
    return await orchestrator.run_encroachment_analysis(site_name=site_name)


# ─────────────────────────────────────────────
# STORYTELLING AGENT
# ─────────────────────────────────────────────
class StoryRequest(BaseModel):
    site_name: str = "Ahmedabad Walled City"
    age_group: str = "Adult (30-60)"
    language: str = "English"
    interests: List[str] = ["Architecture", "History"]
    duration_minutes: int = 60
    experience_type: str = "Educational"
    site_id: Optional[int] = None


@router.post("/storytelling/generate")
async def generate_story(request: StoryRequest):
    """Generate personalized heritage story."""
    result = await orchestrator.run_storytelling(
        site_name=request.site_name,
        age_group=request.age_group,
        language=request.language,
        interests=request.interests,
        duration_minutes=request.duration_minutes,
        experience_type=request.experience_type,
        site_id=request.site_id
    )
    return result


@router.get("/storytelling/demo")
async def storytelling_demo(
    site: str = "Modhera Sun Temple",
    language: str = "English",
    age_group: str = "Adult (30-60)"
):
    """Demo story generation."""
    return await orchestrator.run_storytelling(
        site_name=site,
        age_group=age_group,
        language=language,
        interests=["Architecture", "History", "Science"],
        duration_minutes=30
    )


# ─────────────────────────────────────────────
# CONSERVATION REPORTING AGENT
# ─────────────────────────────────────────────
@router.get("/conservation/report/{site_id}")
async def get_conservation_report(
    site_id: int,
    format: str = "json",
    db: Session = Depends(get_db)
):
    """Generate comprehensive conservation report for a site."""
    site = db.query(Site).filter(Site.id == site_id).first()
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")

    tasks = db.query(ConservationTask).filter(
        ConservationTask.site_id == site_id
    ).order_by(ConservationTask.created_at.desc()).limit(10).all()

    tasks_data = [
        {
            "id": t.id,
            "title": t.title,
            "priority": t.priority,
            "status": t.status,
            "deadline": str(t.deadline) if t.deadline else None,
            "assigned_department": t.assigned_department
        }
        for t in tasks
    ]

    report = await orchestrator.run_conservation_report(
        site_name=site.name,
        site_id=site_id,
        max_capacity=site.max_visitor_capacity,
        conservation_tasks=tasks_data
    )

    # Persist as task if high risk
    if report["overall_risk"]["level"] in ["High", "Critical"]:
        try:
            task = ConservationTask(
                site_id=site_id,
                title=f"Auto-generated: {report['overall_risk']['level']} risk detected",
                description=report["executive_summary"],
                priority=report["overall_risk"]["level"],
                status="Open",
                assigned_department="ASI Gujarat Circle",
                source_agents=["structural", "visitor", "encroachment"],
                granite_summary=report["executive_summary"]
            )
            db.add(task)
            db.commit()
        except Exception as e:
            logger.error(f"Task creation error: {e}")

    if format == "csv":
        from ..agents.conservation_agent import conservation_agent
        csv_data = conservation_agent.export_csv(report)
        return Response(
            content=csv_data,
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename=report_{site_id}.csv"}
        )

    return report


@router.get("/conservation/demo")
async def conservation_demo():
    """Demo conservation report."""
    report = await orchestrator.run_conservation_report(
        site_name="Modhera Sun Temple",
        site_id=1
    )
    return report


# ─────────────────────────────────────────────
# CROSS-AGENT SCENARIOS
# ─────────────────────────────────────────────
@router.post("/orchestrator/scenario-a")
async def run_scenario_a(site_name: str = "Modhera Sun Temple", site_id: int = 1):
    """Demo Scenario A: Visitor-Structural cross-agent correlation."""
    return await orchestrator.run_cross_agent_scenario_a(site_name, site_id)


@router.post("/orchestrator/scenario-b")
async def run_scenario_b(site_name: str = "Modhera Sun Temple", site_id: int = 1):
    """Demo Scenario B: Encroachment-Structural cross-agent correlation."""
    return await orchestrator.run_cross_agent_scenario_b(site_name, site_id)


# ─────────────────────────────────────────────
# ACTIVITY LOG
# ─────────────────────────────────────────────
@router.get("/activity-log")
async def get_agent_activity(limit: int = 50):
    """Get recent agent activity log entries."""
    return {"logs": get_activity_log(limit), "count": len(get_activity_log(limit))}


# ─────────────────────────────────────────────
# AI CHAT
# ─────────────────────────────────────────────
class ChatRequest(BaseModel):
    query: str
    site_context: Optional[str] = None


@router.post("/chat")
async def chat(request: ChatRequest):
    """AI chat assistant powered by IBM Granite via orchestrator."""
    if not request.query or len(request.query.strip()) < 3:
        raise HTTPException(status_code=400, detail="Query too short")
    if len(request.query) > 1000:
        raise HTTPException(status_code=400, detail="Query too long (max 1000 chars)")

    response = await orchestrator.handle_chat_query(
        query=request.query.strip(),
        site_context=request.site_context
    )
    return {
        "query": request.query,
        "response": response,
        "timestamp": datetime.utcnow().isoformat(),
        "powered_by": "IBM Granite LLM via HeritageGuardian Orchestrator"
    }


# ─────────────────────────────────────────────
# DASHBOARD OVERVIEW
# ─────────────────────────────────────────────
@router.get("/dashboard/overview")
async def get_dashboard_overview(db: Session = Depends(get_db)):
    """Get top-level dashboard metrics."""
    from ..models.database import StructuralAlert, EncroachmentAlert, ConservationTask, VisitorData

    total_sites = db.query(Site).filter(Site.is_active == True).count()

    healthy_sites = db.query(Site).filter(
        Site.is_active == True,
        Site.health_score >= 70
    ).count()

    sites_needing_attention = db.query(Site).filter(
        Site.is_active == True,
        Site.health_score < 70
    ).count()

    active_structural_alerts = db.query(StructuralAlert).filter(
        StructuralAlert.is_resolved == False
    ).count()

    active_encroachment_alerts = db.query(EncroachmentAlert).filter(
        EncroachmentAlert.is_resolved == False
    ).count()

    open_tasks = db.query(ConservationTask).filter(
        ConservationTask.status != "Completed"
    ).count()

    # Overall heritage health score (average of all sites)
    sites = db.query(Site).filter(Site.is_active == True).all()
    avg_health = sum(s.health_score for s in sites) / len(sites) if sites else 0

    # Latest visitor data per site
    visitor_alerts = 0
    for site in sites:
        vdata = visitor_agent.get_current_visitor_data(site.name, site.max_visitor_capacity)
        if vdata["crowd_level"] in ["Orange", "Red"]:
            visitor_alerts += 1

    return {
        "total_sites": total_sites,
        "healthy_sites": healthy_sites,
        "sites_needing_attention": sites_needing_attention,
        "active_visitor_alerts": visitor_alerts,
        "active_encroachment_alerts": active_encroachment_alerts,
        "active_structural_alerts": active_structural_alerts,
        "open_conservation_tasks": open_tasks,
        "overall_heritage_health_score": round(avg_health, 1),
        "sites": [
            {
                "id": s.id,
                "name": s.name,
                "health_score": s.health_score,
                "latitude": s.latitude,
                "longitude": s.longitude,
                "site_type": s.site_type,
                "unesco_status": s.unesco_status
            }
            for s in sites
        ],
        "data_note": "Visitor data is simulated for demonstration. Structural scores from AI-assisted analysis.",
        "timestamp": datetime.utcnow().isoformat()
    }
