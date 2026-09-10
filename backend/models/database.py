"""
HeritageGuardian AI - Database Models
SQLAlchemy ORM models for all heritage monitoring entities.
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


class Site(Base):
    __tablename__ = "sites"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    location = Column(String(300))
    description = Column(Text)
    latitude = Column(Float)
    longitude = Column(Float)
    site_type = Column(String(100))  # temple, walled_city, mosque, etc.
    established_year = Column(Integer)
    unesco_status = Column(Boolean, default=False)
    max_visitor_capacity = Column(Integer, default=500)
    health_score = Column(Float, default=75.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = Column(Boolean, default=True)

    inspections = relationship("Inspection", back_populates="site")
    structural_alerts = relationship("StructuralAlert", back_populates="site")
    visitor_data = relationship("VisitorData", back_populates="site")
    encroachment_alerts = relationship("EncroachmentAlert", back_populates="site")
    conservation_tasks = relationship("ConservationTask", back_populates="site")


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
    detected_issues = Column(JSON)  # list of detected issues
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
    alert_type = Column(String(100))  # crack, water_damage, deterioration, etc.
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
    zone_data = Column(JSON)   # per-zone counts for heatmap
    crowd_level = Column(String(20), default="Green")
    occupancy_percentage = Column(Float, default=0.0)
    peak_hour = Column(Boolean, default=False)
    estimated_wait_time = Column(Integer, default=0)  # minutes
    is_simulated = Column(Boolean, default=True)

    site = relationship("Site", back_populates="visitor_data")


class EncroachmentAlert(Base):
    __tablename__ = "encroachment_alerts"

    id = Column(Integer, primary_key=True, index=True)
    site_id = Column(Integer, ForeignKey("sites.id"), nullable=False)
    detection_date = Column(DateTime, default=datetime.utcnow)
    image_path = Column(String(500))
    historical_image_path = Column(String(500))
    encroachment_type = Column(String(200))  # new_construction, temporary_structure, etc.
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
    source_agents = Column(JSON)  # which agents triggered this task
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
    role = Column(String(50), default="viewer")  # admin, authority, viewer
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime)
