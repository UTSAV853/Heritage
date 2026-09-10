"""
HeritageGuardian AI - Structural Health Monitoring Agent
Analyzes heritage structure images for damage, deterioration, and risk assessment.
Uses computer vision simulation + IBM Granite reasoning.
"""

import os
import json
import random
import logging
from datetime import datetime, timedelta
from typing import Dict, Any, Optional, List
from pathlib import Path

logger = logging.getLogger(__name__)

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "./uploads")


class StructuralHealthAgent:
    """
    AI agent for structural health monitoring of heritage sites.
    Performs image-based analysis with risk scoring.
    
    NOTE: All outputs are AI-assisted observations, NOT certified structural engineering assessments.
    Physical inspection by qualified engineers is required for official determinations.
    """

    ISSUE_TYPES = [
        "Surface Crack",
        "Weathering Damage",
        "Water/Moisture Infiltration",
        "Stone Deterioration",
        "Structural Anomaly",
        "Discoloration/Staining",
        "Broken Architectural Element",
        "Mortar Joint Failure",
        "Biological Growth (Algae/Moss)",
        "Spalling/Flaking",
    ]

    RISK_LEVELS = [
        ("Healthy", 0, 20),
        ("Low Risk", 21, 40),
        ("Moderate Risk", 41, 60),
        ("High Risk", 61, 80),
        ("Critical", 81, 100),
    ]

    def get_risk_level(self, score: float) -> str:
        for level, low, high in self.RISK_LEVELS:
            if low <= score <= high:
                return level
        return "Critical"

    def get_priority(self, risk_level: str) -> str:
        mapping = {
            "Healthy": "Routine",
            "Low Risk": "Low",
            "Moderate Risk": "Medium",
            "High Risk": "High",
            "Critical": "Immediate"
        }
        return mapping.get(risk_level, "Medium")

    def get_next_inspection_days(self, risk_level: str) -> int:
        mapping = {
            "Healthy": 180,
            "Low Risk": 90,
            "Moderate Risk": 30,
            "High Risk": 7,
            "Critical": 1
        }
        return mapping.get(risk_level, 30)

    def _simulate_computer_vision_analysis(
        self, image_path: Optional[str], site_name: str, sensor_readings: Optional[Dict] = None
    ) -> Dict[str, Any]:
        """
        Simulates computer vision analysis for demo purposes.
        In production, replace with actual CV model (IBM Watson Vision, YOLO, etc.)
        
        DISCLAIMER: This is simulated analysis for demonstration. 
        Real deployment requires certified CV model validation.
        """
        # Deterministic simulation based on site name for consistency
        seed = sum(ord(c) for c in (site_name or "heritage"))
        rng = random.Random(seed + datetime.now().hour)

        risk_score = rng.uniform(30, 85)

        # Weight issues based on score
        num_issues = max(1, int(risk_score / 20))
        detected_issues = []

        issue_pool = rng.sample(self.ISSUE_TYPES, min(num_issues + 2, len(self.ISSUE_TYPES)))
        for i, issue in enumerate(issue_pool[:num_issues]):
            severity = "High" if risk_score > 65 else "Moderate" if risk_score > 40 else "Low"
            confidence = rng.uniform(0.65, 0.95)
            detected_issues.append({
                "issue_type": issue,
                "severity": severity,
                "confidence": round(confidence, 2),
                "location": rng.choice([
                    "Eastern Façade", "Northern Wall", "Base Structure",
                    "Carved Panels", "Entry Arch", "Roof Section", "Pillar Column"
                ]),
                "description": self._get_issue_description(issue, severity)
            })

        # Sensor contribution
        if sensor_readings:
            moisture = sensor_readings.get("moisture_level", 0)
            if moisture > 70:
                risk_score = min(100, risk_score + 10)
                detected_issues.append({
                    "issue_type": "Moisture Sensor Alert",
                    "severity": "High",
                    "confidence": 0.92,
                    "location": "Interior Walls",
                    "description": f"Moisture level at {moisture}% — above safe threshold of 65%"
                })

        risk_level = self.get_risk_level(risk_score)

        return {
            "risk_score": round(risk_score, 1),
            "risk_level": risk_level,
            "confidence_score": round(rng.uniform(0.72, 0.94), 2),
            "detected_issues": detected_issues,
            "analysis_method": "DEMO - Simulated Computer Vision (CV Model placeholder)",
            "disclaimer": (
                "⚠️ AI-Assisted Observation Only — NOT a certified structural engineering assessment. "
                "Physical inspection by qualified engineers required for official determination."
            )
        }

    def _get_issue_description(self, issue_type: str, severity: str) -> str:
        descriptions = {
            "Surface Crack": f"{severity} hairline/structural crack pattern detected. Progressive stress fracturing observed.",
            "Weathering Damage": f"{severity} surface weathering from environmental exposure. Stone surface erosion visible.",
            "Water/Moisture Infiltration": f"{severity} moisture ingress detected. Efflorescence and salt deposits present.",
            "Stone Deterioration": f"{severity} granular disintegration of stone substrate. Material loss observed.",
            "Structural Anomaly": f"{severity} deviation from expected structural geometry. Possible settlement or deformation.",
            "Discoloration/Staining": f"{severity} biological or chemical staining on carved surfaces.",
            "Broken Architectural Element": f"{severity} damage to decorative/structural carving element.",
            "Mortar Joint Failure": f"{severity} mortar deterioration between stone joints. Binding failure risk.",
            "Biological Growth (Algae/Moss)": f"{severity} biological colonization accelerating stone degradation.",
            "Spalling/Flaking": f"{severity} surface layer detachment. Subsurface moisture or freeze-thaw cycling likely cause.",
        }
        return descriptions.get(issue_type, f"{severity} anomaly detected.")

    def _get_recommendations(self, risk_level: str, issues: List[Dict]) -> str:
        base = {
            "Healthy": "Continue routine monitoring schedule. No immediate intervention required.",
            "Low Risk": "Schedule preventive maintenance within 90 days. Document observed conditions.",
            "Moderate Risk": "Arrange professional inspection within 30 days. Apply targeted conservation treatment.",
            "High Risk": "Urgent inspection required within 7 days. Consider temporary protective measures. Notify conservation authority.",
            "Critical": "IMMEDIATE intervention required. Restrict public access to affected zone. Emergency conservation response needed."
        }
        rec = base.get(risk_level, "Schedule inspection.")

        # Add issue-specific recommendations
        issue_types = [i["issue_type"] for i in issues]
        if "Water/Moisture Infiltration" in issue_types:
            rec += " Prioritize waterproofing treatment and drainage improvement."
        if "Surface Crack" in issue_types:
            rec += " Inject crack consolidant and monitor crack propagation."
        if "Biological Growth (Algae/Moss)" in issue_types:
            rec += " Apply biocide treatment to biological growth areas."

        return rec

    async def analyze_image(
        self,
        site_name: str,
        image_path: Optional[str] = None,
        previous_image_path: Optional[str] = None,
        sensor_readings: Optional[Dict] = None,
        granite_service=None
    ) -> Dict[str, Any]:
        """
        Main analysis method: runs CV simulation + Granite reasoning.
        """
        logger.info(f"[StructuralAgent] Analyzing image for site: {site_name}")

        # Step 1: CV Analysis
        cv_result = self._simulate_computer_vision_analysis(image_path, site_name, sensor_readings)
        risk_score = cv_result["risk_score"]
        risk_level = cv_result["risk_level"]
        detected_issues = cv_result["detected_issues"]

        # Step 2: Comparison with previous image
        comparison_result = None
        if previous_image_path:
            prev_seed = sum(ord(c) for c in site_name) + 5
            prev_rng = random.Random(prev_seed)
            prev_score = prev_rng.uniform(20, 60)
            change = risk_score - prev_score
            comparison_result = {
                "previous_risk_score": round(prev_score, 1),
                "change": round(change, 1),
                "trend": "Deteriorating" if change > 5 else "Stable" if abs(change) <= 5 else "Improving",
                "note": f"Risk score changed by {change:+.1f} points since last inspection"
            }

        # Step 3: Granite reasoning
        granite_analysis = ""
        if granite_service:
            granite_analysis = await granite_service.analyze_structural({
                "site_name": site_name,
                "detected_issues": detected_issues,
                "risk_score": risk_score,
                "sensor_readings": sensor_readings or {},
                "previous_assessment": comparison_result.get("trend") if comparison_result else "First inspection"
            })

        priority = self.get_priority(risk_level)
        next_inspection_days = self.get_next_inspection_days(risk_level)
        recommendations = self._get_recommendations(risk_level, detected_issues)

        return {
            "agent": "Structural Health Monitoring Agent",
            "site_name": site_name,
            "analysis_timestamp": datetime.utcnow().isoformat(),
            "risk_score": risk_score,
            "risk_level": risk_level,
            "confidence_score": cv_result["confidence_score"],
            "detected_issues": detected_issues,
            "priority": priority,
            "recommendations": recommendations,
            "next_inspection_date": (datetime.utcnow() + timedelta(days=next_inspection_days)).isoformat(),
            "next_inspection_days": next_inspection_days,
            "comparison": comparison_result,
            "granite_reasoning": granite_analysis,
            "analysis_method": cv_result["analysis_method"],
            "disclaimer": cv_result["disclaimer"],
            "summary": (
                f"{risk_level} detected at {site_name}. "
                f"Risk score: {risk_score}/100. "
                f"{len(detected_issues)} issue(s) identified. "
                f"Priority: {priority}. "
                f"Next inspection recommended in {next_inspection_days} days."
            )
        }

    async def get_demo_analysis(self, site_name: str = "Modhera Sun Temple") -> Dict[str, Any]:
        """Returns a pre-built demo analysis for hackathon demonstration."""
        return await self.analyze_image(site_name=site_name)


structural_agent = StructuralHealthAgent()
