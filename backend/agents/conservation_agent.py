"""
HeritageGuardian AI - Conservation Reporting Agent
Aggregates data from all agents and generates authority-friendly conservation reports.
Uses IBM Granite for executive summary generation.
"""

import json
import csv
import io
import os
import logging
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional

logger = logging.getLogger(__name__)

REPORTS_DIR = os.getenv("REPORTS_DIR", "./reports")


class ConservationReportingAgent:
    """
    Combines outputs from all agents to produce comprehensive conservation reports.
    Reports are suitable for ASI, state heritage authorities, and municipal bodies.
    """

    def _determine_overall_risk(self, structural_score: float, visitor_pct: float,
                                 encroachment_detected: bool, open_tasks: int) -> Dict[str, Any]:
        score = 0
        if structural_score >= 80:
            score += 40
        elif structural_score >= 60:
            score += 25
        elif structural_score >= 40:
            score += 15
        else:
            score += 5

        if visitor_pct >= 90:
            score += 25
        elif visitor_pct >= 70:
            score += 15
        elif visitor_pct >= 50:
            score += 8

        if encroachment_detected:
            score += 20

        score += min(15, open_tasks * 3)

        if score >= 75:
            level, color = "Critical", "#ef4444"
        elif score >= 55:
            level, color = "High", "#f97316"
        elif score >= 35:
            level, color = "Moderate", "#eab308"
        elif score >= 15:
            level, color = "Low", "#22c55e"
        else:
            level, color = "Healthy", "#16a34a"

        return {"level": level, "score": score, "color": color}

    def _assign_departments(self, issues: List[str]) -> List[Dict[str, str]]:
        dept_map = {
            "structural": {
                "dept": "Archaeological Survey of India — Gujarat Circle",
                "team": "Structural Conservation Wing",
                "contact": "asi-gujarat@nic.in"
            },
            "visitor": {
                "dept": "Gujarat Tourism / Site Management Committee",
                "team": "Visitor Experience & Security Team",
                "contact": "gujarat.tourism@gujarat.gov.in"
            },
            "encroachment": {
                "dept": "ASI Protection Officer / District Collector Heritage Cell",
                "team": "Heritage Protection & Enforcement Unit",
                "contact": "heritage.protection@gujarat.gov.in"
            },
            "conservation": {
                "dept": "State Heritage Conservation Authority",
                "team": "Conservation Planning & Budget Cell",
                "contact": "heritage@gujarat.gov.in"
            }
        }
        assigned = []
        for issue in issues:
            if issue in dept_map:
                assigned.append(dept_map[issue])
        return assigned if assigned else [dept_map["conservation"]]

    def _calculate_deadline(self, risk_level: str) -> str:
        days = {"Critical": 1, "High": 7, "Moderate": 30, "Low": 90, "Healthy": 180}
        d = days.get(risk_level, 30)
        deadline = datetime.utcnow() + timedelta(days=d)
        return deadline.strftime("%Y-%m-%d")

    async def generate_report(
        self,
        site_name: str,
        site_id: int,
        structural_data: Optional[Dict] = None,
        visitor_data: Optional[Dict] = None,
        encroachment_data: Optional[Dict] = None,
        conservation_tasks: Optional[List[Dict]] = None,
        granite_service=None
    ) -> Dict[str, Any]:
        """Generate comprehensive conservation report."""

        logger.info(f"[ConservationAgent] Generating report for {site_name}")

        # Extract key metrics
        structural_score = structural_data.get("risk_score", 0) if structural_data else 0
        structural_level = structural_data.get("risk_level", "Unknown") if structural_data else "No data"
        structural_issues = structural_data.get("detected_issues", []) if structural_data else []

        visitor_pct = visitor_data.get("occupancy_percentage", 0) if visitor_data else 0
        visitor_level = visitor_data.get("crowd_level", "Unknown") if visitor_data else "No data"
        visitor_count = visitor_data.get("current_visitor_count", 0) if visitor_data else 0

        encroachment_detected = encroachment_data.get("encroachment_detected", False) if encroachment_data else False
        encroachment_type = encroachment_data.get("encroachment_type", "None") if encroachment_data else "None"
        encroachment_severity = encroachment_data.get("severity", "N/A") if encroachment_data else "N/A"

        open_tasks = len([t for t in (conservation_tasks or []) if t.get("status") != "Completed"])

        overall_risk = self._determine_overall_risk(
            structural_score, visitor_pct, encroachment_detected, open_tasks
        )

        # Identify active issues and assign departments
        active_issues = []
        if structural_score > 40:
            active_issues.append("structural")
        if visitor_pct > 65:
            active_issues.append("visitor")
        if encroachment_detected:
            active_issues.append("encroachment")
        if open_tasks > 3:
            active_issues.append("conservation")

        departments = self._assign_departments(active_issues)
        deadline = self._calculate_deadline(overall_risk["level"])

        # Recommended actions
        recommended_actions = []
        if structural_score > 60:
            recommended_actions.append({
                "action": f"Physical structural inspection of {len(structural_issues)} identified issue(s)",
                "priority": "High",
                "deadline": self._calculate_deadline("High"),
                "dept": "ASI Conservation Wing"
            })
        if visitor_pct > 70:
            recommended_actions.append({
                "action": "Implement visitor flow management — activate Route B diversion",
                "priority": "Medium",
                "deadline": "Immediate",
                "dept": "Site Management Committee"
            })
        if encroachment_detected:
            recommended_actions.append({
                "action": f"Field verification of potential {encroachment_type} near heritage boundary",
                "priority": "Urgent",
                "deadline": self._calculate_deadline("High"),
                "dept": "Heritage Protection Officer"
            })
        if not recommended_actions:
            recommended_actions.append({
                "action": "Continue routine monitoring and maintenance schedule",
                "priority": "Low",
                "deadline": deadline,
                "dept": "Site Management"
            })

        # Granite executive summary
        executive_summary = ""
        if granite_service:
            executive_summary = await granite_service.generate_conservation_report_summary({
                "site_name": site_name,
                "date": datetime.utcnow().strftime("%Y-%m-%d"),
                "structural_status": f"{structural_level} (Score: {structural_score}/100)",
                "risk_score": structural_score,
                "visitor_status": f"{visitor_level} ({visitor_pct}% occupancy, {visitor_count} visitors)",
                "encroachment_status": f"{'Detected — ' + encroachment_type if encroachment_detected else 'No alerts'}",
                "active_tasks": open_tasks
            })

        if not executive_summary:
            executive_summary = (
                f"{site_name} currently shows {overall_risk['level']} conservation risk "
                f"based on AI-assisted multi-agent analysis. "
                f"Structural health score: {structural_score}/100 ({structural_level}). "
                f"Visitor occupancy: {visitor_pct}% ({visitor_level} crowd level). "
                f"{'Potential encroachment detected near heritage boundary — field verification required. ' if encroachment_detected else ''}"
                f"{open_tasks} conservation task(s) currently open. "
                f"Physical verification and coordinated authority response recommended."
            )

        # Cross-agent correlation alerts
        correlations = []
        if structural_score > 50 and visitor_pct > 65:
            correlations.append({
                "type": "Structural-Visitor Overlap",
                "severity": "High",
                "message": (
                    f"High visitor density ({visitor_pct}% occupancy) overlaps with a "
                    f"structurally vulnerable zone ({structural_level}). "
                    f"Compounded risk: visitor impact may accelerate structural deterioration."
                ),
                "action": "Temporarily redirect visitors from Zone A. Schedule structural inspection."
            })
        if encroachment_detected and structural_score > 40:
            correlations.append({
                "type": "Encroachment-Structural Correlation",
                "severity": "High",
                "message": (
                    f"Potential {encroachment_type} detected adjacent to area showing "
                    f"{structural_level} structural condition. "
                    f"Geographic correlation suggests possible construction vibration impact."
                ),
                "action": "Field verification of both concerns in single coordinated visit. Notify ASI and Protection Officer."
            })

        report = {
            "agent": "Conservation Reporting Agent",
            "report_id": f"HG-{site_id}-{datetime.utcnow().strftime('%Y%m%d%H%M')}",
            "site_name": site_name,
            "site_id": site_id,
            "report_date": datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC"),
            "generated_by": "HeritageGuardian AI — Multi-Agent Conservation System",
            "overall_risk": overall_risk,
            "executive_summary": executive_summary,
            "structural_health": {
                "status": structural_level,
                "score": structural_score,
                "issues_count": len(structural_issues),
                "issues": structural_issues[:5],
                "priority": structural_data.get("priority", "N/A") if structural_data else "N/A",
                "recommendations": structural_data.get("recommendations", "") if structural_data else ""
            },
            "visitor_conditions": {
                "current_count": visitor_count,
                "occupancy_pct": visitor_pct,
                "crowd_level": visitor_level,
                "is_simulated": visitor_data.get("is_simulated", True) if visitor_data else True,
                "peak_hours": visitor_data.get("peak_hours", "N/A") if visitor_data else "N/A"
            },
            "encroachment_alerts": {
                "detected": encroachment_detected,
                "type": encroachment_type,
                "severity": encroachment_severity,
                "confidence": encroachment_data.get("confidence", 0) if encroachment_data else 0,
                "disclaimer": "Field verification required — not a legal determination"
            },
            "conservation_tasks": {
                "total": len(conservation_tasks or []),
                "open": open_tasks,
                "tasks": (conservation_tasks or [])[:10]
            },
            "cross_agent_correlations": correlations,
            "recommended_actions": recommended_actions,
            "responsible_departments": departments,
            "deadline": deadline,
            "disclaimer": (
                "This report is generated by AI-assisted multi-agent analysis. "
                "Structural observations are NOT certified engineering assessments. "
                "Encroachment detections are observations requiring official field verification. "
                "Visitor data is simulated for demonstration purposes. "
                "All recommendations should be reviewed by qualified professionals before action."
            )
        }

        return report

    def export_json(self, report: Dict[str, Any]) -> str:
        return json.dumps(report, indent=2, default=str)

    def export_csv(self, report: Dict[str, Any]) -> str:
        output = io.StringIO()
        writer = csv.writer(output)

        writer.writerow(["HeritageGuardian AI — Conservation Report"])
        writer.writerow(["Report ID", report.get("report_id", "")])
        writer.writerow(["Site", report.get("site_name", "")])
        writer.writerow(["Date", report.get("report_date", "")])
        writer.writerow(["Overall Risk Level", report["overall_risk"]["level"]])
        writer.writerow(["Overall Risk Score", report["overall_risk"]["score"]])
        writer.writerow([])

        writer.writerow(["STRUCTURAL HEALTH"])
        s = report["structural_health"]
        writer.writerow(["Status", s["status"]])
        writer.writerow(["Score", s["score"]])
        writer.writerow(["Issues Count", s["issues_count"]])
        writer.writerow(["Priority", s["priority"]])
        writer.writerow([])

        writer.writerow(["VISITOR CONDITIONS"])
        v = report["visitor_conditions"]
        writer.writerow(["Current Visitors", v["current_count"]])
        writer.writerow(["Occupancy %", v["occupancy_pct"]])
        writer.writerow(["Crowd Level", v["crowd_level"]])
        writer.writerow(["Data Type", "SIMULATED" if v["is_simulated"] else "Live"])
        writer.writerow([])

        writer.writerow(["ENCROACHMENT ALERTS"])
        e = report["encroachment_alerts"]
        writer.writerow(["Detected", e["detected"]])
        writer.writerow(["Type", e["type"]])
        writer.writerow(["Severity", e["severity"]])
        writer.writerow([])

        writer.writerow(["RECOMMENDED ACTIONS"])
        writer.writerow(["Action", "Priority", "Deadline", "Department"])
        for action in report["recommended_actions"]:
            writer.writerow([action["action"], action["priority"], action["deadline"], action["dept"]])
        writer.writerow([])

        writer.writerow(["EXECUTIVE SUMMARY"])
        writer.writerow([report["executive_summary"]])
        writer.writerow([])
        writer.writerow(["DISCLAIMER"])
        writer.writerow([report["disclaimer"]])

        return output.getvalue()


conservation_agent = ConservationReportingAgent()
