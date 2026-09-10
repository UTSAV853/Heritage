"""
HeritageGuardian AI - Database Configuration and Session Management
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .database import Base

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./heritageguardian.db")

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initialize database tables and apply lightweight migrations if needed."""
    Base.metadata.create_all(bind=engine)
    if "sqlite" in DATABASE_URL:
        try:
            from sqlalchemy import text
            with engine.connect() as conn:
                result = conn.execute(text("PRAGMA table_info(sites)")).fetchall()
                existing_cols = {row[1] for row in result}
                new_cols = [
                    ("unesco_id", "VARCHAR(50)"),
                    ("country_id", "INTEGER"),
                    ("state_id", "INTEGER"),
                    ("city_id", "INTEGER"),
                    ("data_origin", "VARCHAR(50) DEFAULT 'IMPORTED_DATA'")
                ]
                for col_name, col_type in new_cols:
                    if col_name not in existing_cols:
                        conn.execute(text(f"ALTER TABLE sites ADD COLUMN {col_name} {col_type}"))
                conn.commit()
        except Exception:
            pass
