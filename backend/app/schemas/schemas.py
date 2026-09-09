"""Pydantic schemas for request/response validation."""
from __future__ import annotations
from typing import List, Optional, Any, Dict
from datetime import datetime
from pydantic import BaseModel, Field


# ─── Site schemas ────────────────────────────────────────────────────────────

class ZoneSummary(BaseModel):
    id: str
    name: str
    slug: str
    capacity: int
    zone_type: str

class SiteListItem(BaseModel):
    id: str
    name: str
    slug: str
    description: str
    location: str
    site_type: str
    total_capacity: int
    tags: List[str]

class SiteDetail(SiteListItem):
    established_year: Optional[int]
    state: str
    country: str
    zones: List[ZoneSummary]
    data_source: str


# ─── Visitor Flow schemas ─────────────────────────────────────────────────────

class ZoneFlowResult(BaseModel):
    zone_id: str
    zone_name: str
    visitors: int
    capacity: int
    occupancy_percent: float
    pressure: str  # LOW / MODERATE / HIGH / CRITICAL

class VisitorFlowResult(BaseModel):
    site_id: str
    site_name: str
    status: str  # LOW / MODERATE / HIGH / CRITICAL
    occupancy_percent: float
    current_visitors: int
    capacity: int
    trend: str  # INCREASING / STABLE / DECREASING
    critical_zones: List[str]
    recommended_action: str
    reason: str
    confidence: float
    zone_breakdown: List[ZoneFlowResult]
    data_source: str = "SIMULATED_DEMO"
    ai_enhanced: bool = False

class VisitorFlowAnalyzeRequest(BaseModel):
    site_id: str
    override_visitors: Optional[int] = None


# ─── Heritage Guide (Storytelling) schemas ─────────────────────────────────

class HeritageStop(BaseModel):
    zone: str
    title: str
    description: str
    duration_minutes: int
    tags: List[str]
    content_id: Optional[str] = None

class HeritageGuideRequest(BaseModel):
    site_id: str
    duration_minutes: int = Field(default=60, ge=15, le=480)
    interests: List[str] = Field(default_factory=list)
    crowd_preference: str = Field(default="any")  # avoid_crowds / moderate / any
    complexity: str = Field(default="moderate")  # simple / moderate / detailed

class HeritageGuideResult(BaseModel):
    title: str
    summary: str
    recommended_stops: List[HeritageStop]
    reason: str
    estimated_duration_minutes: int
    sources: List[str]
    ai_enhanced: bool = False
    data_source: str = "DEMO_CONTENT"


# ─── Structural Health schemas ────────────────────────────────────────────────

class StructuralResult(BaseModel):
    site_id: str
    site_name: str
    condition: str  # GOOD / FAIR / POOR / CRITICAL
    risk_level: str  # LOW / MODERATE / HIGH / CRITICAL
    observations: List[str]
    recommended_action: str
    confidence: float
    human_inspection_required: bool
    data_source: str = "SIMULATED_DEMO"
    disclaimer: str = "DEMO DATA — not a professional structural engineering assessment. Human inspection required."


# ─── Encroachment schemas ─────────────────────────────────────────────────────

class EncroachmentResult(BaseModel):
    site_id: str
    potential_encroachment: bool
    confidence: float
    evidence: List[str]
    recommended_verification: str
    status: str
    data_source: str = "SIMULATED_DEMO"
    disclaimer: str = "Potential encroachment — human verification required. Do not take legal action based on this automated demo alert."


# ─── Conservation Report schemas ──────────────────────────────────────────────

class ConservationFactor(BaseModel):
    category: str
    description: str
    severity: str
    evidence: List[str]

class ConservationRecommendation(BaseModel):
    priority: int
    action: str
    rationale: str
    human_verification_required: bool

class ConservationReportResult(BaseModel):
    priority: str  # LOW / MODERATE / HIGH / CRITICAL
    site: str
    site_id: str
    factors: List[ConservationFactor]
    recommendations: List[ConservationRecommendation]
    human_verification_required: bool
    summary: str
    ai_enhanced: bool = False
    data_source: str = "AI_GENERATED_DEMO"

class ConservationReportRequest(BaseModel):
    site_id: str
    include_visitor_flow: bool = True
    include_structural: bool = True
    include_encroachment: bool = True


# ─── Orchestrator schemas ─────────────────────────────────────────────────────

class OrchestratorRequest(BaseModel):
    site_id: str
    duration_minutes: int = Field(default=60, ge=15, le=480)
    interests: List[str] = Field(default_factory=list)
    crowd_preference: str = "any"
    complexity: str = "moderate"
    run_conservation: bool = True

class AgentRunSummary(BaseModel):
    id: str
    request_id: str
    agent: str
    status: str
    start_time: Optional[datetime]
    end_time: Optional[datetime]
    duration_ms: Optional[int]
    input_summary: Optional[str]
    output_summary: Optional[str]
    error: Optional[str]

class OrchestratorResult(BaseModel):
    request_id: str
    site_id: str
    site_name: str
    status: str  # SUCCESS / PARTIAL / FAILED
    visitor_flow: Optional[VisitorFlowResult]
    heritage_guide: Optional[HeritageGuideResult]
    structural: Optional[StructuralResult]
    conservation: Optional[ConservationReportResult]
    agent_runs: List[AgentRunSummary]
    degraded_agents: List[str]
    degraded_message: Optional[str]
    completed_at: datetime


# ─── Alert schemas ────────────────────────────────────────────────────────────

class AlertListItem(BaseModel):
    id: str
    site_id: str
    site_name: Optional[str]
    severity: str
    category: str
    agent: str
    title: str
    description: str
    evidence: List[str]
    recommendation: str
    status: str
    human_verification_required: bool
    timestamp: datetime
    data_source: str

class AlertCreateRequest(BaseModel):
    site_id: str
    severity: str
    category: str
    agent: str
    title: str
    description: str
    evidence: List[str] = Field(default_factory=list)
    recommendation: str = ""


# ─── Health schema ────────────────────────────────────────────────────────────

class HealthResponse(BaseModel):
    status: str
    version: str
    database: str
    demo_mode: bool
    granite_available: bool
    timestamp: datetime
