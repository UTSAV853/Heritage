"""
HeritageGuardian AI - Comprehensive Test Suite for Smart Heritage Conservation Platform
Tests:
- Workflows A, B, C, D, E
- Modular Ingestion Adapters (Open-Meteo, Wikipedia, UNESCO)
- Observation Validation & Quality Bounds
- Deduplication & Conflict Detection
- Manual Data Entry Pipeline
- Unified Deterministic Analysis Engine
- Traceable Insights & Unified Alerts
- Sources & Data Monitoring APIs
"""

import pytest
import asyncio
from datetime import datetime, timedelta
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, patch

from backend.main import app
from backend.models.db_config import SessionLocal
from backend.models.database import (
    Site, DataSource, Observation, UnifiedAlert, ConservationInsight, IngestionRun
)
from backend.ingestion.adapters.open_meteo_adapter import OpenMeteoEnvironmentalAdapter
from backend.ingestion.validators.observation_validator import ObservationValidator
from backend.ingestion.deduplication.deduplication_engine import DeduplicationEngine
from backend.ingestion.engine.ingestion_engine import ingestion_engine
from backend.analysis.unified_analysis import unified_analysis_engine


@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c


# ─────────────────────────────────────────────────────────────
# UNIT TESTS: INGESTION ADAPTER & VALIDATION
# ─────────────────────────────────────────────────────────────

def test_open_meteo_adapter_metadata():
    adapter = OpenMeteoEnvironmentalAdapter()
    assert adapter.authority_tier == "TIER_2"
    assert "open-meteo" in adapter.domain
    assert adapter.default_reliability >= 0.90


def test_open_meteo_adapter_parsing():
    adapter = OpenMeteoEnvironmentalAdapter()
    mock_payload = {
        "site_id": 1,
        "site_name": "Modhera Sun Temple",
        "retrieval_timestamp": datetime.utcnow().isoformat(),
        "raw_payload": {
            "current": {
                "temperature_2m": 37.5,
                "relative_humidity_2m": 72.0,
                "wind_speed_10m": 22.0,
                "surface_pressure": 1005.0
            }
        }
    }
    parsed = adapter.parse(mock_payload)
    assert len(parsed) == 4
    metrics = {p["metric_name"]: p["metric_value"] for p in parsed}
    assert metrics["temperature_c"] == 37.5
    assert metrics["relative_humidity_pct"] == 72.0
    assert metrics["wind_speed_kmh"] == 22.0
    assert metrics["surface_pressure_hpa"] == 1005.0


def test_observation_validator_valid():
    valid_record = {
        "site_id": 1,
        "observation_type": "VISITOR_FLOW",
        "metric_name": "visitor_count",
        "metric_value": 250.0,
        "data_origin": "EXTERNAL_SOURCE"
    }
    is_valid, status, rec = ObservationValidator.validate(valid_record)
    assert is_valid is True
    assert status == "VALIDATED"
    assert rec["metric_value"] == 250.0


def test_observation_validator_invalid_out_of_bounds():
    invalid_record = {
        "site_id": 1,
        "observation_type": "VISITOR_FLOW",
        "metric_name": "visitor_count",
        "metric_value": -50.0,  # Negative count rejected
        "data_origin": "EXTERNAL_SOURCE"
    }
    is_valid, status, rec = ObservationValidator.validate(invalid_record)
    assert is_valid is False
    assert status == "REJECTED"
    assert "out of permissible range" in rec["rejection_reason"]


def test_observation_validator_invalid_type():
    invalid_type = {
        "site_id": 1,
        "observation_type": "UNKNOWN_RANDOM_TYPE",
        "metric_name": "temperature_c",
        "metric_value": 30.0
    }
    is_valid, status, rec = ObservationValidator.validate(invalid_type)
    assert is_valid is False
    assert status == "REJECTED"


# ─────────────────────────────────────────────────────────────
# REQUIRED END-TO-END WORKFLOW TESTS
# ─────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_workflow_a_external_source_to_insight(client):
    """
    WORKFLOW A:
    External Source → Fetch → Parse → Normalize → Validate → Store → Analyze → Insight & Alert
    """
    db = SessionLocal()
    try:
        # Find or create a site
        site = db.query(Site).first()
        assert site is not None

        # Simulate external observation injection from an official environmental adapter
        obs_data = {
            "site_id": site.id,
            "data_origin": "EXTERNAL_SOURCE",
            "observation_type": "STRUCTURAL_INTEGRITY",
            "observation_date": datetime.utcnow(),
            "metric_name": "crack_width_mm",
            "metric_value": 2.4,  # Exceeds 1.5mm threshold
            "unit": "mm",
            "severity": "High",
            "confidence_score": 0.94,
            "details": "Automated sensor telemetry recorded significant crack expansion."
        }

        is_valid, status, validated = ObservationValidator.validate(obs_data)
        assert is_valid is True

        obs = Observation(
            site_id=site.id,
            data_origin=validated["data_origin"],
            observation_type=validated["observation_type"],
            observation_date=validated["observation_date"],
            metric_name=validated["metric_name"],
            metric_value=validated["metric_value"],
            unit=validated.get("unit"),
            severity=validated.get("severity"),
            confidence_score=validated.get("confidence_score"),
            details=validated.get("details"),
            status="VALIDATED",
            contributing_sources=["External Optical Crack Gauge #3"]
        )
        db.add(obs)
        db.commit()
        db.refresh(obs)

        # Run unified analysis
        analysis_result = unified_analysis_engine.analyze_site(db, site.id)
        assert analysis_result["site_id"] == site.id

        # Verify alert was generated deterministically from evidence
        alert = db.query(UnifiedAlert).filter(
            UnifiedAlert.site_id == site.id,
            UnifiedAlert.alert_type == "STRUCTURAL_STRAIN"
        ).first()
        assert alert is not None
        assert alert.evidence["crack_width_val"] >= 1.5
        assert "External Optical Crack Gauge #3" in alert.evidence["sources"]

    finally:
        db.close()


def test_workflow_b_manual_entry_to_analysis(client):
    """
    WORKFLOW B:
    Manual Data Entry → Validate → Store → Analyze → Insight & Alerts via API
    """
    db = SessionLocal()
    site = db.query(Site).first()
    site_id = site.id
    db.close()

    payload = {
        "site_id": site_id,
        "observation_type": "VISITOR_FLOW",
        "metric_name": "visitor_count",
        "metric_value": 480.0,  # 480/500 = 96% occupancy -> triggers Critical alert
        "unit": "visitors",
        "severity": "Critical",
        "inspector_name": "Officer Patel",
        "details": "Direct visual turnstile tally during festival evening."
    }

    res = client.post("/api/data/manual", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "success"
    assert data["data_origin"] == "MANUAL_ENTRY"
    assert "observation_id" in data

    # Verify alert appears in /api/alerts
    alerts_res = client.get(f"/api/alerts?site_id={site_id}")
    assert alerts_res.status_code == 200
    alerts = alerts_res.json()
    assert any(a["alert_type"] == "HIGH_VISITOR_PRESSURE" for a in alerts)


@pytest.mark.asyncio
async def test_workflow_c_source_failure_resilience():
    """
    WORKFLOW C:
    Source Failure → Failure Logged → Existing Data Preserved → Dashboard Continues
    """
    db = SessionLocal()
    try:
        source = db.query(DataSource).filter(DataSource.name.contains("Open-Meteo")).first()
        if not source:
            source = db.query(DataSource).first()
        assert source is not None
        initial_records = db.query(Observation).count()

        # Simulate source failure in an adapter
        with patch.object(OpenMeteoEnvironmentalAdapter, "fetch", side_effect=Exception("Network Timeout: 504 Gateway Timeout")):
            run_result = await ingestion_engine.run_source_ingestion(db, source.id)
            assert run_result["status"] in ["FAILED", "PARTIAL"]
            assert "Network Timeout" in run_result["error"]

        # Existing valid observations are preserved
        preserved_records = db.query(Observation).count()
        assert preserved_records >= initial_records

        # Failure count updated on source
        db.refresh(source)
        assert source.failure_count >= 1
        assert source.last_failed_retrieval is not None

    finally:
        db.close()


def test_workflow_d_deduplication_and_conflict_detection():
    """
    WORKFLOW D:
    Duplicate Reports → Deduplicated into Consolidated Event
    Conflicting Reports → Flagged for Human Review
    """
    db = SessionLocal()
    try:
        site = db.query(Site).first()
        now = datetime.utcnow()

        # 1. First report with a dedicated dynamic test metric name to isolate from previous runs
        import uuid
        test_metric = f"test_metric_{uuid.uuid4().hex[:8]}"
        obs_1 = {
            "site_id": site.id,
            "observation_type": "VISITOR_FLOW",
            "metric_name": test_metric,
            "metric_value": 200.0,
            "observation_date": now
        }
        res1 = DeduplicationEngine.process_observation(db, obs_1, "Source Alpha")
        assert res1["action"] == "INSERT_NEW"

        # Insert record for testing
        test_obs = Observation(
            site_id=site.id,
            data_origin="EXTERNAL_SOURCE",
            observation_type="VISITOR_FLOW",
            observation_date=now,
            metric_name=test_metric,
            metric_value=200.0,
            status="VALIDATED",
            contributing_sources=["Source Alpha"],
            is_consolidated=False,
            consolidated_count=1
        )
        db.add(test_obs)
        db.commit()

        # 2. Second corroborating report within tolerance (210 vs 200 = 5% variance)
        obs_2 = {
            "site_id": site.id,
            "observation_type": "VISITOR_FLOW",
            "metric_name": test_metric,
            "metric_value": 210.0,
            "observation_date": now + timedelta(minutes=10)
        }
        res2 = DeduplicationEngine.process_observation(db, obs_2, "Source Beta")
        assert res2["action"] == "CONSOLIDATE_MATCH"
        assert "Source Alpha" in res2["contributing_sources"]
        assert "Source Beta" in res2["contributing_sources"]

        # 3. Third conflicting report (450 vs ~205 = >100% variance)
        obs_3 = {
            "site_id": site.id,
            "observation_type": "VISITOR_FLOW",
            "metric_name": test_metric,
            "metric_value": 450.0,
            "observation_date": now + timedelta(minutes=15)
        }
        res3 = DeduplicationEngine.process_observation(db, obs_3, "Source Gamma")
        assert res3["action"] == "FLAG_CONFLICT"
        assert res3["has_conflicts"] is True
        assert res3["requires_human_review"] is True
        assert "Source conflict detected" in res3["conflict_details"]

    finally:
        try:
            db.query(Observation).filter(Observation.metric_name.like("test_metric_%")).delete()
            db.commit()
        except Exception:
            pass
        db.close()


def test_workflow_e_existing_agents_integration(client):
    """
    WORKFLOW E:
    Existing Heritage Workflow: Structural Demo, Visitor Demo, Encroachment Demo,
    Conservation Report, and Chat Assistant work consistently.
    """
    # 1. Sites
    r_sites = client.get("/api/sites/")
    assert r_sites.status_code == 200
    assert len(r_sites.json()) >= 4

    # 2. Structural demo
    r_struct = client.get("/api/agents/structural/demo?site_name=Modhera+Sun+Temple")
    assert r_struct.status_code == 200
    assert "risk_score" in r_struct.json()

    # 3. Visitor demo
    r_vis = client.get("/api/agents/visitor/demo/Modhera%20Sun%20Temple")
    assert r_vis.status_code == 200
    assert "current_visitor_count" in r_vis.json()

    # 4. Conservation report demo
    r_rep = client.get("/api/agents/conservation/demo")
    assert r_rep.status_code == 200
    assert "overall_risk" in r_rep.json()

    # 5. Chat
    r_chat = client.post("/api/agents/chat", json={"query": "Explain current alerts", "site_context": "Modhera Sun Temple"})
    assert r_chat.status_code == 200
    assert "response" in r_chat.json()


# ─────────────────────────────────────────────────────────────
# API ENDPOINT VERIFICATION TESTS
# ─────────────────────────────────────────────────────────────

def test_api_sources_list(client):
    res = client.get("/api/sources/")
    assert res.status_code == 200
    sources = res.json()
    assert len(sources) >= 3
    names = [s["name"] for s in sources]
    assert any("UNESCO" in n for n in names)
    assert any("Open-Meteo" in n for n in names)


def test_api_data_quality_endpoint(client):
    res = client.get("/api/data/quality")
    assert res.status_code == 200
    q = res.json()
    assert "total_records" in q
    assert "origin_breakdown" in q
    assert "EXTERNAL_SOURCE" in q["origin_breakdown"]
    assert "MANUAL_ENTRY" in q["origin_breakdown"]


def test_api_alerts_and_review(client):
    # List alerts
    res = client.get("/api/alerts/")
    assert res.status_code == 200
    alerts = res.json()
    assert len(alerts) > 0

    first_alert_id = alerts[0]["id"]
    # Review alert
    review_res = client.post(
        f"/api/alerts/{first_alert_id}/review",
        json={"action": "VERIFY", "notes": "Verified by lead ASI conservation engineer"}
    )
    assert review_res.status_code == 200
    assert review_res.json()["human_review_status"] == "VERIFIED"


def test_api_insights_list(client):
    res = client.get("/api/insights/")
    assert res.status_code == 200
    insights = res.json()
    assert len(insights) > 0
    assert "deterministic_evidence" in insights[0]
