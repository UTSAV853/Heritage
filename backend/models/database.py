"""
HeritageGuardian AI - Database Models
SQLAlchemy ORM models for all heritage monitoring entities.
Extended for Global Heritage, Multi-Source Ingestion, Observations, and Unified Intelligence.
"""

from sqlalchemy import (
    Column, Integer, String, Float, DateTime, Text, Boolean,
    ForeignKey, JSON, Enum as SAEnum
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

Base = declarative_base()


class RiskLevel(str, enum.Enum):
    HEALTHY = "Healthy"
    LOW_RISK = "Low Risk"
    MODERATE_RISK = "Moderate Risk"
    HIGH_RISK = "High Risk"
    CRITICAL = "Critical"


class CrowdLevel(str, enum.Enum):
    GREEN = "Green"
    YELLOW = "Yellow"
    ORANGE = "Orange"
    RED = "Red"


class DataOrigin(str, enum.Enum):
    EXTERNAL_SOURCE = "EXTERNAL_SOURCE"
    MANUAL_ENTRY = "MANUAL_ENTRY"
    IMPORTED_DATA = "IMPORTED_DATA"
    SIMULATED = "SIMULATED"


class RecordStatus(str, enum.Enum):
    NEW = "NEW"
    VALIDATED = "VALIDATED"
    PROCESSED = "PROCESSED"
    DUPLICATE = "DUPLICATE"
    REJECTED = "REJECTED"
    FAILED = "FAILED"


class AuthorityTier(str, enum.Enum):
    TIER_1 = "TIER_1"  # Official government & international heritage authorities (UNESCO, ASI)
    TIER_2 = "TIER_2"  # Recognized research, museums, conservation NGOs (ICOMOS, WMF)
    TIER_3 = "TIER_3"  # Established news & media organizations
    TIER_4 = "TIER_4"  # Other public feeds & citizen observations


# ─────────────────────────────────────────────
# GLOBAL GEOGRAPHIC HIERARCHY
# Country -> Region/State -> City -> Heritage Site -> Zone
# ─────────────────────────────────────────────

class Country(Base):
    __tablename__ = "countries"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    code = Column(String(10), unique=True, nullable=False)  # ISO code e.g. IND, FRA, EGY
    region = Column(String(100))  # South Asia, Western Europe, Middle East, etc.
    created_at = Column(DateTime, default=datetime.utcnow)

    states = relationship("RegionState", back_populates="country")
    sites = relationship("Site", back_populates="country")


class RegionState(Base):
    __tablename__ = "region_states"

    id = Column(Integer, primary_key=True, index=True)
    country_id = Column(Integer, ForeignKey("countries.id"), nullable=False)
    name = Column(String(100), nullable=False)
    code = Column(String(50))  # e.g. GJ, RJ, MH

    country = relationship("Country", back_populates="states")
    cities = relationship("City", back_populates="state")
    sites = relationship("Site", back_populates="region_state")


class City(Base):
    __tablename__ = "cities"

    id = Column(Integer, primary_key=True, index=True)
    state_id = Column(Integer, ForeignKey("region_states.id"), nullable=False)
    name = Column(String(100), nullable=False)
    latitude = Column(Float)
    longitude = Column(Float)

    state = relationship("RegionState", back_populates="cities")
    sites = relationship("Site", back_populates="city")


# ─────────────────────────────────────────────
# HERITAGE SITES & ZONES
# ─────────────────────────────────────────────

class Site(Base):
    __tablename__ = "sites"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    location = Column(String(300))
    description = Column(Text)
    latitude = Column(Float)
    longitude = Column(Float)
    site_type = Column(String(100))  # solar_temple, walled_city, stepwell, mosque, etc.
    established_year = Column(Integer)
    unesco_status = Column(Boolean, default=False)
    unesco_id = Column(String(50), nullable=True)
    max_visitor_capacity = Column(Integer, default=500)
    health_score = Column(Float, default=75.0)
    data_origin = Column(String(50), default="IMPORTED_DATA")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = Column(Boolean, default=True)

    # Geographic relations
    country_id = Column(Integer, ForeignKey("countries.id"), nullable=True)
    state_id = Column(Integer, ForeignKey("region_states.id"), nullable=True)
    city_id = Column(Integer, ForeignKey("cities.id"), nullable=True)

    country = relationship("Country", back_populates="sites")
    region_state = relationship("RegionState", back_populates="sites")
    city = relationship("City", back_populates="sites")

    # Domain relations
    zones = relationship("HeritageZone", back_populates="site")
    inspections = relationship("Inspection", back_populates="site")
    structural_alerts = relationship("StructuralAlert", back_populates="site")
    visitor_data = relationship("VisitorData", back_populates="site")
    encroachment_alerts = relationship("EncroachmentAlert", back_populates="site")
    conservation_tasks = relationship("ConservationTask", back_populates="site")
    observations = relationship("Observation", back_populates="site")
    unified_alerts = relationship("UnifiedAlert", back_populates="site")
    insights = relationship("ConservationInsight", back_populates="site")


class HeritageZone(Base):
    __tablename__ = "heritage_zones"

    id = Column(Integer, primary_key=True, index=True)
    site_id = Column(Integer, ForeignKey("sites.id"), nullable=False)
    name = Column(String(150), nullable=False)  # e.g. Surya Kund, Sabha Mandap
    zone_code = Column(String(50))
    max_capacity = Column(Integer, default=100)
    risk_factor = Column(String(50), default="medium")
    geometry = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    site = relationship("Site", back_populates="zones")
    observations = relationship("Observation", back_populates="zone")


# ─────────────────────────────────────────────
# INGESTION & DATA SOURCES
# ─────────────────────────────────────────────

class DataSource(Base):
    __tablename__ = "data_sources"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), unique=True, nullable=False)
    domain = Column(String(200))
    source_url = Column(String(500))
    source_type = Column(String(100))  # REST_API, OPEN_DATA, RSS, SATELLITE_FEED
    authority_tier = Column(String(50), default="TIER_1")
    country_scope = Column(String(100), default="Global")
    reliability_score = Column(Float, default=0.95)
    is_active = Column(Boolean, default=True)
    last_successful_retrieval = Column(DateTime, nullable=True)
    last_failed_retrieval = Column(DateTime, nullable=True)
    failure_count = Column(Integer, default=0)
    records_count = Column(Integer, default=0)
    rate_limit_per_minute = Column(Integer, default=30)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    documents = relationship("SourceDocument", back_populates="source")
    ingestion_runs = relationship("IngestionRun", back_populates="source")


class IngestionRun(Base):
    __tablename__ = "ingestion_runs"

    id = Column(Integer, primary_key=True, index=True)
    source_id = Column(Integer, ForeignKey("data_sources.id"), nullable=False)
    status = Column(String(50), default="RUNNING")  # SUCCESS, FAILED, PARTIAL, RUNNING
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    records_fetched = Column(Integer, default=0)
    records_validated = Column(Integer, default=0)
    records_stored = Column(Integer, default=0)
    records_deduplicated = Column(Integer, default=0)
    records_rejected = Column(Integer, default=0)
    error_message = Column(Text, nullable=True)
    execution_duration_sec = Column(Float, default=0.0)

    source = relationship("DataSource", back_populates="ingestion_runs")


class SourceDocument(Base):
    __tablename__ = "source_documents"

    id = Column(Integer, primary_key=True, index=True)
    source_id = Column(Integer, ForeignKey("data_sources.id"), nullable=False)
    external_identifier = Column(String(200), nullable=True)
    title = Column(String(400))
    document_url = Column(String(500))
    publication_date = Column(DateTime, nullable=True)
    retrieval_timestamp = Column(DateTime, default=datetime.utcnow)
    raw_payload = Column(JSON)
    content_hash = Column(String(64), index=True)
    processing_status = Column(String(50), default="NEW")  # NEW, VALIDATED, PROCESSED, DUPLICATE, REJECTED, FAILED
    rejection_reason = Column(Text, nullable=True)

    source = relationship("DataSource", back_populates="documents")
    observations = relationship("Observation", back_populates="source_document")


# ─────────────────────────────────────────────
# NORMALIZED OBSERVATIONS (UNIFIED PIPELINE)
# ─────────────────────────────────────────────

class Observation(Base):
    __tablename__ = "observations"

    id = Column(Integer, primary_key=True, index=True)
    site_id = Column(Integer, ForeignKey("sites.id"), nullable=False)
    zone_id = Column(Integer, ForeignKey("heritage_zones.id"), nullable=True)
    source_document_id = Column(Integer, ForeignKey("source_documents.id"), nullable=True)
    data_origin = Column(String(50), default="EXTERNAL_SOURCE")  # EXTERNAL_SOURCE, MANUAL_ENTRY, IMPORTED_DATA, SIMULATED
    observation_type = Column(String(100), nullable=False)  # VISITOR_FLOW, STRUCTURAL_INTEGRITY, ENVIRONMENTAL_CONDITION, ENCROACHMENT, CONSERVATION_INCIDENT
    observation_date = Column(DateTime, default=datetime.utcnow)
    metric_name = Column(String(100))  # visitor_count, crack_width_mm, vibration_velocity, temperature_c, relative_humidity_pct, boundary_displacement_m, air_quality_aqi
    metric_value = Column(Float)
    unit = Column(String(50), nullable=True)
    severity = Column(String(50), default="Low")  # Low, Moderate, High, Critical
    confidence_score = Column(Float, default=1.0)
    details = Column(Text, nullable=True)
    raw_metadata = Column(JSON, nullable=True)
    status = Column(String(50), default="VALIDATED")  # VALIDATED, PROCESSED, REJECTED, DUPLICATE

    # Deduplication & multi-source evidence
    is_consolidated = Column(Boolean, default=False)
    consolidated_count = Column(Integer, default=1)
    contributing_sources = Column(JSON, nullable=True)  # list of source names that reported/confirmed this event
    has_conflicts = Column(Boolean, default=False)
    conflict_details = Column(Text, nullable=True)
    requires_human_review = Column(Boolean, default=False)

    site = relationship("Site", back_populates="observations")
    zone = relationship("HeritageZone", back_populates="observations")
    source_document = relationship("SourceDocument", back_populates="observations")
    alerts = relationship("UnifiedAlert", back_populates="observation")


# ─────────────────────────────────────────────
# UNIFIED ALERTS & TRACEABLE INSIGHTS
# ─────────────────────────────────────────────

class UnifiedAlert(Base):
    __tablename__ = "unified_alerts"

    id = Column(Integer, primary_key=True, index=True)
    site_id = Column(Integer, ForeignKey("sites.id"), nullable=False)
    observation_id = Column(Integer, ForeignKey("observations.id"), nullable=True)
    alert_type = Column(String(100))  # HIGH_VISITOR_PRESSURE, STRUCTURAL_STRAIN, POTENTIAL_ENCROACHMENT, CONFLICTING_SOURCES, ENVIRONMENTAL_HAZARD
    severity = Column(String(50), default="Moderate")  # Low, Moderate, High, Critical
    title = Column(String(300), nullable=False)
    description = Column(Text)
    evidence = Column(JSON)  # Traceable list of observation IDs, sources, metric values, calculations
    detection_method = Column(String(100), default="DETERMINISTIC_RULE")
    recommended_action = Column(Text)
    human_review_status = Column(String(50), default="PENDING_REVIEW")  # PENDING_REVIEW, VERIFIED, RESOLVED, DISMISSED
    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)

    site = relationship("Site", back_populates="unified_alerts")
    observation = relationship("Observation", back_populates="alerts")


class ConservationInsight(Base):
    __tablename__ = "conservation_insights"

    id = Column(Integer, primary_key=True, index=True)
    site_id = Column(Integer, ForeignKey("sites.id"), nullable=False)
    insight_category = Column(String(100))  # VISITOR_IMPACT, PREVENTIVE_MAINTENANCE, MULTI_AGENT_SYNTHESIS, HERITAGE_RISK_INDEX
    title = Column(String(300), nullable=False)
    summary = Column(Text)
    deterministic_evidence = Column(JSON)  # Trend numbers, threshold metrics, percentages
    granite_interpretation = Column(Text, nullable=True)  # Grounded LLM reasoning based on evidence
    uncertainty_score = Column(Float, default=0.1)
    action_priority = Column(String(50), default="Medium")
    requires_human_review = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    site = relationship("Site", back_populates="insights")


# ─────────────────────────────────────────────
# EXISTING CORE AGENT MODELS (PRESERVED)
# ─────────────────────────────────────────────

class Inspection(Base):
    __tablename__ = "inspections"

    id = Column(Integer, primary_key=True, index=True)
    site_id = Column(Integer, ForeignKey("sites.id"), nullable=False)
    inspector_name = Column(String(200))
    inspection_date = Column(DateTime, default=datetime.utcnow)
    image_path = Column(String(500))
    previous_image_path = Column(String(500))
    risk_level = Column(String(50), default="Healthy")
    risk_score = Column(Float, default=0.0)
    confidence_score = Column(Float, default=0.0)
    detected_issues = Column(JSON)
    ai_analysis = Column(Text)
    recommendations = Column(Text)
    priority = Column(String(50), default="Low")
    next_inspection_date = Column(DateTime)
    sensor_readings = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)

    site = relationship("Site", back_populates="inspections")


class StructuralAlert(Base):
    __tablename__ = "structural_alerts"

    id = Column(Integer, primary_key=True, index=True)
    site_id = Column(Integer, ForeignKey("sites.id"), nullable=False)
    alert_type = Column(String(100))
    severity = Column(String(50))
    location_description = Column(String(300))
    description = Column(Text)
    risk_score = Column(Float)
    is_resolved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime)

    site = relationship("Site", back_populates="structural_alerts")


class VisitorData(Base):
    __tablename__ = "visitor_data"

    id = Column(Integer, primary_key=True, index=True)
    site_id = Column(Integer, ForeignKey("sites.id"), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    visitor_count = Column(Integer, default=0)
    zone_data = Column(JSON)
    crowd_level = Column(String(20), default="Green")
    occupancy_percentage = Column(Float, default=0.0)
    peak_hour = Column(Boolean, default=False)
    estimated_wait_time = Column(Integer, default=0)
    is_simulated = Column(Boolean, default=True)

    site = relationship("Site", back_populates="visitor_data")


class EncroachmentAlert(Base):
    __tablename__ = "encroachment_alerts"

    id = Column(Integer, primary_key=True, index=True)
    site_id = Column(Integer, ForeignKey("sites.id"), nullable=False)
    detection_date = Column(DateTime, default=datetime.utcnow)
    image_path = Column(String(500))
    historical_image_path = Column(String(500))
    encroachment_type = Column(String(200))
    confidence_score = Column(Float)
    severity = Column(String(50))
    location_description = Column(String(300))
    ai_analysis = Column(Text)
    recommended_action = Column(Text)
    is_verified = Column(Boolean, default=False)
    is_resolved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    site = relationship("Site", back_populates="encroachment_alerts")


class ConservationTask(Base):
    __tablename__ = "conservation_tasks"

    id = Column(Integer, primary_key=True, index=True)
    site_id = Column(Integer, ForeignKey("sites.id"), nullable=False)
    title = Column(String(300), nullable=False)
    description = Column(Text)
    priority = Column(String(50), default="Medium")
    status = Column(String(50), default="Open")
    assigned_department = Column(String(200))
    assigned_team = Column(String(200))
    deadline = Column(DateTime)
    source_agents = Column(JSON)
    granite_summary = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    site = relationship("Site", back_populates="conservation_tasks")


class AgentLog(Base):
    __tablename__ = "agent_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    agent_name = Column(String(100))
    event_type = Column(String(100))
    message = Column(Text)
    site_id = Column(Integer, ForeignKey("sites.id"), nullable=True)
    extra_data = Column("metadata", JSON)
    is_granite_output = Column(Boolean, default=False)


class HeritageStory(Base):
    __tablename__ = "heritage_stories"

    id = Column(Integer, primary_key=True, index=True)
    site_id = Column(Integer, ForeignKey("sites.id"))
    language = Column(String(50), default="English")
    age_group = Column(String(50))
    interests = Column(JSON)
    experience_type = Column(String(100))
    short_story = Column(Text)
    detailed_story = Column(Text)
    interesting_facts = Column(JSON)
    walking_route = Column(Text)
    did_you_know = Column(JSON)
    follow_up_questions = Column(JSON)
    duration_minutes = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, nullable=False)
    email = Column(String(200), unique=True)
    role = Column(String(50), default="viewer")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime)
