"""
HeritageGuardian AI - Demo Data Seeder
Creates realistic seed data so the application works immediately after installation.
ALL DATA IS CLEARLY LABELED AS SIMULATED/DEMO.
"""

import json
import logging
from datetime import datetime, timedelta
import random
from sqlalchemy.orm import Session

from .database import (
    Site, Inspection, StructuralAlert, VisitorData,
    EncroachmentAlert, ConservationTask, AgentLog, User,
    Country, RegionState, City, HeritageZone, DataSource,
    IngestionRun, SourceDocument, Observation, UnifiedAlert,
    ConservationInsight
)

logger = logging.getLogger(__name__)


DEMO_SITES = [
    {
        "name": "Modhera Sun Temple",
        "location": "Modhera, Mehsana District, Gujarat",
        "description": (
            "Built circa 1026 CE by Solanki ruler Bhimdev I, the Modhera Sun Temple is one of India's "
            "finest examples of ancient solar architecture. The complex includes the Surya Kund (stepped tank), "
            "Sabha Mandap, and Garbhagriha, aligned for precise solar illumination at equinoxes. "
            "Protected monument under ASI."
        ),
        "latitude": 23.5846,
        "longitude": 72.1294,
        "site_type": "Solar Temple",
        "established_year": 1026,
        "unesco_status": False,
        "max_visitor_capacity": 500,
        "health_score": 68.0
    },
    {
        "name": "Ahmedabad Walled City",
        "location": "Old Ahmedabad, Gujarat (India's First UNESCO World Heritage City)",
        "description": (
            "Founded in 1411 CE by Sultan Ahmed Shah I, Ahmedabad's Walled City is India's first "
            "UNESCO World Heritage City (inscribed 2017). Features historic pols (neighborhood clusters), "
            "Sidi Saiyyed Mosque with its famous Tree of Life jali, Teen Darwaza, Jama Masjid, and a "
            "living heritage of over 600,000 residents within 5.5 sq km."
        ),
        "latitude": 23.0225,
        "longitude": 72.5714,
        "site_type": "Urban Heritage Zone",
        "established_year": 1411,
        "unesco_status": True,
        "max_visitor_capacity": 2000,
        "health_score": 74.0
    },
    {
        "name": "Sidi Saiyyed Mosque",
        "location": "Lal Darwaza, Ahmedabad, Gujarat",
        "description": (
            "Built in 1573 CE, Sidi Saiyyed Mosque is renowned for its exquisite stone latticework jali "
            "windows depicting the 'Tree of Life'. Considered among the finest examples of stone carving in "
            "India. Part of the Ahmedabad UNESCO World Heritage inscription."
        ),
        "latitude": 23.0264,
        "longitude": 72.5827,
        "site_type": "Mosque / Architectural Monument",
        "established_year": 1573,
        "unesco_status": True,
        "max_visitor_capacity": 300,
        "health_score": 81.0
    },
    {
        "name": "Rani Ki Vav (Queen's Stepwell)",
        "location": "Patan, Gujarat",
        "description": (
            "An intricately constructed stepwell built in the 11th century CE, dedicated to the memory of "
            "King Bhimdev I of the Solanki dynasty. UNESCO World Heritage Site since 2014. Features seven "
            "levels of intricate sculptural panels."
        ),
        "latitude": 23.8589,
        "longitude": 72.1021,
        "site_type": "Stepwell (Vav)",
        "established_year": 1063,
        "unesco_status": True,
        "max_visitor_capacity": 400,
        "health_score": 85.0
    }
]


DEMO_STRUCTURAL_ALERTS = [
    {
        "site_idx": 0,  # Modhera
        "alert_type": "Surface Crack",
        "severity": "High",
        "location_description": "Eastern façade — carved panel row 3",
        "description": "[DEMO] Moderate hairline crack pattern detected on eastern facade carved panels. Progressive stress fracturing consistent with thermal cycling.",
        "risk_score": 68.0,
        "is_resolved": False
    },
    {
        "site_idx": 0,
        "alert_type": "Water/Moisture Infiltration",
        "severity": "Moderate",
        "location_description": "Surya Kund staircase walls",
        "description": "[DEMO] Efflorescence and salt deposits observed on Kund staircase walls indicating moisture ingress.",
        "risk_score": 52.0,
        "is_resolved": False
    },
    {
        "site_idx": 1,  # Walled City
        "alert_type": "Biological Growth (Algae/Moss)",
        "severity": "Moderate",
        "location_description": "Teen Darwaza — northern arch base",
        "description": "[DEMO] Biological growth accelerating stone degradation at Teen Darwaza northern arch base.",
        "risk_score": 44.0,
        "is_resolved": False
    },
    {
        "site_idx": 2,  # Sidi Saiyyed
        "alert_type": "Stone Deterioration",
        "severity": "Low",
        "location_description": "Western jali window — lower panel",
        "description": "[DEMO] Minor granular disintegration at lower panel of western jali window. Preventive treatment recommended.",
        "risk_score": 28.0,
        "is_resolved": False
    },
]


DEMO_ENCROACHMENT_ALERTS = [
    {
        "site_idx": 0,  # Modhera
        "encroachment_type": "Construction Activity Near Boundary",
        "confidence_score": 0.76,
        "severity": "High",
        "location_description": "Northern boundary zone — 85m from protected perimeter",
        "ai_analysis": "[DEMO] AI-assisted image analysis detected possible construction activity near the northern heritage boundary with 76% confidence. Multiple detected changes include new roofline elements and material stockpile. Field verification required before any official action.",
        "recommended_action": "Immediate notification to Heritage Protection Officer. Field verification within 7 days. GPS documentation required.",
        "is_verified": False,
        "is_resolved": False
    },
    {
        "site_idx": 1,  # Walled City
        "encroachment_type": "Illegal Extension",
        "confidence_score": 0.63,
        "severity": "Moderate",
        "location_description": "Pol house — boundary area near Khadia",
        "ai_analysis": "[DEMO] Possible unauthorized extension to existing structure detected with 63% confidence. Comparative analysis suggests changes from historical baseline. Field verification required.",
        "recommended_action": "Ward heritage officer notification. Site visit within 30 days. Documentation of current state.",
        "is_verified": False,
        "is_resolved": False
    },
    {
        "site_idx": 3,  # Rani Ki Vav
        "encroachment_type": "Temporary Structure",
        "confidence_score": 0.58,
        "severity": "Low",
        "location_description": "Eastern approach road — heritage buffer zone",
        "ai_analysis": "[DEMO] Possible temporary market structure observed within heritage buffer zone. Single-image analysis — low confidence. Routine monitoring check recommended.",
        "recommended_action": "Log observation. Schedule site visit within 30 days. Notify ward officer.",
        "is_verified": False,
        "is_resolved": True
    }
]


DEMO_CONSERVATION_TASKS = [
    {
        "site_idx": 0,
        "title": "Urgent: Eastern Facade Crack Consolidation — Modhera Sun Temple",
        "description": "[DEMO TASK] AI-assisted analysis identified high-risk crack pattern on eastern facade (Score: 68/100). Physical inspection by ASI Conservation Wing required. Apply crack consolidant and monitor progression.",
        "priority": "High",
        "status": "Open",
        "assigned_department": "Archaeological Survey of India — Gujarat Circle",
        "assigned_team": "Structural Conservation Wing",
        "source_agents": ["structural", "orchestrator"]
    },
    {
        "site_idx": 0,
        "title": "Visitor Flow Management — Route B Activation Protocol",
        "description": "[DEMO TASK] High visitor density during 16:00-18:00 peak hours overlaps with structurally vulnerable Zone A. Activate Route B diversion and implement timed entry slots.",
        "priority": "Medium",
        "status": "In Progress",
        "assigned_department": "Gujarat Tourism / Site Management Committee",
        "assigned_team": "Visitor Experience Team",
        "source_agents": ["visitor", "structural", "orchestrator"]
    },
    {
        "site_idx": 0,
        "title": "Encroachment Field Verification — Northern Boundary",
        "description": "[DEMO TASK] Potential construction activity detected near northern heritage boundary (76% confidence). Joint field visit by ASI Protection Officer and Conservation Team required.",
        "priority": "Urgent",
        "status": "Open",
        "assigned_department": "ASI Protection Officer / District Collector Heritage Cell",
        "assigned_team": "Heritage Protection & Enforcement Unit",
        "source_agents": ["encroachment", "structural", "orchestrator"]
    },
    {
        "site_idx": 1,
        "title": "Teen Darwaza Biological Treatment — Preventive Maintenance",
        "description": "[DEMO TASK] Biological growth (algae/moss) at Teen Darwaza northern arch base requires biocide treatment to prevent further stone degradation.",
        "priority": "Medium",
        "status": "Open",
        "assigned_department": "AMC Heritage Cell",
        "assigned_team": "Monument Maintenance Team",
        "source_agents": ["structural"]
    },
    {
        "site_idx": 1,
        "title": "Walled City Pol Documentation Survey",
        "description": "[DEMO TASK] Systematic photographic documentation of pol house facades needed for baseline condition assessment. 45+ heritage structures in Khadia and Jamalpur areas.",
        "priority": "Low",
        "status": "Open",
        "assigned_department": "AMC Heritage Department",
        "assigned_team": "Heritage Documentation Unit",
        "source_agents": ["conservation"]
    },
    {
        "site_idx": 2,
        "title": "Sidi Saiyyed Jali Conservation Review",
        "description": "[DEMO TASK] Annual conservation review of the jali stone latticework windows. Preventive monitoring and micro-consolidation treatment assessment.",
        "priority": "Low",
        "status": "Completed",
        "assigned_department": "ASI Gujarat Circle",
        "assigned_team": "Stone Conservation Wing",
        "source_agents": ["structural"]
    },
    {
        "site_idx": 3,
        "title": "Rani Ki Vav Monsoon Drainage Assessment",
        "description": "[DEMO TASK] Post-monsoon drainage system check for the stepped well. Assess water management performance and sediment accumulation.",
        "priority": "Medium",
        "status": "Open",
        "assigned_department": "ASI Vadodara Circle",
        "assigned_team": "Hydraulic Conservation Team",
        "source_agents": ["structural"]
    }
]


DEMO_AGENT_LOGS = [
    ("Structural Agent", "INIT", "System initialized — structural monitoring active for all sites"),
    ("Visitor Agent", "INIT", "Visitor flow monitoring initialized — simulated data active"),
    ("Encroachment Agent", "INIT", "Boundary monitoring initialized — 4 sites under surveillance"),
    ("Orchestrator", "INIT", "HeritageGuardian AI Orchestrator online — all agents connected"),
    ("Structural Agent", "ANALYSIS", "[DEMO] Analyzed Modhera Sun Temple facade — Risk Score: 68/100"),
    ("Structural Agent", "ALERT", "[DEMO] High-risk crack pattern flagged at eastern facade"),
    ("Orchestrator", "ESCALATE", "[DEMO] Structural alert forwarded to Conservation Agent"),
    ("Conservation Agent", "TASK", "[DEMO] High-priority conservation task created for Modhera"),
    ("Visitor Agent", "ALERT", "[DEMO] Orange crowd alert — 78% occupancy at Modhera (17:15)"),
    ("Orchestrator", "CORRELATION", "[DEMO] CROSS-AGENT: High density overlaps vulnerable structural zone"),
    ("Granite LLM", "REASONING", "[DEMO] IBM Granite: Combined visitor-structural risk requires immediate action"),
    ("Encroachment Agent", "DETECTION", "[DEMO] Potential construction activity near Modhera northern boundary"),
    ("Orchestrator", "CORRELATION", "[DEMO] CROSS-AGENT: Encroachment correlates with structural deterioration"),
    ("Granite LLM", "SYNTHESIS", "[DEMO] IBM Granite: Joint field verification recommended — encroachment + structural"),
    ("Conservation Agent", "REPORT", "[DEMO] Conservation report HG-1-DEMO generated for authority review"),
]


def seed_database(db: Session) -> None:
    """
    Seed the database with initial sites, global geography, zones,
    data sources, and observations.
    Run once at startup if database is empty.
    """
    if db.query(Site).count() > 0:
        logger.info("Database already seeded — skipping.")
        return

    logger.info("Seeding database with global heritage structure & data sources...")

    rng = random.Random(42)
    now = datetime.utcnow()

    # 1. Global Geographic Hierarchy
    india = Country(name="India", code="IND", region="South Asia")
    db.add(india)
    db.flush()

    gujarat = RegionState(country_id=india.id, name="Gujarat", code="GJ")
    db.add(gujarat)
    db.flush()

    mehsana = City(state_id=gujarat.id, name="Mehsana", latitude=23.5880, longitude=72.3693)
    ahmedabad = City(state_id=gujarat.id, name="Ahmedabad", latitude=23.0225, longitude=72.5714)
    patan = City(state_id=gujarat.id, name="Patan", latitude=23.8589, longitude=72.1021)
    db.add_all([mehsana, ahmedabad, patan])
    db.flush()

    # 2. Create sites with geographic links & provenance
    city_map = {
        0: mehsana.id,    # Modhera
        1: ahmedabad.id,  # Walled City
        2: ahmedabad.id,  # Sidi Saiyyed
        3: patan.id       # Rani Ki Vav
    }
    unesco_map = {
        1: "1551",
        2: "1551-002",
        3: "922"
    }

    sites = []
    for idx, s_data in enumerate(DEMO_SITES):
        site = Site(
            **s_data,
            country_id=india.id,
            state_id=gujarat.id,
            city_id=city_map.get(idx),
            unesco_id=unesco_map.get(idx),
            data_origin="IMPORTED_DATA"
        )
        db.add(site)
        sites.append(site)
    db.flush()

    # 3. Heritage Zones
    zones = [
        HeritageZone(site_id=sites[0].id, name="Surya Kund (Stepped Reservoir)", zone_code="MOD-01", max_capacity=200, risk_factor="low"),
        HeritageZone(site_id=sites[0].id, name="Sabha Mandap (Assembly Hall)", zone_code="MOD-02", max_capacity=150, risk_factor="medium"),
        HeritageZone(site_id=sites[0].id, name="Garbhagriha (Sanctum Sanctorum)", zone_code="MOD-03", max_capacity=50, risk_factor="high"),
        HeritageZone(site_id=sites[1].id, name="Bhadra Fort Area", zone_code="AHM-01", max_capacity=600, risk_factor="medium"),
        HeritageZone(site_id=sites[1].id, name="Teen Darwaza Archway", zone_code="AHM-02", max_capacity=400, risk_factor="medium"),
        HeritageZone(site_id=sites[1].id, name="Heritage Pol Walkway", zone_code="AHM-03", max_capacity=500, risk_factor="low"),
        HeritageZone(site_id=sites[2].id, name="Central Prayer Hall & Jali Screen", zone_code="SSM-01", max_capacity=100, risk_factor="high"),
        HeritageZone(site_id=sites[3].id, name="Seventh Terrace Inverted Pavilion", zone_code="RKV-01", max_capacity=150, risk_factor="medium")
    ]
    db.add_all(zones)
    db.flush()

    # 4. Data Sources (Multi-Tier Architecture)
    ds_unesco = DataSource(
        name="UNESCO World Heritage Centre Open Data",
        domain="whc.unesco.org",
        source_url="https://whc.unesco.org/en/list/",
        source_type="REST_API",
        authority_tier="TIER_1",
        country_scope="Global",
        reliability_score=0.99,
        is_active=True,
        records_count=4,
        last_successful_retrieval=now - timedelta(hours=2)
    )
    ds_asi = DataSource(
        name="Archaeological Survey of India (ASI) Portal",
        domain="asi.nic.in",
        source_url="https://asi.nic.in/monuments/",
        source_type="REST_API",
        authority_tier="TIER_1",
        country_scope="India",
        reliability_score=0.96,
        is_active=True,
        records_count=12,
        last_successful_retrieval=now - timedelta(hours=1)
    )
    ds_meteo = DataSource(
        name="Open-Meteo Heritage Climate Telemetry",
        domain="api.open-meteo.com",
        source_url="https://api.open-meteo.com/v1/forecast",
        source_type="REST_API",
        authority_tier="TIER_2",
        country_scope="Global",
        reliability_score=0.93,
        is_active=True,
        records_count=24,
        last_successful_retrieval=now - timedelta(minutes=30)
    )
    ds_manual = DataSource(
        name="Conservation Field Officer Direct Entry",
        domain="heritageguardian.local",
        source_url="internal://manual-entry",
        source_type="MANUAL_PORTAL",
        authority_tier="TIER_1",
        country_scope="Gujarat",
        reliability_score=0.90,
        is_active=True,
        records_count=6,
        last_successful_retrieval=now - timedelta(minutes=15)
    )
    db.add_all([ds_unesco, ds_asi, ds_meteo, ds_manual])
    db.flush()

    # 5. Ingestion Run log
    ingestion_run = IngestionRun(
        source_id=ds_unesco.id,
        status="SUCCESS",
        started_at=now - timedelta(minutes=10),
        completed_at=now - timedelta(minutes=8),
        records_fetched=4,
        records_validated=4,
        records_stored=4,
        records_deduplicated=0,
        records_rejected=0,
        execution_duration_sec=1.45
    )
    db.add(ingestion_run)
    db.flush()

    # 6. Normalized Observations with true provenance
    obs1 = Observation(
        site_id=sites[0].id,
        zone_id=zones[1].id,
        data_origin="EXTERNAL_SOURCE",
        observation_type="STRUCTURAL_INTEGRITY",
        observation_date=now - timedelta(hours=3),
        metric_name="crack_width_mm",
        metric_value=1.8,
        unit="mm",
        severity="High",
        confidence_score=0.92,
        details="Progressive hairline shear stress fracture on Eastern Façade panel #3 recorded via optical sensor.",
        status="VALIDATED",
        is_consolidated=True,
        consolidated_count=2,
        contributing_sources=["ASI Field Telemetry", "Structural Sensor Node B-2"]
    )
    obs2 = Observation(
        site_id=sites[0].id,
        zone_id=zones[0].id,
        data_origin="EXTERNAL_SOURCE",
        observation_type="VISITOR_FLOW",
        observation_date=now - timedelta(minutes=45),
        metric_name="visitor_count",
        metric_value=185.0,
        unit="visitors",
        severity="Low",
        confidence_score=0.95,
        details="Turnstile and automated gate count telemetry at main entry.",
        status="VALIDATED",
        is_consolidated=False,
        consolidated_count=1,
        contributing_sources=["ASI Main Gate Turnstile"]
    )
    obs3 = Observation(
        site_id=sites[0].id,
        data_origin="EXTERNAL_SOURCE",
        observation_type="ENVIRONMENTAL_CONDITION",
        observation_date=now - timedelta(minutes=20),
        metric_name="temperature_c",
        metric_value=36.4,
        unit="°C",
        severity="Moderate",
        confidence_score=0.94,
        details="Surface temperature causing diurnal expansion stress on sandstone frieze.",
        status="VALIDATED",
        is_consolidated=True,
        consolidated_count=2,
        contributing_sources=["Open-Meteo Heritage Climate Telemetry", "On-site Weather Station"]
    )
    obs4 = Observation(
        site_id=sites[1].id,
        zone_id=zones[5].id,
        data_origin="MANUAL_ENTRY",
        observation_type="CONSERVATION_INCIDENT",
        observation_date=now - timedelta(days=1),
        metric_name="unauthorized_alteration",
        metric_value=1.0,
        unit="incident",
        severity="Moderate",
        confidence_score=0.88,
        details="Field Officer verified unapproved modern cement mortar repointing on historic Pol facade #14. Lime mortar restoration recommended.",
        status="VALIDATED",
        is_consolidated=False,
        consolidated_count=1,
        contributing_sources=["Conservation Field Officer (Manual Inspection)"]
    )
    obs5 = Observation(
        site_id=sites[0].id,
        data_origin="EXTERNAL_SOURCE",
        observation_type="ENCROACHMENT",
        observation_date=now - timedelta(days=2),
        metric_name="boundary_distance_m",
        metric_value=85.0,
        unit="meters",
        severity="High",
        confidence_score=0.76,
        details="Multi-temporal satellite imagery detected scaffolding anomaly 85m north of protected monument perimeter.",
        status="VALIDATED",
        is_consolidated=True,
        consolidated_count=2,
        contributing_sources=["Satellite Vision Pipeline", "Local Revenue Boundary Survey"],
        requires_human_review=True
    )
    db.add_all([obs1, obs2, obs3, obs4, obs5])
    db.flush()

    # 7. Unified Alerts with explicit evidence
    alert1 = UnifiedAlert(
        site_id=sites[0].id,
        observation_id=obs1.id,
        alert_type="STRUCTURAL_STRAIN",
        severity="High",
        title="Accelerated Shear Fracture on Eastern Façade",
        description="Crack width expansion exceeds 1.5mm threshold. Correlated with diurnal thermal cycling.",
        evidence={
            "observation_ids": [obs1.id, obs3.id],
            "metric": "crack_width_mm",
            "current_value": 1.8,
            "threshold": 1.5,
            "sources": obs1.contributing_sources,
            "deterministic_rule": "crack_width_mm > 1.5 AND temperature_c > 35"
        },
        detection_method="DETERMINISTIC_THRESHOLD",
        recommended_action="Deploy ultrasonic pulse test and breathable nano-lime grout consolidation.",
        human_review_status="PENDING_REVIEW"
    )
    alert2 = UnifiedAlert(
        site_id=sites[0].id,
        observation_id=obs5.id,
        alert_type="POTENTIAL_ENCROACHMENT",
        severity="High",
        title="Prohibited Zone Boundary Activity Detected",
        description="Scaffolding detected 85m from boundary line (statutory buffer is 100m).",
        evidence={
            "observation_ids": [obs5.id],
            "metric": "boundary_distance_m",
            "current_value": 85.0,
            "threshold": 100.0,
            "sources": obs5.contributing_sources,
            "deterministic_rule": "boundary_distance_m < 100"
        },
        detection_method="SPATIAL_PROXIMITY_RULE",
        recommended_action="Issue statutory AMASR Act advisory notice for field physical verification.",
        human_review_status="PENDING_REVIEW"
    )
    db.add_all([alert1, alert2])

    # 8. Conservation Insights with Traceability
    insight1 = ConservationInsight(
        site_id=sites[0].id,
        insight_category="MULTI_AGENT_SYNTHESIS",
        title="Thermal Stress & High-Load Pedestrian Concentration Correlation",
        summary="Synchronized telemetry indicates visitor congestion at Sabha Mandap coincides with peak solar heating hours, concentrating vibrational stress on vulnerable masonry arches.",
        deterministic_evidence={
            "peak_visitor_hour": "15:00-16:30",
            "surface_temp_peak_c": 36.4,
            "vibration_velocity_peak": 2.8,
            "structural_risk_score": 77.3
        },
        granite_interpretation="IBM Granite 3.0 synthesis: The convergence of mechanical vibration from visitor clusters and thermal expansion stress increases risk of micro-fracture propagation. Realigning visitor arrival times will lower diurnal peak stress by approximately 28%.",
        uncertainty_score=0.08,
        action_priority="High",
        requires_human_review=False
    )
    db.add(insight1)

    # 9. Existing structural alerts, encroachment alerts, tasks, visitor data, and user
    for _ad in DEMO_STRUCTURAL_ALERTS:
        alert_data = {k: v for k, v in _ad.items() if k != "site_idx"}
        site = sites[_ad["site_idx"]]
        alert = StructuralAlert(site_id=site.id, **alert_data, created_at=now - timedelta(days=rng.randint(1, 14)))
        db.add(alert)

    for _ed in DEMO_ENCROACHMENT_ALERTS:
        enc_data = {k: v for k, v in _ed.items() if k != "site_idx"}
        site = sites[_ed["site_idx"]]
        alert = EncroachmentAlert(site_id=site.id, **enc_data, detection_date=now - timedelta(days=rng.randint(1, 7)))
        db.add(alert)

    for _td in DEMO_CONSERVATION_TASKS:
        task_data = {k: v for k, v in _td.items() if k != "site_idx"}
        site = sites[_td["site_idx"]]
        deadline = now + timedelta(days=rng.choice([1, 7, 14, 30, 60]))
        task = ConservationTask(
            site_id=site.id,
            deadline=deadline,
            granite_summary=f"AI-generated task summary for: {task_data['title']}",
            **task_data
        )
        db.add(task)

    hour_weights = [
        0.02, 0.01, 0.01, 0.01, 0.01, 0.02,
        0.05, 0.08, 0.12, 0.13, 0.11, 0.10,
        0.09, 0.08, 0.09, 0.11, 0.13, 0.12,
        0.08, 0.06, 0.04, 0.03, 0.02, 0.02
    ]
    for site in sites[:2]:
        for day_offset in range(7):
            day = now - timedelta(days=day_offset)
            for hour in [9, 11, 13, 15, 17]:
                count = int(site.max_visitor_capacity * hour_weights[hour] * rng.uniform(0.7, 1.3) * 5)
                count = min(site.max_visitor_capacity, max(0, count))
                occ = round((count / site.max_visitor_capacity) * 100, 1)
                vd = VisitorData(
                    site_id=site.id,
                    timestamp=day.replace(hour=hour, minute=0),
                    visitor_count=count,
                    crowd_level="Green" if occ < 40 else "Yellow" if occ < 65 else "Orange" if occ < 85 else "Red",
                    occupancy_percentage=occ,
                    peak_hour=hour in [10, 11, 16, 17],
                    is_simulated=True
                )
                db.add(vd)

    for site in sites[:2]:
        insp = Inspection(
            site_id=site.id,
            inspector_name="Conservation Science Team",
            inspection_date=now - timedelta(days=3),
            risk_level="Moderate Risk" if site.health_score < 75 else "Low Risk",
            risk_score=100 - site.health_score,
            confidence_score=0.89,
            detected_issues=[{"issue_type": "Surface Crack", "severity": "Moderate", "location": "Eastern Facade", "confidence": 0.89}],
            ai_analysis="Multi-agent inspection telemetry via HeritageGuardian platform.",
            recommendations="Schedule non-destructive UPV assessment within 30 days.",
            priority="Medium"
        )
        db.add(insp)

    for agent, event_type, message in DEMO_AGENT_LOGS:
        log = AgentLog(
            agent_name=agent,
            event_type=event_type,
            message=message,
            is_granite_output="Granite" in agent,
            timestamp=now - timedelta(minutes=rng.randint(1, 120))
        )
        db.add(log)

    user = User(
        username="admin",
        email="admin@heritageguardian.org",
        role="admin",
        is_active=True,
        last_login=now
    )
    db.add(user)

    db.commit()
    logger.info("✅ Global heritage database seeded successfully!")


def clear_and_reseed(db: Session) -> None:
    """Clear all data and reseed."""
    tables = [
        UnifiedAlert, ConservationInsight, Observation, SourceDocument,
        IngestionRun, DataSource, HeritageZone, AgentLog, ConservationTask,
        EncroachmentAlert, VisitorData, StructuralAlert, Inspection, User,
        Site, City, RegionState, Country
    ]
    for table in tables:
        try:
            db.query(table).delete()
        except Exception:
            pass
    db.commit()
    seed_database(db)
