"""
HeritageGuardian AI - Ingestion Framework Package
"""

from .engine.ingestion_engine import ingestion_engine, IngestionEngine
from .adapters.base import BaseAdapter
from .validators.observation_validator import ObservationValidator
from .deduplication.deduplication_engine import DeduplicationEngine

__all__ = [
    "ingestion_engine",
    "IngestionEngine",
    "BaseAdapter",
    "ObservationValidator",
    "DeduplicationEngine"
]
