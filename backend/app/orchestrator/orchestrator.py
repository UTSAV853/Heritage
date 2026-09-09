"""Heritage Orchestrator — central coordination of all agents."""
from __future__ import annotations
import uuid
import logging
from datetime import datetime
from typing import List, Optional, Tuple
from sqlalchemy.orm import Session

from app.database.models import AgentRun, HeritageSite, ConservationReport
from app.schemas.schemas import (
    OrchestratorRequest, OrchestratorResult, AgentRunSummary,
    HeritageGuideRequest, ConservationReportRequest,
    VisitorFlowResult, HeritageGuideResult, StructuralResult, EncroachmentResult, ConservationReportResult,
)
from app.agents.visitor_flow_agent import run_visitor_flow_agent
from app.agents.storytelling_agent import run_storytelling_agent
from app.agents.structural_agent import run_structural_agent
from app.agents.encroachment_agent import run_encroachment_agent
from app.agents.conservation_agent import run_conservation_agent

logger = logging.getLogger(__name__)

AGENT_ORCHESTRATOR = "Heritage Orchestrator"
AGENT_VISITOR_FLOW = "Visitor Flow Agent"
AGENT_STORYTELLING = "Heritage Storytelling Agent"
AGENT_STRUCTURAL = "Structural Health Agent"
AGENT_ENCROACHMENT = "Encroachment Detection Agent"
AGENT_CONSERVATION = "Conservation Reporting Agent"


def _log_run_start(db: Session, request_id: str, agent: str, input_summary: str) -> AgentRun:
    run = AgentRun(
        id=str(uuid.uuid4()),
        request_id=request_id,
        agent=agent,
        status="RUNNING",
        start_time=datetime.utcnow(),
        input_summary=input_summary[:500],
    )
    db.add(run)
    db.commit()
    db.refresh(run)
    return run


def _log_run_end(db: Session, run: AgentRun, status: str, output_summary: str = "", error: str = ""):
    run.status = status
    run.end_time = datetime.utcnow()
    run.duration_ms = int((run.end_time - run.start_time).total_seconds() * 1000)
    run.output_summary = output_summary[:500]
    run.error = error[:500] if error else None
    db.commit()


def _run_summary(run: AgentRun) -> AgentRunSummary:
    return AgentRunSummary(
        id=run.id,
        request_id=run.request_id,
        agent=run.agent,
        status=run.status,
        start_time=run.start_time,
        end_time=run.end_time,
        duration_ms=run.duration_ms,
        input_summary=run.input_summary,
        output_summary=run.output_summary,
        error=run.error,
    )


async def run_orchestrator(request: OrchestratorRequest, db: Session) -> OrchestratorResult:
    """Execute the Heritage Orchestrator workflow."""
    request_id = str(uuid.uuid4())
    degraded_agents: List[str] = []
    agent_runs: List[AgentRun] = []

    # Log orchestrator start
    orch_run = _log_run_start(
        db, request_id, AGENT_ORCHESTRATOR,
        f"site={request.site_id} duration={request.duration_minutes}min interests={request.interests}"
    )
    agent_runs.append(orch_run)

    site = db.query(HeritageSite).filter(HeritageSite.id == request.site_id).first()
    if not site:
        _log_run_end(db, orch_run, "FAILED", error=f"Site not found: {request.site_id}")
        raise ValueError(f"Site not found: {request.site_id}")

    visitor_flow: Optional[VisitorFlowResult] = None
    heritage_guide: Optional[HeritageGuideResult] = None
    structural: Optional[StructuralResult] = None
    encroachment: Optional[EncroachmentResult] = None
    conservation: Optional[ConservationReportResult] = None

    # ── Agent 1: Visitor Flow ─────────────────────────────────────────────────
    vf_run = _log_run_start(db, request_id, AGENT_VISITOR_FLOW, f"site={request.site_id}")
    agent_runs.append(vf_run)
    try:
        visitor_flow = await run_visitor_flow_agent(request.site_id, db)
        _log_run_end(
            db, vf_run, "SUCCESS",
            f"status={visitor_flow.status} occupancy={visitor_flow.occupancy_percent}% trend={visitor_flow.trend}"
        )
    except Exception as e:
        logger.error(f"Visitor Flow Agent failed: {e}")
        _log_run_end(db, vf_run, "FAILED", error=str(e))
        degraded_agents.append(AGENT_VISITOR_FLOW)

    # ── Agent 2: Heritage Storytelling ────────────────────────────────────────
    story_run = _log_run_start(
        db, request_id, AGENT_STORYTELLING,
        f"interests={request.interests} duration={request.duration_minutes}min crowd={request.crowd_preference}"
    )
    agent_runs.append(story_run)
    try:
        guide_request = HeritageGuideRequest(
            site_id=request.site_id,
            duration_minutes=request.duration_minutes,
            interests=request.interests,
            crowd_preference=request.crowd_preference,
            complexity=request.complexity,
        )
        heritage_guide = await run_storytelling_agent(guide_request, db, flow_result=visitor_flow)
        _log_run_end(
            db, story_run, "SUCCESS",
            f"stops={len(heritage_guide.recommended_stops)} duration={heritage_guide.estimated_duration_minutes}min ai={heritage_guide.ai_enhanced}"
        )
    except Exception as e:
        logger.error(f"Storytelling Agent failed: {e}")
        _log_run_end(db, story_run, "FAILED", error=str(e))
        degraded_agents.append(AGENT_STORYTELLING)

    # ── Agent 3: Structural Health ─────────────────────────────────────────────
    struct_run = _log_run_start(db, request_id, AGENT_STRUCTURAL, f"site={request.site_id}")
    agent_runs.append(struct_run)
    try:
        structural = await run_structural_agent(request.site_id, db)
        _log_run_end(
            db, struct_run, "SUCCESS",
            f"condition={structural.condition} risk={structural.risk_level}"
        )
    except Exception as e:
        logger.error(f"Structural Agent failed: {e}")
        _log_run_end(db, struct_run, "FAILED", error=str(e))
        degraded_agents.append(AGENT_STRUCTURAL)

    # ── Agent 4: Encroachment ─────────────────────────────────────────────────
    enc_run = _log_run_start(db, request_id, AGENT_ENCROACHMENT, f"site={request.site_id}")
    agent_runs.append(enc_run)
    try:
        encroachment = await run_encroachment_agent(request.site_id, db)
        _log_run_end(
            db, enc_run, "SUCCESS",
            f"potential={encroachment.potential_encroachment} confidence={encroachment.confidence}"
        )
    except Exception as e:
        logger.error(f"Encroachment Agent failed: {e}")
        _log_run_end(db, enc_run, "FAILED", error=str(e))
        degraded_agents.append(AGENT_ENCROACHMENT)

    # ── Agent 5: Conservation (always continues even if others fail) ───────────
    cons_run = _log_run_start(
        db, request_id, AGENT_CONSERVATION,
        f"vf={'ok' if visitor_flow else 'failed'} struct={'ok' if structural else 'failed'}"
    )
    agent_runs.append(cons_run)
    try:
        if request.run_conservation:
            cons_request = ConservationReportRequest(
                site_id=request.site_id,
                include_visitor_flow=visitor_flow is not None,
                include_structural=structural is not None,
                include_encroachment=encroachment is not None,
            )
            conservation = await run_conservation_agent(
                cons_request, db,
                visitor_flow=visitor_flow,
                structural=structural,
                encroachment=encroachment,
            )
            # Persist to DB
            report_record = ConservationReport(
                site_id=request.site_id,
                request_id=request_id,
                priority=conservation.priority,
                factors=[f.model_dump() for f in conservation.factors],
                recommendations=[r.model_dump() for r in conservation.recommendations],
                human_verification_required=conservation.human_verification_required,
                visitor_flow_status=visitor_flow.status if visitor_flow else None,
                structural_status=structural.condition if structural else None,
                encroachment_status="POTENTIAL" if (encroachment and encroachment.potential_encroachment) else "CLEAR",
                summary=conservation.summary,
                data_source="AI_GENERATED_DEMO",
            )
            db.add(report_record)
            db.commit()
            _log_run_end(
                db, cons_run, "SUCCESS",
                f"priority={conservation.priority} ai={conservation.ai_enhanced}"
            )
        else:
            _log_run_end(db, cons_run, "SKIPPED", "Conservation analysis not requested")
    except Exception as e:
        logger.error(f"Conservation Agent failed: {e}")
        _log_run_end(db, cons_run, "FAILED", error=str(e))
        degraded_agents.append(AGENT_CONSERVATION)

    # ── Finalize Orchestrator ─────────────────────────────────────────────────
    overall_status = "SUCCESS"
    if len(degraded_agents) == 5:
        overall_status = "FAILED"
    elif degraded_agents:
        overall_status = "PARTIAL"

    degraded_message = None
    if degraded_agents:
        degraded_message = (
            f"Some analysis was unavailable. The following agents encountered issues: "
            f"{', '.join(degraded_agents)}. "
            f"Recommendation generated from available validated inputs."
        )

    _log_run_end(
        db, orch_run, overall_status,
        f"agents_ok={5 - len(degraded_agents)}/5 degraded={degraded_agents}"
    )

    return OrchestratorResult(
        request_id=request_id,
        site_id=request.site_id,
        site_name=site.name,
        status=overall_status,
        visitor_flow=visitor_flow,
        heritage_guide=heritage_guide,
        structural=structural,
        conservation=conservation,
        agent_runs=[_run_summary(r) for r in agent_runs],
        degraded_agents=degraded_agents,
        degraded_message=degraded_message,
        completed_at=datetime.utcnow(),
    )
