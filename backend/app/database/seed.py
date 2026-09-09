"""Database initialization and seed data."""
import uuid
from datetime import datetime, timedelta
import random
from sqlalchemy.orm import Session
from app.database.models import (
    HeritageSite, HeritageZone, HeritageContent, VisitorMetric,
    ConservationAlert, StructuralObservation, EncroachmentObservation
)


MODHERA_ID = "site-modhera-001"
AHMEDABAD_ID = "site-ahmedabad-001"

MODHERA_ZONES = [
    {"id": "zone-modhera-main", "name": "Main Temple (Gudhamandapa)", "slug": "main-temple", "capacity": 150, "zone_type": "primary", "order_index": 0},
    {"id": "zone-modhera-sabha", "name": "Sabha Mandap (Assembly Hall)", "slug": "sabha-mandap", "capacity": 120, "zone_type": "secondary", "order_index": 1},
    {"id": "zone-modhera-surya", "name": "Surya Kund (Step Well)", "slug": "surya-kund", "capacity": 200, "zone_type": "tertiary", "order_index": 2},
]

AHMEDABAD_ZONES = [
    {"id": "zone-ahm-bhadra", "name": "Bhadra Fort & Teen Darwaza", "slug": "bhadra-fort", "capacity": 300, "zone_type": "primary", "order_index": 0},
    {"id": "zone-ahm-pols", "name": "Heritage Pols & Havelis", "slug": "heritage-pols", "capacity": 200, "zone_type": "secondary", "order_index": 1},
    {"id": "zone-ahm-jami", "name": "Jama Masjid & Sidi Saiyyed", "slug": "jama-masjid", "capacity": 250, "zone_type": "secondary", "order_index": 2},
]


def seed_sites(db: Session):
    existing = db.query(HeritageSite).filter(HeritageSite.id.in_([MODHERA_ID, AHMEDABAD_ID])).count()
    if existing > 0:
        return

    modhera = HeritageSite(
        id=MODHERA_ID,
        name="Modhera Sun Temple",
        slug="modhera",
        description=(
            "The Modhera Sun Temple is a masterpiece of Solanki-period (Chaulukya) architecture, "
            "built circa 1026 CE during the reign of King Bhimdev I. Dedicated to the Sun God Surya, "
            "the temple complex consists of three distinct elements: the main shrine (Gudhamandapa), "
            "the assembly hall (Sabha Mandap), and the ornate step-well (Surya Kund). "
            "It is a protected monument under the Archaeological Survey of India."
        ),
        location="Modhera, Mehsana District",
        established_year=1026,
        site_type="temple",
        total_capacity=470,
        tags=["Solanki", "Sun Temple", "ASI Protected", "UNESCO Tentative List", "Architecture"],
        data_source="VERIFIED_PUBLIC",
    )

    ahmedabad = HeritageSite(
        id=AHMEDABAD_ID,
        name="Ahmedabad Walled City",
        slug="ahmedabad",
        description=(
            "The historic walled city of Ahmedabad (founded 1411 CE by Sultan Ahmad Shah) is India's first "
            "UNESCO World Heritage City (2017). The city's distinctive pols (traditional neighbourhood clusters), "
            "ornate havelis, mosques, temples, and stepwells represent a unique urban fabric of Hindu, Muslim, "
            "and Jain coexistence spanning six centuries."
        ),
        location="Ahmedabad, Gujarat",
        established_year=1411,
        site_type="walled_city",
        total_capacity=750,
        tags=["UNESCO World Heritage", "Walled City", "Pols", "Havelis", "Multi-cultural"],
        data_source="VERIFIED_PUBLIC",
    )

    db.add_all([modhera, ahmedabad])
    db.flush()


def seed_zones(db: Session):
    existing = db.query(HeritageZone).count()
    if existing > 0:
        return

    zones = []
    for z in MODHERA_ZONES:
        zones.append(HeritageZone(
            id=z["id"], site_id=MODHERA_ID, name=z["name"], slug=z["slug"],
            capacity=z["capacity"], zone_type=z["zone_type"], order_index=z["order_index"],
            description=f"Key zone of the Modhera Sun Temple complex.", data_source="SIMULATED_DEMO"
        ))
    for z in AHMEDABAD_ZONES:
        zones.append(HeritageZone(
            id=z["id"], site_id=AHMEDABAD_ID, name=z["name"], slug=z["slug"],
            capacity=z["capacity"], zone_type=z["zone_type"], order_index=z["order_index"],
            description=f"Key area of the Ahmedabad Walled City.", data_source="SIMULATED_DEMO"
        ))
    db.add_all(zones)
    db.flush()


def seed_content(db: Session):
    existing = db.query(HeritageContent).count()
    if existing > 0:
        return

    content = [
        HeritageContent(
            id="content-modhera-arch-01",
            site_id=MODHERA_ID,
            title="Solanki Architectural Mastery",
            content_type="architectural",
            body=(
                "The Modhera Sun Temple exemplifies the Maru-Gurjara architectural style at its zenith. "
                "The Gudhamandapa (main shrine) features an elaborately carved shikhara (tower) with intricate "
                "torana (gateway) and finely sculpted panels depicting the Ashtadikpalas (guardians of eight directions), "
                "apsaras, and episodes from Hindu mythology. The temple is designed so that the rising sun illuminates "
                "the shrine's inner sanctum at the equinoxes — a sophisticated astronomical alignment. "
                "The exterior walls feature 52 miniature shrines corresponding to the weeks in a year. "
                "The complex was built in three phases: the tank (Surya Kund) preceded the sabha mandap and the main shrine."
            ),
            era="11th Century CE (Solanki/Chaulukya Period)",
            estimated_duration_minutes=20,
            tags=["architecture", "solanki", "shikhara", "sculptures", "astronomy"],
            source="Archaeological Survey of India publications; Encyclopaedia of Indian Architecture",
            data_source="VERIFIED_PUBLIC",
        ),
        HeritageContent(
            id="content-modhera-cultural-01",
            site_id=MODHERA_ID,
            title="Sun Worship and Cultural Significance",
            content_type="cultural",
            body=(
                "The Modhera Sun Temple was dedicated to Surya, the Sun God, under the Solanki kings who claimed "
                "solar descent. The Surya Kund — a massive 176-step well with 108 miniature shrines — was used "
                "for ritual bathing and served as the primary gathering space during the Uttarardha festival. "
                "The temple ceased to be an active place of worship after the raids of Mahmud of Ghazni in the "
                "early 11th century, though it was repaired and maintained by later rulers. "
                "Today the ASI maintains it as a protected monument and hosts the Uttarardha Dance Festival annually, "
                "bringing classical dance performances to the illuminated temple backdrop — a major cultural event."
            ),
            era="11th Century CE onwards",
            estimated_duration_minutes=15,
            tags=["culture", "festival", "sun worship", "history", "ASI"],
            source="Archaeological Survey of India; Gujarat Tourism official documentation",
            data_source="VERIFIED_PUBLIC",
        ),
        HeritageContent(
            id="content-modhera-surya-kund-01",
            site_id=MODHERA_ID,
            title="Surya Kund — The Ornate Step Well",
            content_type="architectural",
            body=(
                "The Surya Kund (also called Rama Kund) is a rectangular stepped tank measuring approximately "
                "53 × 36 metres. Its 108 miniature shrines are arranged in tiers descending to the water level, "
                "creating a spectacular geometric spectacle reflected in the water during the solstices. "
                "The step-well architecture represents a Gujarat vernacular tradition of combining utility "
                "(water storage, ritual bathing) with elaborate artistic expression. "
                "Visiting the Surya Kund at sunrise or sunset offers the most dramatic photographic vantage point "
                "as the carved stone catches the low-angle light."
            ),
            era="11th Century CE",
            estimated_duration_minutes=25,
            tags=["surya kund", "step well", "architecture", "photography", "geometry"],
            source="ASI Site Documentation; Indian National Trust for Art and Cultural Heritage",
            data_source="VERIFIED_PUBLIC",
        ),
        HeritageContent(
            id="content-modhera-history-01",
            site_id=MODHERA_ID,
            title="Historical Context: The Solanki Dynasty",
            content_type="historical",
            body=(
                "The Solanki (Chaulukya) dynasty ruled Gujarat from approximately 940 to 1244 CE and presided over "
                "a golden age of art, architecture, and scholarship. King Bhimdev I (r. 1022–1064 CE) commissioned "
                "the Modhera temple complex as a statement of royal piety and cultural achievement. "
                "The Solanki period also produced the Dilwara Temples of Mount Abu and Rani ki Vav (Patan) — "
                "the latter now a UNESCO World Heritage Site. The temple's construction employed skilled silpis "
                "(craftsmen) who developed modular carving techniques allowing the extraordinary density of "
                "sculptural detail seen today."
            ),
            era="940–1244 CE",
            estimated_duration_minutes=10,
            tags=["history", "solanki", "bhimdev", "dynasty", "medieval India"],
            source="A. Cunningham, Archaeological Survey Reports; Hermann Goetz, Early Wooden Temples of Chamba",
            data_source="VERIFIED_PUBLIC",
        ),
        HeritageContent(
            id="content-ahm-pols-01",
            site_id=AHMEDABAD_ID,
            title="The Pol System — Living Heritage Urbanism",
            content_type="cultural",
            body=(
                "Ahmedabad's pols are self-contained residential clusters — a medieval urban planning innovation "
                "that provided security, community identity, and shared resources. Each pol has a single entrance "
                "(khadki), an internal courtyard (chowk), a community well, and shared gathering spaces. "
                "The pol system fostered inter-religious coexistence, with Hindu, Muslim, and Jain communities "
                "sometimes sharing the same pol. Notable pols include Bhagat ni Pol, Mandvi ni Pol, and Gai ni Pol. "
                "The carved wooden facades of the havelis (mansions) within pols represent centuries of craft "
                "tradition — intricate jali (lattice) screens, carved brackets, and torana gateways characterize "
                "the vernacular Gujarati architectural style."
            ),
            era="15th–19th Century CE",
            estimated_duration_minutes=30,
            tags=["pols", "urbanism", "heritage", "havelis", "community", "UNESCO"],
            source="UNESCO World Heritage Nomination Dossier, Ahmedabad 2017; INTACH Gujarat",
            data_source="VERIFIED_PUBLIC",
        ),
        HeritageContent(
            id="content-ahm-architecture-01",
            site_id=AHMEDABAD_ID,
            title="Indo-Saracenic Architecture and Mosques",
            content_type="architectural",
            body=(
                "Sultan Ahmad Shah founded Ahmedabad in 1411 CE, and the city's early mosques represent a "
                "distinctive Indo-Saracenic synthesis. The Jama Masjid (1423 CE) features 260 columns and "
                "blends Hindu and Islamic architectural vocabularies — a pattern repeated across the city. "
                "The Sidi Saiyyed Mosque (1573 CE) contains the famous 'Tree of Life' jali screens, considered "
                "among the finest stone latticework in the world. Bhadra Fort (1411 CE) and the Teen Darwaza "
                "(Triple Gateway) define the historic core. The Sarkhej Roza complex (c. 1445 CE), outside the "
                "walls, represents the mature phase of Sultanate architecture in Gujarat."
            ),
            era="15th–16th Century CE",
            estimated_duration_minutes=25,
            tags=["architecture", "mosques", "indo-saracenic", "jali", "sidi saiyyed", "jama masjid"],
            source="UNESCO World Heritage Nomination Dossier; Archaeological Survey of India",
            data_source="VERIFIED_PUBLIC",
        ),
    ]
    db.add_all(content)
    db.flush()


def seed_visitor_metrics(db: Session):
    existing = db.query(VisitorMetric).count()
    if existing > 0:
        return

    now = datetime.utcnow()
    metrics = []
    random.seed(42)

    # Generate 72 hours of hourly metrics for Modhera (site-level)
    for hour_offset in range(72):
        ts = now - timedelta(hours=72 - hour_offset)
        hour = ts.hour
        # Visitor patterns: morning peak 9-12, afternoon lull 13-14, evening surge 15-17
        if 9 <= hour <= 11:
            base = random.randint(280, 420)
        elif 12 <= hour <= 14:
            base = random.randint(150, 260)
        elif 15 <= hour <= 17:
            base = random.randint(200, 380)
        elif 6 <= hour <= 8 or 18 <= hour <= 19:
            base = random.randint(50, 120)
        else:
            base = random.randint(5, 40)

        # Last 6 hours: simulate rising traffic
        if hour_offset >= 66:
            base = int(base * 1.4)

        metrics.append(VisitorMetric(
            site_id=MODHERA_ID,
            zone_id=None,
            timestamp=ts,
            visitor_count=min(base, 470),
            capacity=470,
            source="SIMULATED_DEMO",
        ))

    # Zone-level snapshots for last 6 hours
    zone_capacities = {
        "zone-modhera-main": 150,
        "zone-modhera-sabha": 120,
        "zone-modhera-surya": 200,
    }
    zone_pressure = {
        "zone-modhera-main": 0.92,   # High
        "zone-modhera-sabha": 0.45,  # Low
        "zone-modhera-surya": 0.71,  # Moderate
    }
    for hour_offset in range(6):
        ts = now - timedelta(hours=5 - hour_offset)
        for zone_id, cap in zone_capacities.items():
            pressure = zone_pressure[zone_id]
            count = int(cap * pressure * random.uniform(0.9, 1.1))
            metrics.append(VisitorMetric(
                site_id=MODHERA_ID,
                zone_id=zone_id,
                timestamp=ts,
                visitor_count=min(count, cap),
                capacity=cap,
                source="SIMULATED_DEMO",
            ))

    # Ahmedabad site metrics
    for hour_offset in range(24):
        ts = now - timedelta(hours=24 - hour_offset)
        hour = ts.hour
        if 10 <= hour <= 13:
            base = random.randint(400, 650)
        elif 14 <= hour <= 17:
            base = random.randint(300, 500)
        else:
            base = random.randint(50, 200)
        metrics.append(VisitorMetric(
            site_id=AHMEDABAD_ID,
            zone_id=None,
            timestamp=ts,
            visitor_count=min(base, 750),
            capacity=750,
            source="SIMULATED_DEMO",
        ))

    db.add_all(metrics)
    db.flush()


def seed_alerts(db: Session):
    existing = db.query(ConservationAlert).count()
    if existing > 0:
        return

    alerts = [
        ConservationAlert(
            id="alert-modhera-vis-01",
            site_id=MODHERA_ID,
            severity="HIGH",
            category="visitor_flow",
            agent="Visitor Flow Agent",
            title="Main Temple Zone Approaching Capacity",
            description="Simulated visitor count at Main Temple (Gudhamandapa) zone is at 92% of stated capacity, with an increasing trend over the last 3 hours.",
            evidence=[
                "Current simulated count: 138/150 (92%)",
                "3-hour trend: +18% increase",
                "Historical: Friday afternoons consistently peak above 85%",
            ],
            recommendation="Consider timed-entry slots or temporary visitor redistribution to Sabha Mandap and Surya Kund zones.",
            status="PENDING_REVIEW",
            human_verification_required=True,
            data_source="SIMULATED_DEMO",
        ),
        ConservationAlert(
            id="alert-modhera-struct-01",
            site_id=MODHERA_ID,
            severity="MODERATE",
            category="structural",
            agent="Structural Health Agent",
            title="Potential Conservation Concern — Sabha Mandap Pillar Weathering",
            description="Demo inspection record indicates accelerated surface weathering on three interior pillars of the Sabha Mandap. Human inspection required before conservation action.",
            evidence=[
                "Demo observation: surface spalling visible on 3 of 52 carved pillars",
                "Condition rating: FAIR (demo data)",
                "Last professional ASI inspection: not recorded in demo dataset",
            ],
            recommendation="Schedule professional ASI conservation inspection. Human verification required before any intervention.",
            status="PENDING_REVIEW",
            human_verification_required=True,
            data_source="SIMULATED_DEMO",
        ),
        ConservationAlert(
            id="alert-ahm-encr-01",
            site_id=AHMEDABAD_ID,
            severity="MODERATE",
            category="encroachment",
            agent="Encroachment Detection Agent",
            title="Potential Encroachment — Verify Before Action",
            description="Demo observation flags potential unauthorized construction near a heritage pol boundary. Human verification is required. This is a demonstration alert only.",
            evidence=[
                "Demo boundary record: 2019 digitized plot boundary",
                "Reported observation: new construction within 15m of pol boundary",
                "Confidence: 0.62 (low — demo system only)",
            ],
            recommendation="HUMAN VERIFICATION REQUIRED. Do not take legal action based on this automated demo alert.",
            status="PENDING_REVIEW",
            human_verification_required=True,
            data_source="SIMULATED_DEMO",
        ),
    ]
    db.add_all(alerts)
    db.flush()


def seed_structural(db: Session):
    existing = db.query(StructuralObservation).count()
    if existing > 0:
        return

    obs = [
        StructuralObservation(
            site_id=MODHERA_ID,
            zone="Main Temple (Gudhamandapa)",
            condition="GOOD",
            risk_level="LOW",
            observations=["No visible structural cracks", "Shikhara intact", "Foundation stable"],
            damage_indicators=[],
            recommended_action="Routine monitoring. Next inspection as per ASI schedule.",
            inspector="DEMO_SYSTEM",
            inspection_date=datetime.utcnow() - timedelta(days=90),
            confidence=0.75,
            data_source="SIMULATED_DEMO",
        ),
        StructuralObservation(
            site_id=MODHERA_ID,
            zone="Sabha Mandap (Assembly Hall)",
            condition="FAIR",
            risk_level="MODERATE",
            observations=["Surface weathering on 3 interior pillars", "Minor efflorescence on north wall"],
            damage_indicators=["Surface spalling", "Water staining"],
            recommended_action="Potential conservation concern — human inspection recommended within 6 months. Do not interpret as professional structural certification.",
            inspector="DEMO_SYSTEM",
            inspection_date=datetime.utcnow() - timedelta(days=45),
            confidence=0.65,
            data_source="SIMULATED_DEMO",
        ),
        StructuralObservation(
            site_id=MODHERA_ID,
            zone="Surya Kund (Step Well)",
            condition="FAIR",
            risk_level="LOW",
            observations=["Step wear consistent with visitor traffic", "Minor algae growth on lower steps"],
            damage_indicators=["Biological growth", "Surface erosion on steps"],
            recommended_action="Install visitor pathway guidance. Schedule seasonal cleaning.",
            inspector="DEMO_SYSTEM",
            inspection_date=datetime.utcnow() - timedelta(days=30),
            confidence=0.70,
            data_source="SIMULATED_DEMO",
        ),
    ]
    db.add_all(obs)
    db.flush()


def seed_encroachment(db: Session):
    existing = db.query(EncroachmentObservation).count()
    if existing > 0:
        return

    obs = [
        EncroachmentObservation(
            site_id=AHMEDABAD_ID,
            location_description="Northeast boundary of Bhagat ni Pol",
            potential_encroachment=True,
            confidence=0.62,
            evidence=["Demo: New structure within 15m of mapped pol boundary", "2019 reference boundary used"],
            recommended_verification="HUMAN VERIFICATION REQUIRED — consult municipal records and heritage boundary survey before any action.",
            reported_by="DEMO_SYSTEM",
            observation_date=datetime.utcnow() - timedelta(days=15),
            status="PENDING_VERIFICATION",
            data_source="SIMULATED_DEMO",
        ),
        EncroachmentObservation(
            site_id=MODHERA_ID,
            location_description="Southern approach road, buffer zone",
            potential_encroachment=False,
            confidence=0.85,
            evidence=["Demo: No structural changes detected in buffer zone", "Road boundary consistent with 2020 survey"],
            recommended_verification="Routine periodic monitoring sufficient. No immediate action required.",
            reported_by="DEMO_SYSTEM",
            observation_date=datetime.utcnow() - timedelta(days=7),
            status="VERIFIED_CLEAR",
            data_source="SIMULATED_DEMO",
        ),
    ]
    db.add_all(obs)
    db.flush()


def run_seed(db: Session):
    """Run all seed functions in dependency order."""
    seed_sites(db)
    seed_zones(db)
    seed_content(db)
    seed_visitor_metrics(db)
    seed_alerts(db)
    seed_structural(db)
    seed_encroachment(db)
    db.commit()


def init_db():
    """Initialize database and run seed data."""
    from app.database.db import engine, SessionLocal
    from app.database import models  # noqa: ensure models are registered
    Base = models.Base  # imported from models
    from app.database.db import Base as DBBase
    DBBase.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        run_seed(db)
    finally:
        db.close()
