"""SQLAlchemy ORM models for the Heritage Conservation Platform."""
import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime, Text,
    ForeignKey, JSON
)
from sqlalchemy.orm import relationship
from app.database.db import Base


def gen_uuid():
    return str(uuid.uuid4())


class HeritageSite(Base):
    __tablename__ = "heritage_sites"

    id = Column(String, primary_key=True, default=gen_uuid)
    name = Column(String, nullable=False, unique=True)
    slug = Column(String, nullable=False, unique=True)
    description = Column(Text)
    location = Column(String)
    state = Column(String, default="Gujarat")
    country = Column(String, default="India")
    established_year = Column(Integer)
    site_type = Column(String)  # temple, walled_city, etc.
    total_capacity = Column(Integer)
    tags = Column(JSON, default=list)
    data_source = Column(String, default="VERIFIED_PUBLIC")
    created_at = Column(DateTime, default=datetime.utcnow)

    zones = relationship("HeritageZone", back_populates="site", cascade="all, delete-orphan")
    content = relationship("HeritageContent", back_populates="site", cascade="all, delete-orphan")
    visitor_metrics = relationship("VisitorMetric", back_populates="site", cascade="all, delete-orphan")
    alerts = relationship("ConservationAlert", back_populates="site", cascade="all, delete-orphan")
    structural_obs = relationship("StructuralObservation", back_populates="site", cascade="all, delete-orphan")
    encroachment_obs = relationship("EncroachmentObservation", back_populates="site", cascade="all, delete-orphan")
    conservation_reports = relationship("ConservationReport", back_populates="site", cascade="all, delete-orphan")


class HeritageZone(Base):
    __tablename__ = "heritage_zones"

    id = Column(String, primary_key=True, default=gen_uuid)
    site_id = Column(String, ForeignKey("heritage_sites.id"), nullable=False)
    name = Column(String, nullable=False)
    slug = Column(String, nullable=False)
    description = Column(Text)
    capacity = Column(Integer)
    zone_type = Column(String)
    order_index = Column(Integer, default=0)
    data_source = Column(String, default="SIMULATED_DEMO")

    site = relationship("HeritageSite", back_populates="zones")
    visitor_metrics = relationship("VisitorMetric", back_populates="zone", cascade="all, delete-orphan")


class HeritageContent(Base):
    __tablename__ = "heritage_content"

    id = Column(String, primary_key=True, default=gen_uuid)
    site_id = Column(String, ForeignKey("heritage_sites.id"), nullable=False)
    title = Column(String, nullable=False)
    content_type = Column(String)  # architectural, cultural, historical, religious
    body = Column(Text, nullable=False)
    era = Column(String)
    estimated_duration_minutes = Column(Integer, default=15)
    tags = Column(JSON, default=list)
    source = Column(String, default="DEMO CONTENT — verify before deployment")
    data_source = Column(String, default="DEMO_CONTENT")
    created_at = Column(DateTime, default=datetime.utcnow)

    site = relationship("HeritageSite", back_populates="content")


class VisitorMetric(Base):
    __tablename__ = "visitor_metrics"

    id = Column(String, primary_key=True, default=gen_uuid)
    site_id = Column(String, ForeignKey("heritage_sites.id"), nullable=False)
    zone_id = Column(String, ForeignKey("heritage_zones.id"), nullable=True)
    timestamp = Column(DateTime, nullable=False)
    visitor_count = Column(Integer, nullable=False)
    capacity = Column(Integer, nullable=False)
    source = Column(String, default="SIMULATED_DEMO")

    site = relationship("HeritageSite", back_populates="visitor_metrics")
    zone = relationship("HeritageZone", back_populates="visitor_metrics")


class VisitorProfile(Base):
    __tablename__ = "visitor_profiles"

    id = Column(String, primary_key=True, default=gen_uuid)
    session_id = Column(String, nullable=False, unique=True)
    site_id = Column(String, ForeignKey("heritage_sites.id"), nullable=True)
    duration_minutes = Column(Integer)
    interests = Column(JSON, default=list)
    crowd_preference = Column(String)  # avoid_crowds, moderate, any
    complexity = Column(String)  # simple, moderate, detailed
    created_at = Column(DateTime, default=datetime.utcnow)


class ConservationAlert(Base):
    __tablename__ = "conservation_alerts"

    id = Column(String, primary_key=True, default=gen_uuid)
    site_id = Column(String, ForeignKey("heritage_sites.id"), nullable=False)
    severity = Column(String, nullable=False)  # LOW, MODERATE, HIGH, CRITICAL
    category = Column(String)  # visitor_flow, structural, encroachment, general
    agent = Column(String)
    title = Column(String, nullable=False)
    description = Column(Text)
    evidence = Column(JSON, default=list)
    recommendation = Column(Text)
    status = Column(String, default="PENDING_REVIEW")  # PENDING_REVIEW, IN_PROGRESS, RESOLVED
    human_verification_required = Column(Boolean, default=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    data_source = Column(String, default="SIMULATED_DEMO")

    site = relationship("HeritageSite", back_populates="alerts")


class StructuralObservation(Base):
    __tablename__ = "structural_observations"

    id = Column(String, primary_key=True, default=gen_uuid)
    site_id = Column(String, ForeignKey("heritage_sites.id"), nullable=False)
    zone = Column(String)
    condition = Column(String)  # GOOD, FAIR, POOR, CRITICAL
    risk_level = Column(String)  # LOW, MODERATE, HIGH, CRITICAL
    observations = Column(JSON, default=list)
    damage_indicators = Column(JSON, default=list)
    recommended_action = Column(Text)
    inspector = Column(String, default="DEMO_INSPECTOR")
    inspection_date = Column(DateTime)
    confidence = Column(Float, default=0.7)
    data_source = Column(String, default="SIMULATED_DEMO")
    created_at = Column(DateTime, default=datetime.utcnow)

    site = relationship("HeritageSite", back_populates="structural_obs")


class EncroachmentObservation(Base):
    __tablename__ = "encroachment_observations"

    id = Column(String, primary_key=True, default=gen_uuid)
    site_id = Column(String, ForeignKey("heritage_sites.id"), nullable=False)
    location_description = Column(String)
    potential_encroachment = Column(Boolean, default=False)
    confidence = Column(Float, default=0.5)
    evidence = Column(JSON, default=list)
    recommended_verification = Column(Text)
    reported_by = Column(String, default="DEMO_SYSTEM")
    observation_date = Column(DateTime)
    status = Column(String, default="PENDING_VERIFICATION")
    data_source = Column(String, default="SIMULATED_DEMO")
    created_at = Column(DateTime, default=datetime.utcnow)

    site = relationship("HeritageSite", back_populates="encroachment_obs")


class AgentRun(Base):
    __tablename__ = "agent_runs"

    id = Column(String, primary_key=True, default=gen_uuid)
    request_id = Column(String, nullable=False)
    agent = Column(String, nullable=False)
    status = Column(String, default="PENDING")  # PENDING, RUNNING, SUCCESS, FAILED, SKIPPED
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    duration_ms = Column(Integer)
    input_summary = Column(Text)
    output_summary = Column(Text)
    error = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)


class ConservationReport(Base):
    __tablename__ = "conservation_reports"

    id = Column(String, primary_key=True, default=gen_uuid)
    site_id = Column(String, ForeignKey("heritage_sites.id"), nullable=False)
    request_id = Column(String)
    priority = Column(String)  # LOW, MODERATE, HIGH, CRITICAL
    factors = Column(JSON, default=list)
    recommendations = Column(JSON, default=list)
    human_verification_required = Column(Boolean, default=True)
    visitor_flow_status = Column(String)
    structural_status = Column(String)
    encroachment_status = Column(String)
    summary = Column(Text)
    data_source = Column(String, default="AI_GENERATED_DEMO")
    created_at = Column(DateTime, default=datetime.utcnow)

    site = relationship("HeritageSite", back_populates="conservation_reports")
