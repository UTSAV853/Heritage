"""Backend tests — visitor flow calculations, APIs, orchestrator, agents."""
import pytest
import asyncio
from datetime import datetime, timedelta
from unittest.mock import patch, AsyncMock

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database.db import Base
from app.database.models import (
    HeritageSite, HeritageZone, HeritageContent, VisitorMetric,
    ConservationAlert, StructuralObservation, EncroachmentObservation
)
from app.database.seed import seed_sites, seed_zones, seed_content, seed_visitor_metrics, seed_alerts, seed_structural, seed_encroachment


# ─── Test Database Setup ──────────────────────────────────────────────────────

TEST_DATABASE_URL = "sqlite:///./test_heritage.db"
test_engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


def setup_test_db():
    Base.metadata.create_all(bind=test_engine)
    db = TestSessionLocal()
    try:
        seed_sites(db)
        seed_zones(db)
        seed_content(db)
        seed_visitor_metrics(db)
        seed_alerts(db)
        seed_structural(db)
        seed_encroachment(db)
        db.commit()
    finally:
        db.close()


@pytest.fixture(scope="session", autouse=True)
def setup_database():
    setup_test_db()
    yield
    Base.metadata.drop_all(bind=test_engine)


@pytest.fixture
def db():
    # Use a fresh session (not rolled-back) so seed data committed at session-scope is visible
    session = TestSessionLocal()
    yield session
    session.close()


# ─── Patch app DB dependency ──────────────────────────────────────────────────

@pytest.fixture
def client(db):
    from app.main import app
    from app.database.db import get_db
    app.dependency_overrides[get_db] = lambda: db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


# ─── Unit: Visitor Flow Calculations ─────────────────────────────────────────

class TestVisitorFlowCalculations:
    def test_occupancy_calculation(self):
        visitors = 142
        capacity = 150
        expected = round(visitors / capacity * 100, 1)
        assert expected == 94.7

    def test_classify_low(self):
        from app.agents.visitor_flow_agent import _classify_pressure
        assert _classify_pressure(30) == "LOW"

    def test_classify_moderate(self):
        from app.agents.visitor_flow_agent import _classify_pressure
        assert _classify_pressure(70) == "MODERATE"

    def test_classify_high(self):
        from app.agents.visitor_flow_agent import _classify_pressure
        assert _classify_pressure(85) == "HIGH"

    def test_classify_critical(self):
        from app.agents.visitor_flow_agent import _classify_pressure
        assert _classify_pressure(96) == "CRITICAL"
        assert _classify_pressure(100) == "CRITICAL"

    def test_trend_increasing(self):
        from app.agents.visitor_flow_agent import _calculate_trend
        metrics = []
        base_time = datetime.utcnow() - timedelta(hours=8)
        # Older: lower counts
        for i, count in enumerate([50, 55, 52, 53, 70, 80, 85, 90]):
            m = VisitorMetric()
            m.visitor_count = count
            m.timestamp = base_time + timedelta(hours=i)
            m.capacity = 150
            metrics.append(m)
        assert _calculate_trend(metrics) == "INCREASING"

    def test_trend_stable(self):
        from app.agents.visitor_flow_agent import _calculate_trend
        base_time = datetime.utcnow() - timedelta(hours=8)
        metrics = []
        for i, count in enumerate([60, 62, 61, 60, 61, 63, 62, 61]):
            m = VisitorMetric()
            m.visitor_count = count
            m.timestamp = base_time + timedelta(hours=i)
            m.capacity = 150
            metrics.append(m)
        assert _calculate_trend(metrics) == "STABLE"

    def test_trend_decreasing(self):
        from app.agents.visitor_flow_agent import _classify_pressure, _calculate_trend
        base_time = datetime.utcnow() - timedelta(hours=8)
        metrics = []
        for i, count in enumerate([90, 85, 80, 78, 60, 55, 52, 50]):
            m = VisitorMetric()
            m.visitor_count = count
            m.timestamp = base_time + timedelta(hours=i)
            m.capacity = 150
            metrics.append(m)
        assert _calculate_trend(metrics) == "DECREASING"

    def test_deterministic_recommendation_critical(self):
        from app.agents.visitor_flow_agent import _deterministic_recommendation
        rec = _deterministic_recommendation("CRITICAL", "INCREASING", ["Main Temple"])
        assert "Main Temple" in rec
        assert "halt" in rec.lower() or "immediate" in rec.lower() or "closure" in rec.lower()

    def test_deterministic_recommendation_high_increasing(self):
        from app.agents.visitor_flow_agent import _deterministic_recommendation
        rec = _deterministic_recommendation("HIGH", "INCREASING", [])
        assert "redirect" in rec.lower() or "increasing" in rec.lower()

    def test_deterministic_recommendation_low(self):
        from app.agents.visitor_flow_agent import _deterministic_recommendation
        rec = _deterministic_recommendation("LOW", "STABLE", [])
        assert "low" in rec.lower() or "normal" in rec.lower()


# ─── Unit: Conservation Priority Logic ───────────────────────────────────────

class TestConservationPriority:
    def test_max_priority_high_wins(self):
        from app.agents.conservation_agent import _max_priority
        assert _max_priority("LOW", "HIGH", "MODERATE") == "HIGH"

    def test_max_priority_critical_wins(self):
        from app.agents.conservation_agent import _max_priority
        assert _max_priority("LOW", "MODERATE", "CRITICAL") == "CRITICAL"

    def test_max_priority_all_low(self):
        from app.agents.conservation_agent import _max_priority
        assert _max_priority("LOW", "LOW") == "LOW"

    def test_visitor_to_priority(self):
        from app.agents.conservation_agent import _visitor_to_priority
        assert _visitor_to_priority("HIGH") == "HIGH"
        assert _visitor_to_priority("LOW") == "LOW"

    def test_structural_to_priority(self):
        from app.agents.conservation_agent import _structural_to_priority
        assert _structural_to_priority("GOOD") == "LOW"
        assert _structural_to_priority("POOR") == "HIGH"
        assert _structural_to_priority("CRITICAL") == "CRITICAL"


# ─── Integration: API Health ──────────────────────────────────────────────────

class TestHealthAPI:
    def test_health_endpoint(self, client):
        resp = client.get("/api/health")
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "ok"
        assert "database" in data
        assert "granite_available" in data
        assert "demo_mode" in data


# ─── Integration: Sites API ───────────────────────────────────────────────────

class TestSitesAPI:
    def test_list_sites(self, client):
        resp = client.get("/api/sites")
        assert resp.status_code == 200
        sites = resp.json()
        assert len(sites) >= 2
        names = [s["name"] for s in sites]
        assert any("Modhera" in n for n in names)
        assert any("Ahmedabad" in n for n in names)

    def test_get_site_by_id(self, client):
        resp = client.get("/api/sites/site-modhera-001")
        assert resp.status_code == 200
        data = resp.json()
        assert data["name"] == "Modhera Sun Temple"
        assert "zones" in data
        assert len(data["zones"]) >= 3

    def test_get_site_by_slug(self, client):
        resp = client.get("/api/sites/modhera")
        assert resp.status_code == 200
        data = resp.json()
        assert data["slug"] == "modhera"

    def test_get_site_not_found(self, client):
        resp = client.get("/api/sites/nonexistent-site")
        assert resp.status_code == 404


# ─── Integration: Visitor Flow API ───────────────────────────────────────────

class TestVisitorFlowAPI:
    def test_get_visitor_flow(self, client):
        resp = client.get("/api/visitor-flow/site-modhera-001")
        assert resp.status_code == 200
        data = resp.json()
        assert "status" in data
        assert data["status"] in ["LOW", "MODERATE", "HIGH", "CRITICAL"]
        assert "occupancy_percent" in data
        assert "trend" in data
        assert "zone_breakdown" in data
        assert data["data_source"] == "SIMULATED_DEMO"

    def test_analyze_visitor_flow_override(self, client):
        resp = client.post("/api/visitor-flow/analyze", json={
            "site_id": "site-modhera-001",
            "override_visitors": 440,  # 440/470 = ~93.6% = HIGH
        })
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] in ["HIGH", "CRITICAL"]
        assert data["current_visitors"] == 440

    def test_visitor_flow_site_not_found(self, client):
        resp = client.get("/api/visitor-flow/fake-site")
        assert resp.status_code == 404


# ─── Integration: Heritage Guide API ─────────────────────────────────────────

class TestHeritageGuideAPI:
    def test_generate_guide(self, client):
        resp = client.post("/api/heritage-guide", json={
            "site_id": "site-modhera-001",
            "duration_minutes": 60,
            "interests": ["architecture"],
            "crowd_preference": "avoid_crowds",
            "complexity": "moderate",
        })
        assert resp.status_code == 200
        data = resp.json()
        assert "title" in data
        assert "summary" in data
        assert "recommended_stops" in data
        assert len(data["recommended_stops"]) >= 1
        assert "estimated_duration_minutes" in data

    def test_guide_short_visit(self, client):
        resp = client.post("/api/heritage-guide", json={
            "site_id": "site-modhera-001",
            "duration_minutes": 20,
            "interests": ["history"],
        })
        assert resp.status_code == 200
        data = resp.json()
        assert data["estimated_duration_minutes"] <= 60  # reasonable


# ─── Integration: Alerts API ──────────────────────────────────────────────────

class TestAlertsAPI:
    def test_list_alerts(self, client):
        resp = client.get("/api/alerts")
        assert resp.status_code == 200
        alerts = resp.json()
        assert isinstance(alerts, list)
        assert len(alerts) >= 2

    def test_filter_alerts_by_site(self, client):
        resp = client.get("/api/alerts?site_id=site-modhera-001")
        assert resp.status_code == 200
        alerts = resp.json()
        for a in alerts:
            assert a["site_id"] == "site-modhera-001"

    def test_create_alert(self, client):
        resp = client.post("/api/alerts", json={
            "site_id": "site-modhera-001",
            "severity": "HIGH",
            "category": "visitor_flow",
            "agent": "Test Agent",
            "title": "Test Alert",
            "description": "Test description",
            "evidence": ["Test evidence"],
            "recommendation": "Test recommendation",
        })
        assert resp.status_code == 201
        data = resp.json()
        assert data["title"] == "Test Alert"
        assert data["status"] == "PENDING_REVIEW"


# ─── Integration: Conservation API ───────────────────────────────────────────

class TestConservationAPI:
    @patch("app.agents.conservation_agent.call_granite_json", new_callable=AsyncMock, return_value=None)
    def test_conservation_report(self, mock_granite, client):
        resp = client.post("/api/conservation/report", json={
            "site_id": "site-modhera-001",
            "include_visitor_flow": True,
            "include_structural": True,
            "include_encroachment": True,
        })
        assert resp.status_code == 200
        data = resp.json()
        assert "priority" in data
        assert data["priority"] in ["LOW", "MODERATE", "HIGH", "CRITICAL"]
        assert data["human_verification_required"] is True
        assert len(data["recommendations"]) >= 1

    def test_site_conservation_history(self, client):
        resp = client.get("/api/conservation/sites/site-modhera-001")
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)


# ─── Integration: Agents API ─────────────────────────────────────────────────

class TestAgentsAPI:
    def test_list_agents(self, client):
        resp = client.get("/api/agents")
        assert resp.status_code == 200
        data = resp.json()
        assert "agents" in data
        assert len(data["agents"]) >= 5

    def test_list_agent_runs(self, client):
        resp = client.get("/api/agents/runs")
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)


# ─── Integration: Orchestrator ───────────────────────────────────────────────

_GRANITE_PATCHES = [
    "app.agents.visitor_flow_agent.call_granite",
    "app.agents.storytelling_agent.call_granite_json",
    "app.agents.structural_agent.call_granite",
    "app.agents.encroachment_agent.call_granite",
    "app.agents.conservation_agent.call_granite_json",
]


def _patch_granite():
    """Return a context-manager that patches all Granite calls to None."""
    from contextlib import ExitStack
    stack = ExitStack()
    for target in _GRANITE_PATCHES:
        stack.enter_context(patch(target, new=AsyncMock(return_value=None)))
    return stack


class TestOrchestrator:
    def test_orchestrator_run(self, client):
        with _patch_granite():
            resp = client.post("/api/orchestrator/run", json={
                "site_id": "site-modhera-001",
                "duration_minutes": 60,
                "interests": ["architecture"],
                "crowd_preference": "avoid_crowds",
                "complexity": "moderate",
                "run_conservation": True,
            })
        assert resp.status_code == 200
        data = resp.json()
        assert "request_id" in data
        assert "status" in data
        assert data["status"] in ["SUCCESS", "PARTIAL"]
        assert "visitor_flow" in data
        assert "heritage_guide" in data
        assert "agent_runs" in data
        assert len(data["agent_runs"]) >= 5
        # Verify agent run records are persisted
        req_id = data["request_id"]
        runs_resp = client.get("/api/agents/runs?request_id=" + req_id)
        assert runs_resp.status_code == 200
        runs = runs_resp.json()
        assert len(runs) >= 5

    def test_orchestrator_site_not_found(self, client):
        with _patch_granite():
            resp = client.post("/api/orchestrator/run", json={
                "site_id": "nonexistent",
                "duration_minutes": 60,
            })
        assert resp.status_code == 404

    def test_orchestrator_agent_run_history(self, client):
        """Orchestrator must persist actual agent run records."""
        with _patch_granite():
            resp = client.post("/api/orchestrator/run", json={
                "site_id": "site-modhera-001",
                "duration_minutes": 45,
                "interests": ["cultural"],
                "run_conservation": False,
            })
        assert resp.status_code == 200
        data = resp.json()
        agents_in_run = [r["agent"] for r in data["agent_runs"]]
        assert "Heritage Orchestrator" in agents_in_run
        assert "Visitor Flow Agent" in agents_in_run
        assert "Heritage Storytelling Agent" in agents_in_run
