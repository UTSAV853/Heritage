"""
HeritageGuardian AI - Base Data Ingestion Adapter
Abstract interface for all external and internal data source connectors.
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
from datetime import datetime


class BaseAdapter(ABC):
    """
    Standard interface for all data source adapters.
    Adapters are responsible for source-specific communication,
    fetching, raw parsing, and health checking.
    """

    @property
    @abstractmethod
    def source_name(self) -> str:
        """Unique human-readable source name."""
        pass

    @property
    @abstractmethod
    def domain(self) -> str:
        """Domain or endpoint identifier."""
        pass

    @property
    @abstractmethod
    def authority_tier(self) -> str:
        """TIER_1 (Official/Gov), TIER_2 (Research/NGO), TIER_3 (News), TIER_4 (Citizen/Other)."""
        pass

    @property
    @abstractmethod
    def default_reliability(self) -> float:
        """Baseline reliability score between 0.0 and 1.0."""
        pass

    @abstractmethod
    async def health_check(self) -> Dict[str, Any]:
        """
        Verify connectivity to the source.
        Returns dict with keys: 'status' (HEALTHY / DEGRADED / UNAVAILABLE), 'message', 'latency_ms'.
        """
        pass

    @abstractmethod
    async def fetch(self, site: Any) -> Dict[str, Any]:
        """
        Fetch raw data for a given heritage site.
        Returns a raw payload dict with provenance metadata.
        """
        pass

    @abstractmethod
    def parse(self, raw_payload: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Parse raw payload into semi-structured intermediate observation records.
        """
        pass
