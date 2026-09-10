"""
HeritageGuardian AI - Open-Meteo Environmental Telemetry Adapter
Legitimate public API integration providing real-time meteorological & climate telemetry
at the exact coordinates of heritage monuments worldwide.
"""

import httpx
import time
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime

from .base import BaseAdapter

logger = logging.getLogger(__name__)


class OpenMeteoEnvironmentalAdapter(BaseAdapter):
    """
    Adapter for Open-Meteo Open Environmental Data API.
    Provides real-time ambient temperature, humidity, wind velocity, and barometric pressure.
    """

    BASE_URL = "https://api.open-meteo.com/v1/forecast"

    @property
    def source_name(self) -> str:
        return "Open-Meteo Heritage Climate Telemetry"

    @property
    def domain(self) -> str:
        return "api.open-meteo.com"

    @property
    def authority_tier(self) -> str:
        return "TIER_2"

    @property
    def default_reliability(self) -> float:
        return 0.94

    async def health_check(self) -> Dict[str, Any]:
        """Verify API reachability with a lightweight probe."""
        start = time.time()
        try:
            async with httpx.AsyncClient(timeout=4.0) as client:
                resp = await client.get(
                    self.BASE_URL,
                    params={
                        "latitude": 23.5846,
                        "longitude": 72.1294,
                        "current": "temperature_2m",
                    }
                )
                latency = round((time.time() - start) * 1000, 1)
                if resp.status_code == 200:
                    return {
                        "status": "HEALTHY",
                        "latency_ms": latency,
                        "message": "Open-Meteo environmental telemetry API responsive."
                    }
                else:
                    return {
                        "status": "DEGRADED",
                        "latency_ms": latency,
                        "message": f"Unexpected HTTP status {resp.status_code}"
                    }
        except Exception as e:
            return {
                "status": "UNAVAILABLE",
                "latency_ms": round((time.time() - start) * 1000, 1),
                "message": f"Connection error: {str(e)}"
            }

    async def fetch(self, site: Any) -> Dict[str, Any]:
        """Fetch current environmental conditions for a heritage site."""
        lat = getattr(site, "latitude", None) or 23.5846
        lon = getattr(site, "longitude", None) or 72.1294
        site_name = getattr(site, "name", "Heritage Site")

        params = {
            "latitude": lat,
            "longitude": lon,
            "current": "temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,precipitation",
            "timezone": "auto"
        }

        start_time = datetime.utcnow()
        async with httpx.AsyncClient(timeout=6.0) as client:
            resp = await client.get(self.BASE_URL, params=params)
            resp.raise_for_status()
            data = resp.json()

        return {
            "source_name": self.source_name,
            "source_domain": self.domain,
            "authority_tier": self.authority_tier,
            "site_id": getattr(site, "id", None),
            "site_name": site_name,
            "latitude": lat,
            "longitude": lon,
            "retrieval_timestamp": start_time.isoformat(),
            "source_url": str(resp.request.url),
            "raw_payload": data
        }

    def parse(self, raw_payload: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Parse raw Open-Meteo telemetry into structured observation items."""
        raw = raw_payload.get("raw_payload", {})
        current = raw.get("current", {})
        site_id = raw_payload.get("site_id")
        site_name = raw_payload.get("site_name", "")
        retrieval_ts = raw_payload.get("retrieval_timestamp")
        obs_date = datetime.fromisoformat(retrieval_ts) if retrieval_ts else datetime.utcnow()

        observations = []

        # 1. Temperature observation
        if "temperature_2m" in current:
            temp_val = float(current["temperature_2m"])
            temp_sev = "High" if temp_val > 40.0 else "Moderate" if temp_val > 34.0 else "Low"
            observations.append({
                "site_id": site_id,
                "observation_type": "ENVIRONMENTAL_CONDITION",
                "observation_date": obs_date,
                "metric_name": "temperature_c",
                "metric_value": temp_val,
                "unit": "°C",
                "severity": temp_sev,
                "confidence_score": 0.96,
                "details": f"Live ambient temperature at {site_name}: {temp_val}°C. Extreme thermal cycling increases shear stress on exposed masonry.",
                "raw_metadata": {
                    "source": self.source_name,
                    "elevation": raw.get("elevation"),
                    "weather_variable": "temperature_2m"
                }
            })

        # 2. Relative Humidity observation
        if "relative_humidity_2m" in current:
            rh_val = float(current["relative_humidity_2m"])
            rh_sev = "High" if rh_val > 80.0 else "Moderate" if rh_val > 65.0 else "Low"
            observations.append({
                "site_id": site_id,
                "observation_type": "ENVIRONMENTAL_CONDITION",
                "observation_date": obs_date,
                "metric_name": "relative_humidity_pct",
                "metric_value": rh_val,
                "unit": "%",
                "severity": rh_sev,
                "confidence_score": 0.95,
                "details": f"Ambient relative humidity at {site_name}: {rh_val}%. Sustained moisture above 70% triggers efflorescence and sub-surface salt crystal pressure.",
                "raw_metadata": {
                    "source": self.source_name,
                    "weather_variable": "relative_humidity_2m"
                }
            })

        # 3. Wind Speed observation
        if "wind_speed_10m" in current:
            wind_val = float(current["wind_speed_10m"])
            wind_sev = "High" if wind_val > 45.0 else "Moderate" if wind_val > 25.0 else "Low"
            observations.append({
                "site_id": site_id,
                "observation_type": "ENVIRONMENTAL_CONDITION",
                "observation_date": obs_date,
                "metric_name": "wind_speed_kmh",
                "metric_value": wind_val,
                "unit": "km/h",
                "severity": wind_sev,
                "confidence_score": 0.93,
                "details": f"Surface wind velocity at {site_name}: {wind_val} km/h. High velocity winds cause particulate sandblasting on friezes.",
                "raw_metadata": {
                    "source": self.source_name,
                    "weather_variable": "wind_speed_10m"
                }
            })

        # 4. Surface Pressure observation
        if "surface_pressure" in current:
            pres_val = float(current["surface_pressure"])
            observations.append({
                "site_id": site_id,
                "observation_type": "ENVIRONMENTAL_CONDITION",
                "observation_date": obs_date,
                "metric_name": "surface_pressure_hpa",
                "metric_value": pres_val,
                "unit": "hPa",
                "severity": "Low",
                "confidence_score": 0.98,
                "details": f"Atmospheric pressure at {site_name}: {pres_val} hPa.",
                "raw_metadata": {
                    "source": self.source_name,
                    "weather_variable": "surface_pressure"
                }
            })

        return observations
