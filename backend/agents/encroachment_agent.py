"""
HeritageGuardian AI - Encroachment Detection Agent
Detects potential encroachment near heritage zones using image comparison.
Uses simulated CV analysis for hackathon demo.

IMPORTANT: All detections are "potential" observations requiring field verification.
This system does NOT make legal determinations about encroachment.
"""

import random
import logging
from datetime import datetime
from typing import Dict, Any, Optional, List

logger = logging.getLogger(__name__)


ENCROACHMENT_TYPES = [
    {
        "type": "New Construction",
        "description": "Possible new permanent structure construction detected near heritage boundary",
        "authority": "Urban Development Authority / ASI Protection Officer",
        "severity_range": (0.6, 0.9)
    },
    {
        "type": "Temporary Structure",
        "description": "Possible temporary structure (market stall, shed, scaffolding) observed near protected zone",
        "authority": "Municipal Corporation / Heritage Ward Officer",
        "severity_range": (0.3, 0.65)
    },
    {
        "type": "Illegal Extension",
        "description": "Possible unauthorized extension to existing structure observed",
        "authority": "Town Planning Authority / ASI Gujarat Circle",
        "severity_range": (0.55, 0.85)
    },
    {
        "type": "Construction Activity Near Boundary",
        "description": "Active construction activity observed near heritage protection boundary",
        "authority": "ASI Protection Officer / District Collector Heritage Cell",
        "severity_range": (0.5, 0.80)
    },
    {
        "type": "Visual Obstruction",
        "description": "New structure appears to obstruct heritage site viewshed",
        "authority": "Heritage Conservation Committee / Municipal Corporation",
        "severity_range": (0.35, 0.65)
    },
    {
        "type": "Land Use Change",
        "description": "Potential change in land use pattern detected within heritage buffer zone",
        "authority": "Revenue Department / ASI Archaeological Officer",
        "severity_range": (0.45, 0.75)
    }
]

SEVERITY_LABELS = {
    (0.0, 0.4): ("Low", "#22c55e"),
    (0.4, 0.65): ("Moderate", "#eab308"),
    (0.65, 0.85): ("High", "#f97316"),
    (0.85, 1.0): ("Critical", "#ef4444"),
}


class EncroachmentDetectionAgent:
    """
    AI agent for detecting potential encroachment near heritage protection zones.
    
    DISCLAIMER: All detections use the language "potential", "possible", "appears to show".
    This system does NOT provide legal determinations. Field verification by authorized 
    government officials is REQUIRED before any enforcement action.
    """

    def _get_severity_label(self, score: float) -> tuple:
        for (low, high), (label, color) in SEVERITY_LABELS.items():
            if low <= score < high:
                return label, color
        return "Critical", "#ef4444"

    def _simulate_image_analysis(
        self, image_path: Optional[str], historical_image_path: Optional[str], site_name: str
    ) -> Dict[str, Any]:
        """
        Simulates image-based encroachment detection.
        In production: integrate with satellite imagery API, drone feed, or GIS change detection.
        """
        seed = sum(ord(c) for c in (site_name or "site")) + (1 if image_path else 0)
        rng = random.Random(seed)

        confidence = rng.uniform(0.55, 0.88)
        encroachment_detected = confidence > 0.58  # Most uploads trigger detection in demo

        if not encroachment_detected:
            return {
                "encroachment_detected": False,
                "confidence": round(confidence, 2),
                "message": "No significant changes detected in the monitored heritage boundary area.",
                "recommendation": "Continue routine monitoring. Schedule next comparison in 30 days.",
                "analysis_method": "DEMO - Simulated Satellite/Drone Image Change Detection"
            }

        # Select encroachment type
        enc_type = rng.choice(ENCROACHMENT_TYPES)
        sev_low, sev_high = enc_type["severity_range"]
        severity_score = rng.uniform(sev_low, sev_high)
        severity_label, severity_color = self._get_severity_label(severity_score)

        # Detected changes
        detected_changes = []
        num_changes = rng.randint(1, 3)
        change_types = [
            "Roofline elevation change",
            "New wall structure visible",
            "Ground-level material stockpile",
            "Scaffolding/construction equipment",
            "Boundary marker displacement",
            "Vegetation clearance near boundary",
            "New access road/path cut",
        ]
        for change in rng.sample(change_types, min(num_changes, len(change_types))):
            detected_changes.append({
                "change": change,
                "confidence": round(rng.uniform(0.60, 0.90), 2),
                "location": rng.choice([
                    "Northern boundary zone",
                    "Eastern perimeter",
                    "100m buffer zone",
                    "Adjacent plot — heritage boundary"
                ])
            })

        has_comparison = bool(historical_image_path)

        return {
            "encroachment_detected": True,
            "encroachment_type": enc_type["type"],
            "description": enc_type["description"],
            "confidence": round(confidence, 2),
            "severity_score": round(severity_score, 2),
            "severity_label": severity_label,
            "severity_color": severity_color,
            "authority": enc_type["authority"],
            "detected_changes": detected_changes,
            "has_comparison": has_comparison,
            "comparison_note": (
                "Before/after comparison performed — changes from historical baseline identified."
                if has_comparison else
                "No historical image provided — single-image analysis only. Comparison not available."
            ),
            "analysis_method": "DEMO - Simulated Satellite/Drone Image Change Detection",
            "disclaimer": (
                "⚠️ POTENTIAL ENCROACHMENT DETECTED — This is an AI-assisted observation only. "
                "NOT a legal determination. Mandatory field verification by authorized government "
                "officials required before any enforcement action."
            )
        }

    def _get_action_plan(self, severity: str, enc_type: str, authority: str) -> List[str]:
        base_actions = {
            "Low": [
                "Log observation in heritage monitoring system",
                "Schedule site visit within 30 days for field verification",
                "Notify ward-level heritage officer for awareness",
            ],
            "Moderate": [
                "Immediate notification to Heritage Protection Officer",
                "Field verification visit within 7 days",
                "Document with GPS coordinates and photographic evidence",
                "File preliminary observation report with ASI district office",
            ],
            "High": [
                "⚠️ URGENT: Notify ASI Regional Director and District Collector Heritage Cell within 24 hours",
                "Dispatch field verification team immediately",
                "Coordinate with law enforcement if active construction confirmed",
                "Issue show-cause notice to plot owner pending verification",
                "Document all evidence for legal record",
            ],
            "Critical": [
                "🔴 CRITICAL: Emergency escalation to State Heritage Commissioner",
                "Immediate on-site presence of protection officer required",
                "Coordinate with police for site security",
                "Preserve all photographic and digital evidence",
                "Prepare emergency injunction request if construction is ongoing",
                "Media blackout until official verification to prevent misinformation",
            ]
        }
        actions = base_actions.get(severity, base_actions["Moderate"])
        actions.append(f"Responsible authority: {authority}")
        return actions

    async def analyze_encroachment(
        self,
        site_name: str,
        image_path: Optional[str] = None,
        historical_image_path: Optional[str] = None,
        granite_service=None
    ) -> Dict[str, Any]:
        """Main encroachment analysis method."""
        logger.info(f"[EncroachmentAgent] Analyzing for site: {site_name}")

        analysis = self._simulate_image_analysis(image_path, historical_image_path, site_name)

        if not analysis["encroachment_detected"]:
            return {
                "agent": "Encroachment Detection Agent",
                "site_name": site_name,
                "timestamp": datetime.utcnow().isoformat(),
                "encroachment_detected": False,
                "message": analysis["message"],
                "recommendation": analysis["recommendation"],
                "granite_reasoning": None,
                "disclaimer": "AI-assisted monitoring. Field verification recommended for any boundary concerns."
            }

        severity = analysis["severity_label"]
        authority = analysis["authority"]
        action_plan = self._get_action_plan(severity, analysis["encroachment_type"], authority)

        # Granite analysis
        granite_analysis = ""
        if granite_service:
            granite_analysis = await granite_service.analyze_encroachment({
                "site_name": site_name,
                "encroachment_type": analysis["encroachment_type"],
                "confidence": int(analysis["confidence"] * 100),
                "location": analysis["detected_changes"][0]["location"] if analysis["detected_changes"] else "Unknown",
                "changes_detected": ", ".join([c["change"] for c in analysis["detected_changes"]])
            })

        return {
            "agent": "Encroachment Detection Agent",
            "site_name": site_name,
            "timestamp": datetime.utcnow().isoformat(),
            "encroachment_detected": True,
            "encroachment_type": analysis["encroachment_type"],
            "description": analysis["description"],
            "confidence": analysis["confidence"],
            "severity_score": analysis["severity_score"],
            "severity": severity,
            "severity_color": analysis["severity_color"],
            "detected_changes": analysis["detected_changes"],
            "has_comparison": analysis["has_comparison"],
            "comparison_note": analysis["comparison_note"],
            "action_plan": action_plan,
            "responsible_authority": authority,
            "granite_reasoning": granite_analysis,
            "analysis_method": analysis["analysis_method"],
            "disclaimer": analysis["disclaimer"],
            "summary": (
                f"Potential {analysis['encroachment_type']} detected near {site_name} "
                f"with {int(analysis['confidence']*100)}% confidence. "
                f"Severity: {severity}. Immediate field verification recommended."
            )
        }


encroachment_agent = EncroachmentDetectionAgent()
