"""
HeritageGuardian AI - Granite LLM Service
Handles all IBM Granite API interactions for AI reasoning, storytelling, and summarization.
When IBM Granite API is unavailable, returns structured demo responses.
"""

import os
import json
import logging
import httpx
from typing import Optional, Dict, Any

logger = logging.getLogger(__name__)

GRANITE_API_KEY = os.getenv("GRANITE_API_KEY", "")
IBM_CLOUD_API_KEY = os.getenv("IBM_CLOUD_API_KEY", "")
IBM_PROJECT_ID = os.getenv("IBM_PROJECT_ID", "")
GRANITE_API_URL = os.getenv(
    "GRANITE_API_URL",
    "https://us-south.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29"
)
GRANITE_MODEL = os.getenv("GRANITE_MODEL", "ibm/granite-13b-instruct-v2")

IAM_TOKEN_URL = "https://iam.cloud.ibm.com/identity/token"


class GraniteService:
    """IBM Granite LLM integration service with demo fallback."""

    def __init__(self):
        self.access_token: Optional[str] = None
        self.demo_mode = not bool(GRANITE_API_KEY or IBM_CLOUD_API_KEY)
        if self.demo_mode:
            logger.info("Granite running in DEMO MODE — no API key configured.")

    async def _get_iam_token(self) -> Optional[str]:
        """Fetch IAM token from IBM Cloud using API key."""
        if not IBM_CLOUD_API_KEY:
            return None
        try:
            async with httpx.AsyncClient(timeout=15) as client:
                resp = await client.post(
                    IAM_TOKEN_URL,
                    data={
                        "grant_type": "urn:ibm:params:oauth:grant-type:apikey",
                        "apikey": IBM_CLOUD_API_KEY
                    },
                    headers={"Content-Type": "application/x-www-form-urlencoded"}
                )
                resp.raise_for_status()
                return resp.json().get("access_token")
        except Exception as e:
            logger.error(f"Failed to get IAM token: {e}")
            return None

    async def generate(self, prompt: str, max_tokens: int = 500, temperature: float = 0.7) -> str:
        """
        Generate text using IBM Granite LLM.
        Falls back to structured demo responses when API is unavailable.
        """
        if self.demo_mode:
            return self._demo_response(prompt)

        token = GRANITE_API_KEY or await self._get_iam_token()
        if not token:
            return self._demo_response(prompt)

        try:
            payload = {
                "model_id": GRANITE_MODEL,
                "input": prompt,
                "parameters": {
                    "decoding_method": "greedy",
                    "max_new_tokens": max_tokens,
                    "temperature": temperature,
                    "repetition_penalty": 1.1
                },
                "project_id": IBM_PROJECT_ID
            }
            headers = {
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
            async with httpx.AsyncClient(timeout=30) as client:
                resp = await client.post(GRANITE_API_URL, json=payload, headers=headers)
                resp.raise_for_status()
                result = resp.json()
                generated = result.get("results", [{}])[0].get("generated_text", "")
                return generated.strip()
        except Exception as e:
            logger.error(f"Granite API error: {e}")
            return self._demo_response(prompt)

    def _demo_response(self, prompt: str) -> str:
        """
        Structured demo responses based on prompt context.
        Clearly labeled as demo/simulated AI output.
        """
        prompt_lower = prompt.lower()

        if "structural" in prompt_lower or "crack" in prompt_lower or "deterioration" in prompt_lower:
            return (
                "[DEMO - IBM Granite Simulated Response]\n\n"
                "AI-Assisted Structural Analysis: Based on the visual inspection data provided, "
                "I can identify moderate surface deterioration patterns consistent with long-term "
                "weathering exposure. The detected crack patterns along the eastern facade suggest "
                "progressive stress fracturing, likely exacerbated by thermal cycling and moisture "
                "infiltration. Risk assessment: Moderate-High (Score: 68/100).\n\n"
                "Recommended Action: Schedule physical inspection within 7 days. Apply protective "
                "sealant to identified crack zones. Monitor moisture ingress at identified locations. "
                "Priority: HIGH. Responsible Department: Archaeological Survey of India - Conservation Wing."
            )
        elif "visitor" in prompt_lower or "crowd" in prompt_lower or "density" in prompt_lower:
            return (
                "[DEMO - IBM Granite Simulated Response]\n\n"
                "Visitor Flow Analysis: Current visitor density levels indicate an Orange alert "
                "condition at the northern entrance corridor. Historical patterns show 73% increase "
                "in footfall during 16:00-18:00 window on weekends.\n\n"
                "Cross-Agent Correlation: The Structural Agent has flagged Zone A as moderately "
                "vulnerable. High visitor density overlapping with this zone poses compounded risk. "
                "Recommendation: Redirect incoming visitors to Route B (Southern Corridor). "
                "Estimated wait time reduction: 12 minutes. Implement timed-entry slots for "
                "afternoon peak hours."
            )
        elif "encroachment" in prompt_lower or "construction" in prompt_lower:
            return (
                "[DEMO - IBM Granite Simulated Response]\n\n"
                "Encroachment Pattern Analysis: Comparative image analysis reveals structural "
                "changes in the northern boundary zone with 78% confidence. The detected changes "
                "exhibit characteristics consistent with new construction activity within the "
                "heritage buffer zone.\n\n"
                "Note: This is AI-assisted detection only — NOT a legal determination. "
                "Physical field verification by authorized officials is mandatory before any "
                "enforcement action. Recommend: Immediate site visit by Heritage Protection Officer. "
                "GPS coordinates logged for official record. Notify ASI Regional Office."
            )
        elif "report" in prompt_lower or "conservation" in prompt_lower or "summary" in prompt_lower:
            return (
                "[DEMO - IBM Granite Simulated Response]\n\n"
                "Executive Summary: Based on multi-agent analysis of available data, the monitored "
                "heritage site currently presents a MODERATE conservation risk profile. "
                "Three interconnected concerns require coordinated authority response:\n\n"
                "1. Structural: Surface deterioration detected on eastern facade (Risk: 68/100)\n"
                "2. Visitor: Peak-hour crowding overlaps with vulnerable structural zone\n"
                "3. Boundary: Potential construction activity detected near heritage buffer\n\n"
                "Integrated Recommendation: Coordinate immediate inspection visit combining structural "
                "assessment and boundary verification. Implement temporary visitor flow diversion to "
                "Route B. Escalate to district heritage protection committee within 48 hours.\n\n"
                "Priority: HIGH | Deadline: 7 days | Department: ASI Gujarat Circle"
            )
        elif "story" in prompt_lower or "history" in prompt_lower or "heritage" in prompt_lower:
            return (
                "[DEMO - IBM Granite Simulated Response]\n\n"
                "Heritage Narrative: Standing at the threshold of Modhera Sun Temple, you are "
                "witnessing one of humanity's most sophisticated solar engineering achievements, "
                "built in 1026 CE by Solanki ruler Bhimdev I. Every carved stone tells a story — "
                "the 52 pillars in the Sabha Mandap represent each week of the year, while the "
                "submerged stepped tank (Surya Kund) perfectly mirrors the temple at sunrise during "
                "equinoxes.\n\n"
                "Did You Know? At dawn on the spring and autumn equinoxes, sunlight travels through "
                "the temple's precise alignment to illuminate the central idol directly — a feat of "
                "astronomical precision that predates modern GPS by nearly 1,000 years.\n\n"
                "Note: Verify specific historical dates with ASI official records."
            )
        elif "alert" in prompt_lower or "explain" in prompt_lower or "status" in prompt_lower:
            return (
                "[DEMO - IBM Granite Simulated Response]\n\n"
                "Alert Analysis: Current system shows 3 active alerts requiring attention:\n\n"
                "1. STRUCTURAL (HIGH): Eastern facade deterioration at Modhera Sun Temple\n"
                "2. VISITOR (ORANGE): Crowd density above 75% capacity at Walled City North Gate\n"
                "3. ENCROACHMENT (MODERATE): Potential boundary change near Adalaj region\n\n"
                "Granite Cross-Agent Reasoning: The structural and visitor alerts at Modhera are "
                "geographically correlated — high footfall near a fragile zone creates compounded "
                "risk. Recommend prioritizing visitor flow intervention immediately."
            )
        else:
            return (
                "[DEMO - IBM Granite Simulated Response]\n\n"
                "HeritageGuardian AI is analyzing your request using multi-agent reasoning. "
                "The system has cross-referenced data from Structural, Visitor, Encroachment, "
                "and Conservation agents to provide this integrated response.\n\n"
                "Current Heritage Health Overview: Overall system health score is 72/100. "
                "2 sites require immediate attention. 3 conservation tasks are due within 7 days. "
                "Visitor flow is manageable with minor optimization recommended.\n\n"
                "For specific analysis, please direct queries to individual agents or request "
                "a full conservation report through the Command Center."
            )

    async def analyze_structural(self, context: Dict[str, Any]) -> str:
        prompt = f"""You are an AI heritage conservation expert. Analyze the following structural inspection data for a heritage monument and provide a professional assessment.

Site: {context.get('site_name', 'Heritage Site')}
Detected Issues: {json.dumps(context.get('detected_issues', []))}
Risk Score: {context.get('risk_score', 0)}/100
Sensor Readings: {json.dumps(context.get('sensor_readings', {}))}
Previous Assessment: {context.get('previous_assessment', 'None')}

Provide:
1. Professional structural assessment (clearly labeled as AI-assisted, not certified engineering)
2. Priority action items
3. Recommended inspection timeline
4. Risk mitigation steps

Keep response concise and authority-friendly."""

        return await self.generate(prompt, max_tokens=400)

    async def analyze_visitor_flow(self, context: Dict[str, Any]) -> str:
        prompt = f"""You are an AI crowd management expert for heritage sites. Analyze visitor flow data and recommend management actions.

Site: {context.get('site_name', 'Heritage Site')}
Current Visitors: {context.get('visitor_count', 0)}
Capacity: {context.get('max_capacity', 500)}
Occupancy: {context.get('occupancy_pct', 0)}%
Crowd Level: {context.get('crowd_level', 'Green')}
Zone Data: {json.dumps(context.get('zone_data', {}))}

Provide visitor flow management recommendations including route diversion, timing suggestions, and crowd safety measures."""

        return await self.generate(prompt, max_tokens=350)

    async def analyze_encroachment(self, context: Dict[str, Any]) -> str:
        prompt = f"""You are an AI heritage boundary monitoring expert. Analyze potential encroachment detection data.

Site: {context.get('site_name', 'Heritage Site')}
Detection Type: {context.get('encroachment_type', 'Unknown')}
Confidence: {context.get('confidence', 0)}%
Location: {context.get('location', 'Unknown')}
Changes Detected: {context.get('changes_detected', 'None')}

IMPORTANT: Use language like "potential", "appears to show", "warrants investigation" — NOT legal conclusions.
Provide: Analysis of what is detected, recommended authority notification steps, and field verification requirements."""

        return await self.generate(prompt, max_tokens=350)

    async def generate_story(self, context: Dict[str, Any]) -> str:
        prompt = f"""You are an expert heritage storyteller for Gujarat, India. Create an engaging, personalized heritage story.

Site: {context.get('site_name', 'Heritage Site')}
Language: {context.get('language', 'English')}
Age Group: {context.get('age_group', 'Adult')}
Interests: {', '.join(context.get('interests', ['history', 'architecture']))}
Available Time: {context.get('duration_minutes', 30)} minutes
Experience Preference: {context.get('experience_type', 'Educational')}

Create an engaging story that covers:
1. A compelling opening hook
2. Historical significance tailored to their interests
3. 2-3 fascinating facts
4. A walking route suggestion for their available time
5. "Did you know?" item

IMPORTANT: Do not fabricate specific historical dates or facts. If uncertain, say "According to historical accounts..." or "Historians suggest..."
Make it engaging, NOT academic. Perfect for a {context.get('age_group', 'Adult')} visitor."""

        return await self.generate(prompt, max_tokens=600)

    async def orchestrate(self, context: Dict[str, Any]) -> str:
        prompt = f"""You are the HeritageGuardian AI Orchestrator — an intelligent coordinator that synthesizes multi-agent heritage monitoring data.

Agent Reports:
{json.dumps(context.get('agent_reports', {}), indent=2)}

Site: {context.get('site_name', 'Heritage Site')}
Trigger Event: {context.get('trigger_event', 'Multi-agent analysis')}

Synthesize these reports and provide:
1. Integrated risk assessment
2. Cross-agent correlations (especially overlapping geographic/temporal factors)
3. Prioritized action recommendations
4. Suggested conservation task to create
5. Executive summary (2-3 sentences) for authority briefing

Focus on actionable, coordinated recommendations across departments."""

        return await self.generate(prompt, max_tokens=500)

    async def generate_conservation_report_summary(self, context: Dict[str, Any]) -> str:
        prompt = f"""You are generating an official heritage conservation report summary for authority submission.

Site: {context.get('site_name')}
Date: {context.get('date')}
Structural Health: {context.get('structural_status')}
Risk Score: {context.get('risk_score')}/100
Visitor Status: {context.get('visitor_status')}
Encroachment: {context.get('encroachment_status')}
Active Tasks: {context.get('active_tasks')}

Generate a professional executive summary suitable for government authority review. Include:
- Current conservation status
- Immediate priorities
- Responsible departments
- Recommended timelines

Keep it factual, professional, and action-oriented."""

        return await self.generate(prompt, max_tokens=400)


# Singleton instance
granite_service = GraniteService()
