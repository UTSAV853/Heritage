"""
HeritageGuardian AI - Deduplication & Multi-Source Conflict Detection Engine
Matches observations across sources by site, timeframe, and metric.
Consolidates corroborating reports while preserving all original sources.
Flags conflicting evidence for human review without prematurely selecting a winner.
"""

from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from ...models.database import Observation


class DeduplicationEngine:
    """
    Engine for matching, merging, and detecting conflicts between multiple reports.
    """

    # Time window threshold for considering observations to be regarding the same event
    TIME_WINDOW_MINUTES = 60
    # Numerical variance threshold beyond which reports are considered conflicting (25%)
    CONFLICT_VARIANCE_THRESHOLD = 0.25

    @classmethod
    def process_observation(
        cls,
        db: Session,
        new_obs_data: Dict[str, Any],
        source_name: str
    ) -> Dict[str, Any]:
        """
        Check for existing observations matching site, type, metric within the time window.
        Returns:
            {
                "action": "INSERT_NEW" | "CONSOLIDATE_MATCH" | "FLAG_CONFLICT",
                "observation_id": int,
                "is_consolidated": bool,
                "contributing_sources": List[str],
                "has_conflicts": bool,
                "conflict_details": Optional[str]
            }
        """
        site_id = new_obs_data["site_id"]
        obs_type = new_obs_data["observation_type"]
        metric_name = new_obs_data["metric_name"]
        metric_value = new_obs_data["metric_value"]
        obs_date = new_obs_data.get("observation_date") or datetime.utcnow()

        window_start = obs_date - timedelta(minutes=cls.TIME_WINDOW_MINUTES)
        window_end = obs_date + timedelta(minutes=cls.TIME_WINDOW_MINUTES)

        # Query existing observations within the time window
        existing_matches = db.query(Observation).filter(
            Observation.site_id == site_id,
            Observation.observation_type == obs_type,
            Observation.metric_name == metric_name,
            Observation.observation_date >= window_start,
            Observation.observation_date <= window_end
        ).all()

        if not existing_matches:
            # No existing duplicate found — insert fresh record
            return {
                "action": "INSERT_NEW",
                "matched_observation": None,
                "contributing_sources": [source_name],
                "has_conflicts": False,
                "conflict_details": None,
                "requires_human_review": False
            }

        # Found candidate match
        candidate = existing_matches[0]
        existing_val = candidate.metric_value
        existing_sources = candidate.contributing_sources or []

        # Check if source already reported this
        if source_name in existing_sources:
            return {
                "action": "DUPLICATE_IGNORED",
                "matched_observation": candidate,
                "contributing_sources": existing_sources,
                "has_conflicts": candidate.has_conflicts,
                "conflict_details": candidate.conflict_details,
                "requires_human_review": candidate.requires_human_review
            }

        # Calculate variance between reported values
        diff = abs(existing_val - metric_value)
        baseline = max(abs(existing_val), abs(metric_value), 1.0)
        variance = diff / baseline

        updated_sources = list(set(existing_sources + [source_name]))

        if variance > cls.CONFLICT_VARIANCE_THRESHOLD:
            # Significant disagreement detected!
            conflict_msg = (
                f"Source conflict detected: Existing reported {metric_name}={existing_val} "
                f"({', '.join(existing_sources)}), but new source '{source_name}' reported {metric_value} "
                f"({round(variance * 100, 1)}% variance). Human review required."
            )
            candidate.has_conflicts = True
            candidate.conflict_details = conflict_msg
            candidate.requires_human_review = True
            candidate.contributing_sources = updated_sources
            candidate.is_consolidated = True
            candidate.consolidated_count += 1
            db.commit()

            return {
                "action": "FLAG_CONFLICT",
                "matched_observation": candidate,
                "contributing_sources": updated_sources,
                "has_conflicts": True,
                "conflict_details": conflict_msg,
                "requires_human_review": True
            }
        else:
            # Corroborating report: sources agree within tolerance!
            candidate.is_consolidated = True
            candidate.consolidated_count += 1
            candidate.contributing_sources = updated_sources
            # Average the metric slightly or keep the higher-confidence one
            candidate.metric_value = round((existing_val + metric_value) / 2.0, 2)
            db.commit()

            return {
                "action": "CONSOLIDATE_MATCH",
                "matched_observation": candidate,
                "contributing_sources": updated_sources,
                "has_conflicts": candidate.has_conflicts,
                "conflict_details": candidate.conflict_details,
                "requires_human_review": candidate.requires_human_review
            }
