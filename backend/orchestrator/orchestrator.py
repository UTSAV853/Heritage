"""
HeritageGuardian AI - Agent Orchestrator
Central coordinator that routes requests, manages agent collaboration,
and uses IBM Granite for integrated multi-agent reasoning.
"""

import asyncio
import logging
from datetime import datetime
from typing import Dict, Any, List, Optional

from ..agents.structural_agent import structural_agent
from ..agents.visitor_agent import visitor_agent
from ..agents.encroachment_agent import encroachment_agent
from ..agents.storytelling_agent import storytelling_agent
from ..agents.conservation_agent import conservation_agent
from ..services.granite_service import granite_service

logger = logging.getLogger(__name__)


# In-memory activity log (ring buffer, last 100 entries)
_activity_log: List[Dict] = []
MAX_LOG_ENTRIES = 100


def _log_activity(agent_name: str, event_type: str, message: str,
                   is_granite: bool = False, site_id: Optional[int] = None):
    """Append an agent activity event to the in-memory log."""
    entry = {
        "timestamp": datetime.utcnow().strftime("%H:%M:%S"),
        "iso_timestamp": datetime.utcnow().isoformat(),
        "agent": agent_name,
        "event_type": event_type,
        "message": message,
        "is_granite_output": is_granite,
        "site_id": site_id
    }
    _activity_log.append(entry)
    if len(_activity_log) > MAX_LOG_ENTRIES:
        _activity_log.pop(0)
    logger.info(f"[{agent_name}] {message}")
    return entry


def get_activity_log(limit: int = 50) -> List[Dict]:
    return list(reversed(_activity_log[-limit:]))


class AgentOrchestrator:
    """
    Central orchestrator for HeritageGuardian AI agents.
    Routes requests, coordinates multi-agent workflows, applies Granite reasoning.
    """

    async def run_structural_analysis(
        self,
        site_name: str,
        image_path: Optional[str] = None,
        previous_image_path: Optional[str] = None,
        sensor_readings: Optional[Dict] = None,
        site_id: Optional[int] = None
    ) -> Dict[str, Any]:
        """Run structural health analysis workflow."""
        _log_activity("Structural Agent", "START", f"Initiating image analysis for {site_name}", site_id=site_id)

        result = await structural_agent.analyze_image(
            site_name=site_name,
            image_path=image_path,
            previous_image_path=previous_image_path,
            sensor_readings=sensor_readings,
            granite_service=granite_service
        )

        _log_activity("Structural Agent", "ANALYSIS", f"CV analysis complete — {len(result.get('detected_issues', []))} issue(s) detected", site_id=site_id)
        _log_activity("Structural Agent", "SCORE", f"Risk score calculated: {result['risk_score']}/100 — {result['risk_level']}", site_id=site_id)

        if result["risk_score"] >= 60:
            _log_activity("Orchestrator", "ESCALATE", f"High risk score detected — notifying Conservation Agent", site_id=site_id)
            _log_activity("Conservation Agent", "NOTIFIED", f"Received structural alert for {site_name} (Score: {result['risk_score']})", site_id=site_id)

        if result.get("granite_reasoning"):
            _log_activity("Granite LLM", "REASONING", "IBM Granite generated structural assessment and recommendations", is_granite=True, site_id=site_id)

        return result

    async def run_visitor_analysis(
        self,
        site_name: str,
        max_capacity: int = 500,
        site_id: Optional[int] = None
    ) -> Dict[str, Any]:
        """Run visitor flow analysis workflow."""
        _log_activity("Visitor Agent", "START", f"Analyzing visitor flow for {site_name}", site_id=site_id)

        result = await visitor_agent.analyze_with_granite(
            site_name=site_name,
            max_capacity=max_capacity,
            granite_service=granite_service
        )

        crowd = result.get("crowd_level", "Green")
        pct = result.get("occupancy_percentage", 0)
        _log_activity("Visitor Agent", "STATUS", f"Crowd level: {crowd} — {pct}% occupancy ({result.get('current_visitor_count', 0)} visitors)", site_id=site_id)

        if crowd in ["Orange", "Red"]:
            _log_activity("Orchestrator", "ALERT", f"High visitor density alert triggered for {site_name}", site_id=site_id)

        if result.get("granite_reasoning"):
            _log_activity("Granite LLM", "REASONING", "IBM Granite generated visitor flow recommendations", is_granite=True, site_id=site_id)

        return result

    async def run_encroachment_analysis(
        self,
        site_name: str,
        image_path: Optional[str] = None,
        historical_image_path: Optional[str] = None,
        site_id: Optional[int] = None
    ) -> Dict[str, Any]:
        """Run encroachment detection workflow."""
        _log_activity("Encroachment Agent", "START", f"Initiating boundary analysis for {site_name}", site_id=site_id)

        result = await encroachment_agent.analyze_encroachment(
            site_name=site_name,
            image_path=image_path,
            historical_image_path=historical_image_path,
            granite_service=granite_service
        )

        if result.get("encroachment_detected"):
            _log_activity("Encroachment Agent", "DETECTION",
                          f"Potential {result.get('encroachment_type')} detected — confidence {int(result.get('confidence', 0)*100)}%",
                          site_id=site_id)
            _log_activity("Orchestrator", "ESCALATE",
                          f"Encroachment alert forwarded to Conservation Agent and authorities",
                          site_id=site_id)
        else:
            _log_activity("Encroachment Agent", "CLEAR", f"No encroachment detected in boundary zone of {site_name}", site_id=site_id)

        if result.get("granite_reasoning"):
            _log_activity("Granite LLM", "REASONING", "IBM Granite analyzed encroachment context and authority response", is_granite=True, site_id=site_id)

        return result

    async def run_storytelling(
        self,
        site_name: str,
        age_group: str = "Adult (30-60)",
        language: str = "English",
        interests: Optional[List[str]] = None,
        duration_minutes: int = 60,
        experience_type: str = "Educational",
        site_id: Optional[int] = None
    ) -> Dict[str, Any]:
        """Run personalized storytelling workflow."""
        _log_activity("Storytelling Agent", "START",
                      f"Generating {language} story for {age_group} visitor interested in {interests}",
                      site_id=site_id)

        result = await storytelling_agent.generate_story(
            site_name=site_name,
            age_group=age_group,
            language=language,
            interests=interests,
            duration_minutes=duration_minutes,
            experience_type=experience_type,
            granite_service=granite_service
        )

        _log_activity("Storytelling Agent", "COMPLETE",
                      f"Personalized heritage narrative generated for {site_name}",
                      site_id=site_id)
        _log_activity("Granite LLM", "STORY", "IBM Granite crafted culturally-aware heritage narrative", is_granite=True, site_id=site_id)

        return result

    async def run_conservation_report(
        self,
        site_name: str,
        site_id: int,
        include_structural: bool = True,
        include_visitor: bool = True,
        include_encroachment: bool = True,
        max_capacity: int = 500,
        conservation_tasks: Optional[List[Dict]] = None
    ) -> Dict[str, Any]:
        """
        Run full multi-agent conservation report workflow.
        Coordinates all agents and synthesizes with Granite.
        """
        _log_activity("Orchestrator", "START", f"Initiating multi-agent conservation report for {site_name}", site_id=site_id)

        # Run agents in parallel where possible
        tasks = {}

        if include_structural:
            _log_activity("Structural Agent", "START", f"Structural analysis initiated for report", site_id=site_id)
            tasks["structural"] = structural_agent.analyze_image(
                site_name=site_name, granite_service=granite_service
            )
        if include_visitor:
            _log_activity("Visitor Agent", "START", f"Visitor flow analysis initiated for report", site_id=site_id)
            tasks["visitor"] = visitor_agent.analyze_with_granite(
                site_name=site_name, max_capacity=max_capacity, granite_service=granite_service
            )
        if include_encroachment:
            _log_activity("Encroachment Agent", "START", f"Encroachment scan initiated for report", site_id=site_id)
            tasks["encroachment"] = encroachment_agent.analyze_encroachment(
                site_name=site_name, granite_service=granite_service
            )

        # Execute in parallel
        results = {}
        if tasks:
            completed = await asyncio.gather(*tasks.values(), return_exceptions=True)
            for key, result in zip(tasks.keys(), completed):
                if isinstance(result, Exception):
                    logger.error(f"Agent {key} failed: {result}")
                    results[key] = None
                else:
                    results[key] = result

        _log_activity("Orchestrator", "AGGREGATE", "All agent reports collected — initiating Granite synthesis", site_id=site_id)

        # Cross-agent correlation check
        structural = results.get("structural", {}) or {}
        visitor = results.get("visitor", {}) or {}
        encroachment = results.get("encroachment", {}) or {}

        struct_score = structural.get("risk_score", 0)
        visitor_pct = visitor.get("occupancy_percentage", 0)
        enc_detected = encroachment.get("encroachment_detected", False)

        if struct_score > 50 and visitor_pct > 65:
            _log_activity("Orchestrator", "CORRELATION",
                          f"CROSS-AGENT ALERT: High visitor density overlaps with structurally vulnerable zone",
                          site_id=site_id)
        if enc_detected and struct_score > 40:
            _log_activity("Orchestrator", "CORRELATION",
                          f"CROSS-AGENT ALERT: Potential encroachment correlates with structural deterioration",
                          site_id=site_id)

        # Generate consolidated report
        _log_activity("Conservation Agent", "GENERATING", "Compiling multi-agent conservation report", site_id=site_id)

        report = await conservation_agent.generate_report(
            site_name=site_name,
            site_id=site_id,
            structural_data=results.get("structural"),
            visitor_data=results.get("visitor"),
            encroachment_data=results.get("encroachment"),
            conservation_tasks=conservation_tasks,
            granite_service=granite_service
        )

        _log_activity("Granite LLM", "SUMMARY",
                      f"IBM Granite generated executive summary — Overall Risk: {report['overall_risk']['level']}",
                      is_granite=True, site_id=site_id)
        _log_activity("Conservation Agent", "COMPLETE",
                      f"Conservation report {report['report_id']} ready for authority review",
                      site_id=site_id)

        # Attach agent sub-results
        report["agent_sub_results"] = {
            "structural": results.get("structural"),
            "visitor": results.get("visitor"),
            "encroachment": results.get("encroachment"),
        }

        return report

    async def run_cross_agent_scenario_a(self, site_name: str, site_id: int) -> Dict[str, Any]:
        """
        Demo Scenario A: Visitor density + structural vulnerability correlation.
        Visitor Agent reports high density → Structural Agent flags vulnerable zone → Granite coordinates.
        """
        _log_activity("Orchestrator", "DEMO_SCENARIO",
                      "▶ DEMO SCENARIO A: Visitor-Structural Cross-Agent Workflow initiated",
                      site_id=site_id)

        # Step 1: Visitor alert
        _log_activity("Visitor Agent", "ALERT",
                      "High visitor density detected — Orange alert at Zone A",
                      site_id=site_id)

        # Step 2: Structural check
        _log_activity("Structural Agent", "CHECK",
                      "Structural Agent queried for Zone A vulnerability status",
                      site_id=site_id)
        _log_activity("Structural Agent", "RESULT",
                      "Fragile area confirmed — Moderate risk at eastern facade near Zone A",
                      site_id=site_id)

        # Step 3: Orchestrator correlation
        _log_activity("Orchestrator", "REASONING",
                      "High visitor density OVERLAPS with moderately vulnerable heritage area",
                      site_id=site_id)

        # Step 4: Granite synthesis
        _log_activity("Granite LLM", "SYNTHESIS",
                      "IBM Granite: 'Combined risk exceeds acceptable threshold. Immediate visitor diversion recommended.'",
                      is_granite=True, site_id=site_id)

        # Step 5: Action
        _log_activity("Orchestrator", "ACTION",
                      "System Recommendation: Redirect visitors from Zone A → Route B. Schedule structural inspection within 7 days.",
                      site_id=site_id)

        granite_output = await granite_service.orchestrate({
            "site_name": site_name,
            "trigger_event": "High visitor density overlapping vulnerable structural zone",
            "agent_reports": {
                "visitor_agent": "Orange crowd level — 78% occupancy at Zone A",
                "structural_agent": "Moderate structural risk at eastern facade — Score: 62/100"
            }
        })

        if granite_output:
            _log_activity("Granite LLM", "RECOMMENDATION",
                          "Granite integrated recommendation issued to Conservation Agent",
                          is_granite=True, site_id=site_id)

        return {
            "scenario": "A",
            "title": "Visitor-Structural Cross-Agent Correlation",
            "workflow": [
                {"step": 1, "agent": "Visitor Agent", "status": "ALERT", "message": "High visitor density — 78% occupancy at Zone A"},
                {"step": 2, "agent": "Structural Agent", "status": "FLAGGED", "message": "Moderate structural risk at eastern facade (Score: 62/100)"},
                {"step": 3, "agent": "Orchestrator", "status": "CORRELATED", "message": "Geographic overlap detected between high density zone and vulnerable structure"},
                {"step": 4, "agent": "Granite LLM", "status": "REASONING", "message": "Combined risk exceeds threshold — coordinated action required"},
                {"step": 5, "agent": "Conservation Agent", "status": "TASK_CREATED", "message": "High-priority conservation task created with visitor diversion protocol"},
            ],
            "recommendation": "Temporarily redirect visitors from Zone A to Route B. Schedule structural inspection within 7 days. Deploy additional staff to enforce diversion.",
            "granite_output": granite_output,
            "priority": "High"
        }

    async def run_cross_agent_scenario_b(self, site_name: str, site_id: int) -> Dict[str, Any]:
        """
        Demo Scenario B: Encroachment + structural deterioration correlation.
        Encroachment Agent detects construction → Structural Agent shows deterioration → Granite synthesizes.
        """
        _log_activity("Orchestrator", "DEMO_SCENARIO",
                      "▶ DEMO SCENARIO B: Encroachment-Structural Cross-Agent Workflow initiated",
                      site_id=site_id)

        _log_activity("Encroachment Agent", "DETECTION",
                      "Potential construction activity detected near northern heritage boundary",
                      site_id=site_id)
        _log_activity("Structural Agent", "CHECK",
                      "Adjacent heritage structure analyzed — increased visual deterioration noted",
                      site_id=site_id)
        _log_activity("Orchestrator", "CORRELATION",
                      "Encroachment and structural deterioration are geographically associated",
                      site_id=site_id)
        _log_activity("Conservation Agent", "TASK",
                      "High-priority field verification task created and assigned to Protection Officer",
                      site_id=site_id)

        granite_output = await granite_service.orchestrate({
            "site_name": site_name,
            "trigger_event": "Encroachment detection correlated with adjacent structural deterioration",
            "agent_reports": {
                "encroachment_agent": "Potential construction change — 76% confidence near northern boundary",
                "structural_agent": "High risk score 72/100 at adjacent structure — increased from previous 55/100"
            }
        })

        _log_activity("Granite LLM", "SYNTHESIS",
                      "IBM Granite: 'Encroachment and structural deterioration are geographically correlated. Recommend joint field verification.'",
                      is_granite=True, site_id=site_id)

        return {
            "scenario": "B",
            "title": "Encroachment-Structural Cross-Agent Correlation",
            "workflow": [
                {"step": 1, "agent": "Encroachment Agent", "status": "DETECTED", "message": "Potential construction activity near northern heritage boundary (76% confidence)"},
                {"step": 2, "agent": "Structural Agent", "status": "FLAGGED", "message": "Adjacent structure shows High risk — Score 72/100, increased from 55/100"},
                {"step": 3, "agent": "Orchestrator", "status": "CORRELATED", "message": "Geographic association between encroachment and structural deterioration confirmed"},
                {"step": 4, "agent": "Granite LLM", "status": "REASONING", "message": "Construction vibration may be contributing to structural deterioration"},
                {"step": 5, "agent": "Conservation Agent", "status": "TASK_CREATED", "message": "Emergency inspection task created — Heritage Protection Officer notified"},
            ],
            "recommendation": "Dispatch joint field verification team (ASI Conservation + Protection Officer). Collect GPS-tagged evidence. Consider construction stop order pending verification.",
            "granite_output": granite_output,
            "priority": "Urgent"
        }

    async def handle_chat_query(self, query: str, site_context: Optional[str] = None) -> str:
        """Handle natural language queries from the AI chat assistant."""
        query_lower = query.lower()

        # Route to appropriate context
        if any(kw in query_lower for kw in ["conservation report", "full report", "generate report"]):
            _log_activity("Orchestrator", "CHAT", f"Chat query routed to Conservation Agent: {query[:60]}")
            site = site_context or "Modhera Sun Temple"
            report = await self.run_conservation_report(site_name=site, site_id=1)
            summary = report.get("executive_summary", "")
            risk = report["overall_risk"]["level"]
            return f"**Conservation Report Generated for {site}**\n\nOverall Risk: **{risk}**\n\n{summary}"

        elif any(kw in query_lower for kw in ["visitor", "crowd", "congestion", "footfall"]):
            _log_activity("Orchestrator", "CHAT", f"Chat query routed to Visitor Agent: {query[:60]}")
            site = site_context or "Modhera Sun Temple"
            data = visitor_agent.get_current_visitor_data(site)
            return (
                f"**Visitor Status — {site}**\n\n"
                f"Current visitors: **{data['current_visitor_count']}** / {data['max_capacity']} (max)\n"
                f"Occupancy: **{data['occupancy_percentage']}%** — {data['crowd_label']} ({data['crowd_level']})\n"
                f"Wait time: ~{data['estimated_wait_time_minutes']} minutes\n\n"
                f"Recommendations:\n" + "\n".join(f"• {r}" for r in data["recommendations"][:2]) +
                f"\n\n⚠️ Data is simulated for demonstration."
            )

        elif any(kw in query_lower for kw in ["encroachment", "construction", "boundary"]):
            _log_activity("Orchestrator", "CHAT", f"Chat query routed to Encroachment Agent: {query[:60]}")
            return await granite_service.generate(
                f"Answer this heritage monitoring question about encroachment at a Gujarat heritage site: {query}",
                max_tokens=300
            )

        elif any(kw in query_lower for kw in ["history", "story", "tell me", "route", "heritage guide", "30 minute", "walk"]):
            _log_activity("Orchestrator", "CHAT", f"Chat query routed to Storytelling Agent: {query[:60]}")
            site = site_context or "Ahmedabad Walled City"
            duration = 30 if "30" in query_lower else 60
            story = await storytelling_agent.generate_story(
                site_name=site,
                duration_minutes=duration,
                granite_service=granite_service
            )
            return (
                f"**Heritage Story — {story['site_name']}**\n\n"
                f"{story['short_story']}\n\n"
                f"**Suggested Route ({duration} min):** {story['walking_route']}\n\n"
                f"**Did You Know?** {story['did_you_know'][0] if story['did_you_know'] else ''}"
            )

        elif any(kw in query_lower for kw in ["structural", "condition", "risk", "deterioration", "damage"]):
            _log_activity("Orchestrator", "CHAT", f"Chat query routed to Structural Agent: {query[:60]}")
            site = site_context or "Modhera Sun Temple"
            result = await structural_agent.analyze_image(site_name=site, granite_service=granite_service)
            return (
                f"**Structural Health — {site}**\n\n"
                f"Risk Score: **{result['risk_score']}/100** — {result['risk_level']}\n"
                f"Issues: {len(result['detected_issues'])} detected\n"
                f"Priority: {result['priority']}\n\n"
                f"**Recommendations:** {result['recommendations']}\n\n"
                f"⚠️ AI-assisted observation only — not a certified engineering assessment."
            )

        elif any(kw in query_lower for kw in ["alert", "attention", "immediate", "urgent"]):
            _log_activity("Orchestrator", "CHAT", f"Chat query: Alert summary requested")
            return await granite_service.generate(
                f"Provide a brief summary of active alerts and priority items for heritage monitoring. Context: {query}",
                max_tokens=350
            )

        else:
            _log_activity("Orchestrator", "CHAT", f"Chat query handled by Granite: {query[:60]}")
            return await granite_service.generate(
                f"You are HeritageGuardian AI, an expert heritage conservation assistant for Gujarat, India. "
                f"Answer this question helpfully: {query}",
                max_tokens=400
            )


orchestrator = AgentOrchestrator()
