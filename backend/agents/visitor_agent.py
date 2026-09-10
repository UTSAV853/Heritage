"""
HeritageGuardian AI - Visitor Flow Management Agent
Monitors visitor density, crowd levels, and generates flow management recommendations.
Uses simulated real-time data for hackathon demo.
"""

import random
import logging
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional

logger = logging.getLogger(__name__)


ZONE_DEFINITIONS = {
    "modhera": [
        {"id": "zone_a", "name": "Main Temple Sanctum", "max_capacity": 50, "risk_factor": "high"},
        {"id": "zone_b", "name": "Sabha Mandap (Assembly Hall)", "max_capacity": 80, "risk_factor": "medium"},
        {"id": "zone_c", "name": "Surya Kund (Stepped Tank)", "max_capacity": 150, "risk_factor": "low"},
        {"id": "zone_d", "name": "Museum & Exhibits", "max_capacity": 100, "risk_factor": "low"},
        {"id": "zone_e", "name": "Entry Gate & Courtyard", "max_capacity": 200, "risk_factor": "low"},
    ],
    "walled_city": [
        {"id": "zone_a", "name": "Bhadra Fort Area", "max_capacity": 200, "risk_factor": "medium"},
        {"id": "zone_b", "name": "Teen Darwaza", "max_capacity": 150, "risk_factor": "medium"},
        {"id": "zone_c", "name": "Sidi Saiyyed Mosque", "max_capacity": 80, "risk_factor": "high"},
        {"id": "zone_d", "name": "Pol Houses Trail", "max_capacity": 120, "risk_factor": "medium"},
        {"id": "zone_e", "name": "Calico Museum Precinct", "max_capacity": 100, "risk_factor": "low"},
    ]
}

ROUTES = {
    "modhera": {
        "primary": "Main Gate → Sabha Mandap → Sanctum → Kund",
        "alternate_b": "Parking → Museum → Kund → Sabha Mandap (Southern Approach)",
        "overflow": "Visitor Center → Audio Guide Route → Scheduled Group Entry"
    },
    "walled_city": {
        "primary": "Bhadra Gate → Teen Darwaza → Sidi Saiyyed → Pol Walk",
        "alternate_b": "Relief Road Entry → Calico Museum → Pol Houses → Teen Darwaza",
        "overflow": "Heritage Walk Timed Slots — Register at Information Centre"
    }
}


class VisitorFlowAgent:
    """
    AI agent for monitoring and managing visitor flow at heritage sites.
    NOTE: All visitor counts are SIMULATED for hackathon demonstration.
    Real deployment requires integration with IoT sensors, ticketing systems, or camera feeds.
    """

    def _get_site_key(self, site_name: str) -> str:
        name_lower = site_name.lower()
        if "modhera" in name_lower:
            return "modhera"
        return "walled_city"

    def _get_crowd_level(self, occupancy_pct: float) -> Dict[str, str]:
        if occupancy_pct < 40:
            return {"level": "Green", "label": "Low", "color": "#22c55e", "action": "Normal operations"}
        elif occupancy_pct < 65:
            return {"level": "Yellow", "label": "Moderate", "color": "#eab308", "action": "Monitor closely"}
        elif occupancy_pct < 85:
            return {"level": "Orange", "label": "High", "color": "#f97316", "action": "Activate diversion protocol"}
        else:
            return {"level": "Red", "label": "Critical", "color": "#ef4444", "action": "Halt entry, emergency management"}

    def _get_wait_time(self, occupancy_pct: float) -> int:
        if occupancy_pct < 40:
            return 0
        elif occupancy_pct < 65:
            return random.randint(5, 15)
        elif occupancy_pct < 85:
            return random.randint(15, 35)
        else:
            return random.randint(35, 60)

    def _generate_zone_data(self, site_key: str, total_visitors: int) -> List[Dict]:
        zones = ZONE_DEFINITIONS.get(site_key, ZONE_DEFINITIONS["walled_city"])
        zone_data = []
        remaining = total_visitors

        for i, zone in enumerate(zones):
            if i == len(zones) - 1:
                count = remaining
            else:
                # Distribute visitors with some randomness
                fraction = random.uniform(0.15, 0.35)
                count = int(total_visitors * fraction)
                remaining -= count

            occupancy = min(100, round((count / zone["max_capacity"]) * 100, 1))
            crowd = self._get_crowd_level(occupancy)
            zone_data.append({
                **zone,
                "visitor_count": max(0, count),
                "occupancy_pct": occupancy,
                "crowd_level": crowd["level"],
                "crowd_label": crowd["label"],
                "crowd_color": crowd["color"],
                "density": "High" if occupancy > 75 else "Medium" if occupancy > 40 else "Low"
            })

        return zone_data

    def _generate_hourly_data(self) -> List[Dict]:
        """Generates simulated 24-hour visitor pattern."""
        hourly = []
        hour_weights = [
            0.02, 0.01, 0.01, 0.01, 0.01, 0.02,   # 0-5 AM
            0.05, 0.08, 0.12, 0.13, 0.11, 0.10,    # 6-11 AM
            0.09, 0.08, 0.09, 0.11, 0.13, 0.12,    # 12-5 PM
            0.08, 0.06, 0.04, 0.03, 0.02, 0.02     # 6-11 PM
        ]
        base_daily = random.randint(800, 1400)
        for hour, weight in enumerate(hour_weights):
            count = int(base_daily * weight * random.uniform(0.85, 1.15))
            hourly.append({
                "hour": f"{hour:02d}:00",
                "visitor_count": count,
                "is_peak": weight > 0.10
            })
        return hourly

    def _generate_weekly_trend(self) -> List[Dict]:
        days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        weights = [0.65, 0.60, 0.70, 0.75, 0.85, 1.20, 1.30]
        base = 900
        return [
            {"day": day, "visitors": int(base * w * random.uniform(0.9, 1.1))}
            for day, w in zip(days, weights)
        ]

    def get_current_visitor_data(
        self, site_name: str, max_capacity: int = 500
    ) -> Dict[str, Any]:
        """
        Returns current simulated visitor data.
        DATA IS SIMULATED — clearly labeled.
        """
        site_key = self._get_site_key(site_name)
        rng = random.Random(int(datetime.utcnow().timestamp() / 300))  # Updates every 5 min

        # Simulate based on time of day
        hour = datetime.now().hour
        hour_weights = [
            0.02, 0.01, 0.01, 0.01, 0.01, 0.02,
            0.05, 0.08, 0.12, 0.13, 0.11, 0.10,
            0.09, 0.08, 0.09, 0.11, 0.13, 0.12,
            0.08, 0.06, 0.04, 0.03, 0.02, 0.02
        ]
        base_visitors = int(max_capacity * hour_weights[hour] * rng.uniform(0.8, 1.5) * 8)
        visitor_count = min(max_capacity, max(0, base_visitors))

        occupancy_pct = round((visitor_count / max_capacity) * 100, 1)
        crowd_info = self._get_crowd_level(occupancy_pct)
        wait_time = self._get_wait_time(occupancy_pct)
        is_peak = hour_weights[hour] > 0.10

        zone_data = self._generate_zone_data(site_key, visitor_count)
        routes = ROUTES.get(site_key, ROUTES["walled_city"])

        # Generate recommendations
        recommendations = self._generate_recommendations(
            site_name, visitor_count, max_capacity, occupancy_pct, crowd_info, zone_data, routes
        )

        return {
            "agent": "Visitor Flow Management Agent",
            "site_name": site_name,
            "timestamp": datetime.utcnow().isoformat(),
            "is_simulated": True,
            "simulation_note": "⚠️ SIMULATED DATA — For demo purposes only. Real deployment requires IoT sensor/ticketing integration.",
            "current_visitor_count": visitor_count,
            "max_capacity": max_capacity,
            "occupancy_percentage": occupancy_pct,
            "crowd_level": crowd_info["level"],
            "crowd_label": crowd_info["label"],
            "crowd_color": crowd_info["color"],
            "recommended_action": crowd_info["action"],
            "estimated_wait_time_minutes": wait_time,
            "is_peak_hour": is_peak,
            "peak_hours": "10:00–12:00 and 16:00–18:00",
            "zone_data": zone_data,
            "routes": routes,
            "recommendations": recommendations,
            "hourly_data": self._generate_hourly_data(),
            "weekly_trend": self._generate_weekly_trend(),
        }

    def _generate_recommendations(
        self, site_name, visitor_count, max_capacity, occupancy_pct,
        crowd_info, zone_data, routes
    ) -> List[str]:
        recs = []
        level = crowd_info["level"]

        if level == "Red":
            recs.append(f"🔴 CRITICAL: Halt new entry at main gate immediately. Visitor count ({visitor_count}) exceeds safe capacity.")
            recs.append(f"Activate emergency visitor management protocol. Contact site security team.")
        elif level == "Orange":
            high_zones = [z for z in zone_data if z["crowd_level"] in ["Orange", "Red"]]
            if high_zones:
                zone_names = ", ".join([z["name"] for z in high_zones[:2]])
                recs.append(f"⚠️ High density detected near {zone_names}. Redirect incoming visitors to Route B: {routes.get('alternate_b', 'Alternate route')}.")
            recs.append(f"Implement timed-entry slots. Current occupancy {occupancy_pct}% — limit new admissions.")
        elif level == "Yellow":
            recs.append(f"📊 Moderate density. Monitor Zone A and Zone B closely. Deploy additional staff to crowd hotspots.")
        else:
            recs.append(f"✅ Visitor flow is normal. Continue regular monitoring. Estimated {max_capacity - visitor_count} additional visitors can be accommodated.")

        recs.append(f"Peak hours typically 10:00–12:00 and 16:00–18:00. Pre-book timed slots to reduce congestion.")
        return recs

    async def analyze_with_granite(
        self, site_name: str, max_capacity: int = 500, granite_service=None
    ) -> Dict[str, Any]:
        """Full analysis with Granite AI reasoning."""
        data = self.get_current_visitor_data(site_name, max_capacity)

        if granite_service:
            granite_rec = await granite_service.analyze_visitor_flow({
                "site_name": site_name,
                "visitor_count": data["current_visitor_count"],
                "max_capacity": max_capacity,
                "occupancy_pct": data["occupancy_percentage"],
                "crowd_level": data["crowd_level"],
                "zone_data": {z["name"]: z["visitor_count"] for z in data["zone_data"]}
            })
            data["granite_reasoning"] = granite_rec

        return data


visitor_agent = VisitorFlowAgent()
