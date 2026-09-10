"""
HeritageGuardian AI - Observation Quality & Validation Engine
Validates required fields, numerical ranges, date consistency, and provenance.
Assigns status: VALIDATED, REJECTED, or FAILED. Never silently discards data.
"""

from typing import Dict, Any, Tuple
from datetime import datetime, timedelta

ALLOWED_ORIGINS = {"EXTERNAL_SOURCE", "MANUAL_ENTRY", "IMPORTED_DATA", "SIMULATED"}
ALLOWED_TYPES = {
    "VISITOR_FLOW",
    "STRUCTURAL_INTEGRITY",
    "ENVIRONMENTAL_CONDITION",
    "ENCROACHMENT",
    "CONSERVATION_INCIDENT"
}
ALLOWED_SEVERITIES = {"Low", "Moderate", "High", "Critical"}

# Numeric metric validation rules: (min_value, max_value, required_unit)
METRIC_BOUNDS = {
    "visitor_count": (0.0, 50000.0),
    "crack_width_mm": (0.0, 150.0),
    "vibration_velocity": (0.0, 100.0),
    "temperature_c": (-50.0, 70.0),
    "relative_humidity_pct": (0.0, 100.0),
    "wind_speed_kmh": (0.0, 300.0),
    "surface_pressure_hpa": (500.0, 1100.0),
    "boundary_distance_m": (0.0, 10000.0),
    "unauthorized_alteration": (0.0, 10.0),
    "documentation_completeness_words": (0.0, 1000000.0),
    "unesco_protection_compliance_score": (0.0, 100.0)
}


class ObservationValidator:
    """
    Validates normalized observation records against domain constraints.
    """

    @staticmethod
    def validate(record: Dict[str, Any]) -> Tuple[bool, str, Dict[str, Any]]:
        """
        Validate observation.
        Returns: (is_valid: bool, status: str, cleaned_record_or_error_dict)
        """
        errors = []

        # 1. Required fields
        site_id = record.get("site_id")
        if site_id is None or not isinstance(site_id, (int, str)):
            errors.append("Missing or invalid 'site_id'.")

        obs_type = record.get("observation_type")
        if not obs_type or obs_type not in ALLOWED_TYPES:
            errors.append(f"Invalid 'observation_type': '{obs_type}'. Must be one of {ALLOWED_TYPES}.")

        metric_name = record.get("metric_name")
        if not metric_name or not isinstance(metric_name, str):
            errors.append("Missing or invalid 'metric_name'.")

        # 2. Metric value validation
        metric_value = record.get("metric_value")
        if metric_value is None:
            errors.append("Missing 'metric_value'.")
        else:
            try:
                val_float = float(metric_value)
                record["metric_value"] = val_float
                if metric_name in METRIC_BOUNDS:
                    min_v, max_v = METRIC_BOUNDS[metric_name]
                    if not (min_v <= val_float <= max_v):
                        errors.append(f"Metric '{metric_name}' value {val_float} out of permissible range [{min_v}, {max_v}].")
            except (ValueError, TypeError):
                errors.append(f"Metric value '{metric_value}' cannot be coerced to float.")

        # 3. Data origin
        origin = record.get("data_origin", "EXTERNAL_SOURCE")
        if origin not in ALLOWED_ORIGINS:
            errors.append(f"Invalid 'data_origin': '{origin}'. Must be one of {ALLOWED_ORIGINS}.")
        record["data_origin"] = origin

        # 4. Severity
        severity = record.get("severity", "Low")
        if severity not in ALLOWED_SEVERITIES:
            record["severity"] = "Low"

        # 5. Observation Date validation
        obs_date = record.get("observation_date")
        now = datetime.utcnow()
        if obs_date:
            if isinstance(obs_date, str):
                try:
                    obs_date = datetime.fromisoformat(obs_date.replace("Z", "+00:00")).replace(tzinfo=None)
                    record["observation_date"] = obs_date
                except Exception:
                    errors.append(f"Malformed 'observation_date': '{obs_date}'.")
            elif isinstance(obs_date, datetime):
                if obs_date > now + timedelta(days=1):
                    errors.append(f"Future observation date rejected: {obs_date}.")
                elif obs_date < datetime(1900, 1, 1):
                    errors.append(f"Stale/historic observation date prior to 1900 rejected: {obs_date}.")
        else:
            record["observation_date"] = now

        # 6. Confidence score
        conf = record.get("confidence_score", 1.0)
        try:
            record["confidence_score"] = max(0.0, min(1.0, float(conf)))
        except Exception:
            record["confidence_score"] = 0.5

        if errors:
            rejection_reason = "; ".join(errors)
            record["status"] = "REJECTED"
            record["rejection_reason"] = rejection_reason
            return False, "REJECTED", record

        record["status"] = "VALIDATED"
        return True, "VALIDATED", record
