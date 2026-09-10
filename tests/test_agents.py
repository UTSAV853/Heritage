"""
HeritageGuardian AI - Backend Tests
Tests for agents, orchestrator, and API endpoints.
"""

import pytest
import asyncio
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, patch

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))


# ─── Unit Tests: Structural Agent ───────────────────────────────────────────

def test_structural_agent_risk_levels():
    from backend.agents.structural_agent import StructuralHealthAgent
    agent = StructuralHealthAgent()
    assert agent.get_risk_level(10) == "Healthy"
    assert agent.get_risk_level(30) == "Low Risk"
    assert agent.get_risk_level(55) == "Moderate Risk"
    assert agent.get_risk_level(70) == "High Risk"
    assert agent.get_risk_level(90) == "Critical"


def test_structural_agent_priority():
    from backend.agents.structural_agent import StructuralHealthAgent
    agent = StructuralHealthAgent()
    assert agent.get_priority("Healthy") == "Routine"
    assert agent.get_priority("Critical") == "Immediate"
    assert agent.get_priority("High Risk") == "High"


def test_structural_agent_inspection_days():
    from backend.agents.structural_agent import StructuralHealthAgent
    agent = StructuralHealthAgent()
    assert agent.get_next_inspection_days("Healthy") == 180
    assert agent.get_next_inspection_days("Critical") == 1
    assert agent.get_next_inspection_days("High Risk") == 7


@pytest.mark.asyncio
async def test_structural_agent_analyze_returns_dict():
    from backend.agents.structural_agent import StructuralHealthAgent
    agent = StructuralHealthAgent()
    result = await agent.analyze_image(site_name="Test Site")
    assert isinstance(result, dict)
    assert "risk_score" in result
    assert "risk_level" in result
    assert "detected_issues" in result
    assert "recommendations" in result
    assert 0 <= result["risk_score"] <= 100
    assert result["risk_level"] in ["Healthy", "Low Risk", "Moderate Risk", "High Risk", "Critical"]


# ─── Unit Tests: Visitor Agent ───────────────────────────────────────────────

def test_visitor_agent_crowd_levels():
    from backend.agents.visitor_agent import VisitorFlowAgent
    agent = VisitorFlowAgent()
    assert agent._get_crowd_level(20)["level"] == "Green"
    assert agent._get_crowd_level(50)["level"] == "Yellow"
    assert agent._get_crowd_level(75)["level"] == "Orange"
    assert agent._get_crowd_level(90)["level"] == "Red"


def test_visitor_agent_data_structure():
    from backend.agents.visitor_agent import VisitorFlowAgent
    agent = VisitorFlowAgent()
    result = agent.get_current_visitor_data("Modhera Sun Temple", 500)
    assert "current_visitor_count" in result
    assert "occupancy_percentage" in result
    assert "crowd_level" in result
    assert "zone_data" in result
    assert "is_simulated" in result
    assert result["is_simulated"] == True
    assert 0 <= result["occupancy_percentage"] <= 100


# ─── Unit Tests: Encroachment Agent ─────────────────────────────────────────

@pytest.mark.asyncio
async def test_encroachment_agent_returns_dict():
    from backend.agents.encroachment_agent import EncroachmentDetectionAgent
    agent = EncroachmentDetectionAgent()
    result = await agent.analyze_encroachment(site_name="Test Heritage Site")
    assert isinstance(result, dict)
    assert "encroachment_detected" in result
    assert "agent" in result
    assert result["agent"] == "Encroachment Detection Agent"


@pytest.mark.asyncio
async def test_encroachment_disclaimer_present():
    from backend.agents.encroachment_agent import EncroachmentDetectionAgent
    agent = EncroachmentDetectionAgent()
    result = await agent.analyze_encroachment(site_name="Modhera Sun Temple")
    # Should contain safety language
    if result.get("encroachment_detected"):
        assert "disclaimer" in result
        disclaimer = result["disclaimer"].lower()
        assert any(word in disclaimer for word in ["potential", "field verification", "not a legal"])


# ─── Unit Tests: Conservation Agent ─────────────────────────────────────────

@pytest.mark.asyncio
async def test_conservation_report_structure():
    from backend.agents.conservation_agent import ConservationReportingAgent
    agent = ConservationReportingAgent()
    report = await agent.generate_report(
        site_name="Modhera Sun Temple",
        site_id=1,
        structural_data={"risk_score": 65, "risk_level": "High Risk", "detected_issues": [], "priority": "High", "recommendations": "Test"},
        visitor_data={"occupancy_percentage": 70, "crowd_level": "Orange", "current_visitor_count": 350, "is_simulated": True, "peak_hours": "16-18"},
        encroachment_data={"encroachment_detected": False}
    )
    assert "report_id" in report
    assert "overall_risk" in report
    assert "executive_summary" in report
    assert "recommended_actions" in report
    assert "disclaimer" in report


def test_conservation_csv_export():
    from backend.agents.conservation_agent import ConservationReportingAgent
    agent = ConservationReportingAgent()
    mock_report = {
        "report_id": "HG-1-TEST",
        "site_name": "Test Site",
        "report_date": "2024-01-01",
        "overall_risk": {"level": "Moderate", "score": 45},
        "executive_summary": "Test summary",
        "structural_health": {"status": "Moderate Risk", "score": 55, "issues_count": 2, "priority": "Medium"},
        "visitor_conditions": {"current_count": 200, "occupancy_pct": 40, "crowd_level": "Green", "is_simulated": True},
        "encroachment_alerts": {"detected": False, "type": "None", "severity": "N/A"},
        "recommended_actions": [{"action": "Monitor", "priority": "Low", "deadline": "2024-02-01", "dept": "ASI"}],
        "disclaimer": "Test disclaimer"
    }
    csv_output = agent.export_csv(mock_report)
    assert "HeritageGuardian" in csv_output
    assert "HG-1-TEST" in csv_output
    assert "Test Site" in csv_output


# ─── Unit Tests: Granite Service ────────────────────────────────────────────

@pytest.mark.asyncio
async def test_granite_demo_mode_structural():
    from backend.services.granite_service import GraniteService
    # Force demo mode
    service = GraniteService()
    service.demo_mode = True
    result = await service.generate("analyze structural crack deterioration")
    assert "DEMO" in result or "demo" in result.lower() or len(result) > 50


@pytest.mark.asyncio
async def test_granite_demo_mode_story():
    from backend.services.granite_service import GraniteService
    service = GraniteService()
    service.demo_mode = True
    result = await service.generate("generate story about heritage site")
    assert len(result) > 50


# ─── Integration Tests: API Endpoints ────────────────────────────────────────

@pytest.fixture
def client():
    """Create test client with in-memory database."""
    os.environ["DATABASE_URL"] = "sqlite:///./test_heritageguardian.db"
    from backend.main import app
    with TestClient(app) as c:
        yield c
    # Cleanup
    import os as _os
    try:
        _os.remove("./test_heritageguardian.db")
    except:
        pass


def test_root_endpoint(client):
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "HeritageGuardian AI" in data["name"]
    assert len(data["agents"]) == 5


def test_health_endpoint(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_sites_endpoint(client):
    response = client.get("/api/sites/")
    assert response.status_code == 200
    sites = response.json()
    assert len(sites) > 0
    assert any("Modhera" in s["name"] for s in sites)


def test_structural_demo_endpoint(client):
    response = client.get("/api/agents/structural/demo?site_name=Modhera+Sun+Temple")
    assert response.status_code == 200
    data = response.json()
    assert "risk_score" in data
    assert "risk_level" in data
    assert "detected_issues" in data


def test_visitor_demo_endpoint(client):
    response = client.get("/api/agents/visitor/demo/Modhera%20Sun%20Temple")
    assert response.status_code == 200
    data = response.json()
    assert "current_visitor_count" in data
    assert "crowd_level" in data
    assert data["is_simulated"] == True


def test_encroachment_demo_endpoint(client):
    response = client.get("/api/agents/encroachment/demo?site_name=Modhera+Sun+Temple")
    assert response.status_code == 200
    data = response.json()
    assert "encroachment_detected" in data


def test_storytelling_demo_endpoint(client):
    response = client.get("/api/agents/storytelling/demo?site=Modhera+Sun+Temple&language=English&age_group=Adult+%2830-60%29")
    assert response.status_code == 200
    data = response.json()
    assert "short_story" in data
    assert "walking_route" in data


def test_conservation_demo_endpoint(client):
    response = client.get("/api/agents/conservation/demo")
    assert response.status_code == 200
    data = response.json()
    assert "overall_risk" in data
    assert "executive_summary" in data


def test_dashboard_overview_endpoint(client):
    response = client.get("/api/agents/dashboard/overview")
    assert response.status_code == 200
    data = response.json()
    assert "total_sites" in data
    assert "overall_heritage_health_score" in data


def test_activity_log_endpoint(client):
    response = client.get("/api/agents/activity-log")
    assert response.status_code == 200
    data = response.json()
    assert "logs" in data


def test_chat_endpoint(client):
    response = client.post("/api/agents/chat", json={"query": "What is the condition of Modhera?"})
    assert response.status_code == 200
    data = response.json()
    assert "response" in data
    assert len(data["response"]) > 0


def test_chat_empty_query_rejected(client):
    response = client.post("/api/agents/chat", json={"query": "  "})
    assert response.status_code == 400


def test_storytelling_generate_endpoint(client):
    response = client.post("/api/agents/storytelling/generate", json={
        "site_name": "Modhera Sun Temple",
        "age_group": "Adult (30-60)",
        "language": "English",
        "interests": ["Architecture", "History"],
        "duration_minutes": 30,
        "experience_type": "Educational"
    })
    assert response.status_code == 200
    data = response.json()
    assert "short_story" in data
    assert "walking_route" in data
    assert "did_you_know" in data
