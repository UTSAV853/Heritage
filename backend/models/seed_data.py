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
    EncroachmentAlert, ConservationTask, AgentLog, User
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
    Seed the database with demo data.
    Run once at startup if database is empty.
    """
    # Check if already seeded
    if db.query(Site).count() > 0:
        logger.info("Database already seeded — skipping.")
        return

    logger.info("Seeding database with demo data...")

    rng = random.Random(42)
    now = datetime.utcnow()

    # Create sites
    sites = []
    for s_data in DEMO_SITES:
        site = Site(**s_data)
        db.add(site)
        sites.append(site)
    db.flush()  # get IDs

    # Create structural alerts (copy dicts to avoid mutating module-level constants)
    for _ad in DEMO_STRUCTURAL_ALERTS:
        alert_data = {k: v for k, v in _ad.items() if k != "site_idx"}
        site = sites[_ad["site_idx"]]
        alert = StructuralAlert(site_id=site.id, **alert_data,
                                 created_at=now - timedelta(days=rng.randint(1, 14)))
        db.add(alert)

    # Create encroachment alerts
    for _ed in DEMO_ENCROACHMENT_ALERTS:
        enc_data = {k: v for k, v in _ed.items() if k != "site_idx"}
        site = sites[_ed["site_idx"]]
        alert = EncroachmentAlert(site_id=site.id, **enc_data,
                                   detection_date=now - timedelta(days=rng.randint(1, 7)))
        db.add(alert)

    # Create conservation tasks
    for _td in DEMO_CONSERVATION_TASKS:
        task_data = {k: v for k, v in _td.items() if k != "site_idx"}
        site = sites[_td["site_idx"]]
        deadline = now + timedelta(days=rng.choice([1, 7, 14, 30, 60]))
        task = ConservationTask(
            site_id=site.id,
            deadline=deadline,
            granite_summary=f"[DEMO] AI-generated task summary for: {task_data['title']}",
            **task_data
        )
        db.add(task)

    # Create historical visitor data (last 7 days)
    hour_weights = [
        0.02, 0.01, 0.01, 0.01, 0.01, 0.02,
        0.05, 0.08, 0.12, 0.13, 0.11, 0.10,
        0.09, 0.08, 0.09, 0.11, 0.13, 0.12,
        0.08, 0.06, 0.04, 0.03, 0.02, 0.02
    ]
    for site in sites[:2]:  # Only seed for first 2 sites
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

    # Create demo inspections
    for site in sites[:2]:
        insp = Inspection(
            site_id=site.id,
            inspector_name="HeritageGuardian AI (Demo)",
            inspection_date=now - timedelta(days=3),
            risk_level="Moderate Risk" if site.health_score < 75 else "Low Risk",
            risk_score=100 - site.health_score,
            confidence_score=0.82,
            detected_issues=[{"issue_type": "Surface Crack", "severity": "Moderate", "location": "Eastern Facade", "confidence": 0.82}],
            ai_analysis="[DEMO] AI-assisted inspection via HeritageGuardian system.",
            recommendations="Schedule physical inspection within 30 days.",
            priority="Medium"
        )
        db.add(insp)

    # Create agent logs
    for agent, event_type, message in DEMO_AGENT_LOGS:
        log = AgentLog(
            agent_name=agent,
            event_type=event_type,
            message=message,
            is_granite_output="Granite" in agent,
            timestamp=now - timedelta(minutes=rng.randint(1, 120))
        )
        db.add(log)

    # Create demo user
    user = User(
        username="demo_admin",
        email="admin@heritageguardian.demo",
        role="admin",
        is_active=True,
        last_login=now
    )
    db.add(user)

    db.commit()
    logger.info("✅ Demo data seeded successfully — HeritageGuardian is ready!")


def clear_and_reseed(db: Session) -> None:
    """Clear all data and reseed — use only for demo reset."""
    tables = [AgentLog, ConservationTask, EncroachmentAlert, VisitorData,
              StructuralAlert, Inspection, User, Site]
    for table in tables:
        db.query(table).delete()
    db.commit()
    seed_database(db)
