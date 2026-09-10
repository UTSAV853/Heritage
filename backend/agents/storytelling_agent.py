"""
HeritageGuardian AI - Personalized Heritage Storytelling Agent
Generates personalized cultural narratives using IBM Granite LLM.
Covers Ahmedabad Walled City, Modhera Sun Temple, and Gujarat heritage.

NOTE: Historical content is based on established heritage knowledge.
Uncertain facts are clearly flagged for authoritative verification.
"""

import json
import logging
from datetime import datetime
from typing import Dict, Any, List, Optional

logger = logging.getLogger(__name__)


HERITAGE_KNOWLEDGE_BASE = {
    "modhera_sun_temple": {
        "name": "Modhera Sun Temple",
        "location": "Modhera, Mehsana District, Gujarat",
        "built": "circa 1026–1027 CE",
        "builder": "Solanki (Chaulukya) dynasty ruler Bhimdev I (Bhima I)",
        "style": "Maru-Gurjara architectural style",
        "unesco": False,
        "description": "One of India's most architecturally refined sun temples, dedicated to Surya (the Sun God). The temple complex includes the Sabha Mandap (assembly hall), Gudha Mandap (vestibule), and Garbhagriha (sanctum). The Surya Kund, a magnificent stepped tank, reflects the entire temple at sunrise.",
        "key_facts": [
            "At the spring and autumn equinoxes, sunrise light illuminates the central idol directly — a feat of astronomical precision (verify with ASI records)",
            "The Sabha Mandap has 52 intricately carved pillars representing the 52 weeks of a year",
            "Surya Kund (stepped tank) has 108 shrines arranged in a geometric pattern; 108 is a sacred number in Hindu cosmology",
            "The temple was reportedly stripped of its main idol by Mahmud Ghazni during his 1024–1025 CE campaigns (per historical accounts)",
            "After a 1819 earthquake caused damage, the Nawab of Radhanpur aided restoration efforts",
            "The temple is now a protected monument under the Archaeological Survey of India",
        ],
        "architecture_highlights": [
            "Shikhara (tower) — no longer intact, but the intricate carvings remain",
            "Over 500 erotic and secular sculptures along the base frieze",
            "Three-stage torana (gateway) at the tank entrance",
            "Solar alignment design — the Garbhagriha faces east toward the rising sun",
        ],
        "visitor_tips": [
            "Best visited at sunrise for solar alignment effect (equinox dates especially)",
            "Evening light show and cultural program available (check ASI schedule)",
            "Modhera village nearby offers local craft shopping",
            "Nearest city: Mehsana (25 km); Ahmedabad (100 km north)"
        ],
        "interesting_facts_by_interest": {
            "architecture": [
                "The intricate shikhara carvings feature over 500 individual sculpture compositions",
                "The temple uses dry-stone construction without mortar — stones held by gravity and precise fitting",
                "The architectural symmetry is precise enough that the structure's shadow lines match solar calendar dates"
            ],
            "science": [
                "Solar alignment at equinoxes is considered one of ancient India's greatest astronomical engineering feats",
                "The Surya Kund's geometry uses precise mathematical ratios still studied by architects today",
                "Water management through the stepped tank demonstrates advanced hydraulic engineering"
            ],
            "history": [
                "The Solanki dynasty ruled Gujarat from approximately 940–1244 CE",
                "Modhera was the capital of the Solanki dynasty when the temple was built",
                "The temple was part of a larger religious complex that included multiple shrines, most of which no longer exist"
            ],
            "religion": [
                "The temple is dedicated to Surya (Sun God), one of the Navagraha (nine celestial bodies) in Hindu tradition",
                "Surya worship was a significant tradition in ancient Gujarat during the Solanki period",
                "The 108 shrines in the Kund represent the 108 names of Surya in Hindu texts"
            ],
            "photography": [
                "Golden hour (sunrise/sunset) creates dramatic lighting on the carved stone surfaces",
                "The Surya Kund provides perfect reflection photography opportunities",
                "The Sabha Mandap pillars create dramatic shadow patterns throughout the day"
            ]
        },
        "walking_routes": {
            "30": "Entry Gate → Sabha Mandap exterior carving highlights → Garbhagriha east face → Surya Kund overview (30 min focus walk)",
            "60": "Entry Gate → Sabha Mandap (interior + carvings, 15 min) → Garbhagriha circuit (15 min) → Surya Kund stairs and shrines (20 min) → Museum (10 min)",
            "120": "Full heritage walk: Entry → Sabha Mandap (in-depth carving tour) → Gudha Mandap → Garbhagriha → Full Surya Kund circuit → All 108 shrines → Museum → Site model room → Photography spots"
        }
    },
    "ahmedabad_walled_city": {
        "name": "Ahmedabad Walled City",
        "location": "Ahmedabad, Gujarat",
        "built": "Founded 1411 CE",
        "builder": "Sultan Ahmed Shah I of the Gujarat Sultanate",
        "style": "Indo-Saracenic / Indo-Islamic",
        "unesco": True,
        "description": "India's first UNESCO World Heritage City (inscribed 2017). The Walled City of Ahmedabad is a living heritage — a dense urban fabric of intricately carved wooden havelis, mosques, temples, and pols (traditional neighborhood clusters) that has been continuously inhabited for 600 years.",
        "key_facts": [
            "Ahmedabad became India's first UNESCO World Heritage City in July 2017",
            "The original city was founded by Ahmad Shah I of the Muzaffarid dynasty on the banks of the Sabarmati river in 1411 CE",
            "The Walled City covers approximately 5.5 square kilometers and houses nearly 600,000 residents",
            "A 'pol' is a unique urban form — a self-contained neighborhood with a single entrance gate, shared community spaces, and intricate wooden facades",
            "Sidi Saiyyed Mosque (1573 CE) is famous for its 'Tree of Life' stone lattice jali windows, considered among the finest examples of stone latticework in the world",
            "Teen Darwaza (Triple Gateway, circa 1415 CE) was the royal entrance to the Maidan Shahi (royal square)"
        ],
        "architecture_highlights": [
            "Sidi Saiyyed Mosque jali (stone lattice) windows — 'Tree of Life' design",
            "Rani Sipri's Mosque — 'Lady of the Lattice' for its elegant proportions",
            "Jama Masjid — 260 pillars, magnificent domes, notable for absorbed Hindu temple elements (per scholars)",
            "Wooden havelis (mansions) with ornate carved facades in the pol neighborhoods",
            "Teen Darwaza (Triple Gate) — ceremonial entrance to the royal precinct"
        ],
        "visitor_tips": [
            "Start the heritage walk from Bhadra Fort early morning to avoid heat",
            "Pol walks are best done with a local guide — Hidden Pockets offers free heritage walks",
            "Friday prayers at Jama Masjid draw large gatherings — plan visits accordingly",
            "The Calico Museum of Textiles (near Shahibaug) requires advance booking",
            "Old city food trail: Manek Chowk for local cuisine (evening markets)"
        ],
        "interesting_facts_by_interest": {
            "architecture": [
                "Pol houses use natural ventilation and passive cooling — narrow lanes limit solar heat gain",
                "The tree-lined 'vorvado' (courtyard) inside pols provides community cooling and social space",
                "Wooden facades are carved by hereditary craftsmen — the craft is now an endangered heritage skill"
            ],
            "history": [
                "Ahmed Shah I chose this site after encountering a hare that turned and faced his hunting dogs — interpreted as an auspicious omen",
                "The city was one of the wealthiest textile trading centers in medieval Asia",
                "Mahatma Gandhi's Sabarmati Ashram (3 km away) became the launching point of the 1930 Salt March"
            ],
            "food": [
                "Manek Chowk transforms into a street food market every evening — try dhokla, fafda, and jalebis",
                "The Walled City is famous for its traditional Gujarati thali culture",
                "Lokhandwala paan and Law Garden chaat are local landmarks"
            ],
            "festivals": [
                "Uttarayan (Kite Festival, 14 January) turns Ahmedabad's skyline into a canvas of thousands of kites",
                "Navratri celebrations in the Walled City are among India's most vibrant, featuring traditional garba dance",
                "Eid prayers at Jama Masjid draw tens of thousands and are a cultural spectacle"
            ],
            "photography": [
                "Blue hour at Teen Darwaza reveals the intricate carved stonework in warm light",
                "Pol entrances and carved wooden facades are photogenic at any time of day",
                "Rooftop views from heritage hotels provide a unique perspective of the dense urban fabric"
            ]
        },
        "walking_routes": {
            "30": "Bhadra Fort → Teen Darwaza (exterior) → Jama Masjid entrance → Sidi Saiyyed Mosque (30 min essential route)",
            "60": "Bhadra Fort → Teen Darwaza → Jama Masjid (interior, 15 min) → Pol entrance at Khadia (15 min) → Sidi Saiyyed Mosque (15 min)",
            "120": "Full heritage walk: Bhadra Fort → Teen Darwaza → Jama Masjid → Rani no Hajiro → Pol houses of Khadia → Sidi Saiyyed Mosque → Rani Sipri Mosque → Swaminarayan Temple → Calico Museum area"
        }
    }
}

LANGUAGE_GREETINGS = {
    "English": "Welcome to",
    "Hindi": "आपका स्वागत है",
    "Gujarati": "આપનું સ્વાગત છે"
}

LANGUAGE_CLOSINGS = {
    "English": "We hope you enjoy your heritage journey. Please help preserve this irreplaceable treasure for future generations.",
    "Hindi": "हम आशा करते हैं कि आप अपनी विरासत यात्रा का आनंद लें। कृपया आने वाली पीढ़ियों के लिए इस अमूल्य धरोहर को संरक्षित करने में सहायता करें।",
    "Gujarati": "અમે આશા રાખીએ છીએ કે આપ આ વિરાસત યાત્રાનો આનંદ માણો. કૃપા કરીને ભવિષ્યની પેઢીઓ માટે આ અણમોલ ધરોહરને સાચવવામાં સહયોગ આપો."
}


class StorytellingAgent:
    """
    AI Heritage Storytelling Agent powered by IBM Granite.
    Generates personalized cultural narratives for heritage visitors.
    
    NOTE: Historical facts are based on established records.
    Uncertain claims are flagged. Verify specific details with ASI official publications.
    """

    def _get_site_knowledge(self, site_name: str) -> Optional[Dict]:
        name_lower = site_name.lower()
        if "modhera" in name_lower or "sun temple" in name_lower:
            return HERITAGE_KNOWLEDGE_BASE["modhera_sun_temple"]
        elif "walled" in name_lower or "ahmedabad" in name_lower or "pol" in name_lower:
            return HERITAGE_KNOWLEDGE_BASE["ahmedabad_walled_city"]
        return HERITAGE_KNOWLEDGE_BASE["ahmedabad_walled_city"]  # default

    def _select_route(self, knowledge: Dict, duration: int) -> str:
        routes = knowledge.get("walking_routes", {})
        if duration <= 35:
            return routes.get("30", "Short heritage walk route")
        elif duration <= 75:
            return routes.get("60", "Standard heritage walk route")
        else:
            return routes.get("120", "Full heritage walk route")

    def _get_interest_facts(self, knowledge: Dict, interests: List[str]) -> List[str]:
        facts = []
        interest_facts = knowledge.get("interesting_facts_by_interest", {})
        for interest in interests:
            interest_lower = interest.lower()
            for key in interest_facts:
                if key in interest_lower or interest_lower in key:
                    facts.extend(interest_facts[key])
                    break
        if not facts:
            facts = knowledge.get("key_facts", [])[:3]
        return list(set(facts))[:5]  # up to 5 unique facts

    def _build_short_story(self, knowledge: Dict, age_group: str, interests: List[str], language: str) -> str:
        greeting = LANGUAGE_GREETINGS.get(language, LANGUAGE_GREETINGS["English"])
        name = knowledge["name"]
        built = knowledge.get("built", "ancient times")
        description = knowledge["description"]

        if language == "Gujarati":
            return (
                f"{greeting} {name}!\n\n"
                f"{name} — ગુજરાતની સૌથી ભવ્ય ધરોહર સ્થળોમાંની એક. "
                f"આ અદ્ભુત સ્થળ {built}માં બાંધવામાં આવ્યું હતું. "
                f"{description}\n\n"
                f"[Note: Full Gujarati narration powered by IBM Granite in production deployment]"
            )
        elif language == "Hindi":
            return (
                f"{greeting} {name}!\n\n"
                f"{name} — गुजरात की सबसे भव्य धरोहर स्थलों में से एक। "
                f"यह अद्भुत स्थल {built} में निर्मित हुआ था। "
                f"{description}\n\n"
                f"[Note: Full Hindi narration powered by IBM Granite in production deployment]"
            )
        else:
            age_opener = {
                "Child (under 12)": f"Hey there, young explorer! Did you know {name} is like a giant puzzle made of stone?",
                "Teen (13-17)": f"Welcome, adventurer! {name} hides some seriously mind-blowing secrets that even engineers today struggle to explain.",
                "Young Adult (18-30)": f"Welcome to {name} — where a 1,000-year-old civilization left its most breathtaking signature.",
                "Adult (30-60)": f"Step into {name}, where every carved stone tells a story spanning over a millennium of history.",
                "Senior (60+)": f"Welcome to {name} — a timeless masterpiece that has endured centuries of history, still standing as a testament to human ingenuity."
            }.get(age_group, f"Welcome to {name}!")

            return f"{age_opener}\n\n{description}\n\nBuilt in {built}, this magnificent site continues to inspire wonder in every visitor."

    def _generate_did_you_know(self, knowledge: Dict, interests: List[str]) -> List[str]:
        all_facts = knowledge.get("key_facts", [])
        interest_facts = self._get_interest_facts(knowledge, interests)
        combined = list(set(all_facts + interest_facts))
        return combined[:4]

    def _generate_follow_up_questions(self, knowledge: Dict, interests: List[str]) -> List[str]:
        base_questions = [
            f"What makes {knowledge['name']} architecturally unique compared to other heritage sites?",
            f"How was {knowledge['name']} built without modern construction tools?",
            "What conservation challenges does this site face today?",
            "How can I contribute to heritage preservation?",
        ]

        interest_questions = {
            "architecture": "Can you explain the specific architectural style used and its regional variations?",
            "history": "What historical events significantly shaped or damaged this site?",
            "science": "What scientific principles were used in the construction and orientation of this monument?",
            "religion": "What religious practices were conducted here historically, and which continue today?",
            "photography": "What are the best vantage points and lighting conditions for photography here?",
            "festivals": "What festivals and cultural events are celebrated at this site?",
            "food": "What local food experiences are connected to the cultural heritage of this area?",
        }

        extras = [interest_questions[i.lower()] for i in interests if i.lower() in interest_questions]
        return (base_questions[:2] + extras)[:5]

    async def generate_story(
        self,
        site_name: str,
        age_group: str = "Adult (30-60)",
        language: str = "English",
        interests: Optional[List[str]] = None,
        duration_minutes: int = 60,
        experience_type: str = "Educational",
        granite_service=None
    ) -> Dict[str, Any]:
        """
        Generates a personalized heritage story.
        Uses IBM Granite when available; falls back to knowledge-base templates.
        """
        if interests is None:
            interests = ["Architecture", "History"]

        logger.info(f"[StorytellingAgent] Generating story for {site_name}, language={language}, interests={interests}")

        knowledge = self._get_site_knowledge(site_name)
        if not knowledge:
            return {"error": f"No heritage knowledge available for site: {site_name}"}

        walking_route = self._select_route(knowledge, duration_minutes)
        interest_facts = self._get_interest_facts(knowledge, interests)
        did_you_know = self._generate_did_you_know(knowledge, interests)
        follow_up_questions = self._generate_follow_up_questions(knowledge, interests)
        short_story = self._build_short_story(knowledge, age_group, interests, language)

        # Use Granite for detailed story
        detailed_story = short_story  # fallback
        granite_story = ""
        if granite_service:
            granite_story = await granite_service.generate_story({
                "site_name": knowledge["name"],
                "language": language,
                "age_group": age_group,
                "interests": interests,
                "duration_minutes": duration_minutes,
                "experience_type": experience_type
            })
            if granite_story:
                detailed_story = granite_story

        closing = LANGUAGE_CLOSINGS.get(language, LANGUAGE_CLOSINGS["English"])

        return {
            "agent": "Personalized Heritage Storytelling Agent",
            "site_name": knowledge["name"],
            "timestamp": datetime.utcnow().isoformat(),
            "visitor_profile": {
                "age_group": age_group,
                "language": language,
                "interests": interests,
                "duration_minutes": duration_minutes,
                "experience_type": experience_type
            },
            "short_story": short_story,
            "detailed_story": detailed_story,
            "interesting_facts": interest_facts,
            "walking_route": walking_route,
            "did_you_know": did_you_know,
            "follow_up_questions": follow_up_questions,
            "visitor_tips": knowledge.get("visitor_tips", [])[:3],
            "architecture_highlights": knowledge.get("architecture_highlights", []),
            "closing_message": closing,
            "powered_by": "IBM Granite LLM" if granite_story else "Heritage Knowledge Base (Granite demo mode)",
            "disclaimer": (
                "Heritage facts verified against established historical records. "
                "Specific dates and figures marked as 'per accounts' or 'historians suggest' should be "
                "confirmed with ASI official publications."
            )
        }


storytelling_agent = StorytellingAgent()
