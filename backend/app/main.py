"""Heritage Conservation Platform — FastAPI application."""
import os
import logging
from datetime import datetime
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s — %(message)s",
)
logger = logging.getLogger(__name__)

# Initialize database
from app.database.db import Base, engine
from app.database import models  # noqa: ensure all models are registered
from app.database.seed import run_seed
from app.database.db import SessionLocal

def startup_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        run_seed(db)
        logger.info("Database initialized and seed data loaded")
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
    finally:
        db.close()

startup_db()

app = FastAPI(
    title="Smart Heritage Conservation Platform",
    description="Agentic AI platform for Gujarat heritage conservation — Gujarat Hackathon 2026",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# CORS
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000,http://localhost:4173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
from app.api.routes_sites import router as sites_router
from app.api.routes_visitor_flow import router as visitor_flow_router
from app.api.routes_heritage_guide import router as heritage_guide_router
from app.api.routes_orchestrator import router as orchestrator_router
from app.api.routes_alerts import router as alerts_router
from app.api.routes_conservation import router as conservation_router
from app.api.routes_agents import router as agents_router
from app.services.granite_service import granite_available

API_PREFIX = "/api"
app.include_router(sites_router, prefix=API_PREFIX)
app.include_router(visitor_flow_router, prefix=API_PREFIX)
app.include_router(heritage_guide_router, prefix=API_PREFIX)
app.include_router(orchestrator_router, prefix=API_PREFIX)
app.include_router(alerts_router, prefix=API_PREFIX)
app.include_router(conservation_router, prefix=API_PREFIX)
app.include_router(agents_router, prefix=API_PREFIX)


@app.get("/api/health")
def health():
    from app.database.db import SessionLocal
    db_ok = "ok"
    try:
        db = SessionLocal()
        db.execute(__import__("sqlalchemy").text("SELECT 1"))
        db.close()
    except Exception as e:
        db_ok = f"error: {e}"
    return {
        "status": "ok",
        "version": "1.0.0",
        "database": db_ok,
        "demo_mode": not granite_available(),
        "granite_available": granite_available(),
        "timestamp": datetime.utcnow().isoformat(),
        "environment": os.getenv("APP_ENV", "demo"),
    }


# ── Serve React frontend from the built dist/ folder ─────────────────────────
_FRONTEND_DIST = Path(__file__).resolve().parent.parent.parent / "frontend" / "dist"

if _FRONTEND_DIST.exists():
    # Static assets (hashed filenames — JS/CSS bundles)
    app.mount("/assets", StaticFiles(directory=str(_FRONTEND_DIST / "assets")), name="assets")

    # SPA fallback — must be the very last route so API routes take priority
    @app.get("/", include_in_schema=False)
    async def spa_root():
        return FileResponse(str(_FRONTEND_DIST / "index.html"))

    @app.get("/{full_path:path}", include_in_schema=False)
    async def spa_fallback(full_path: str):
        # Explicit file in dist (e.g. favicon.ico, robots.txt)
        candidate = _FRONTEND_DIST / full_path
        if candidate.exists() and candidate.is_file():
            return FileResponse(str(candidate))
        # Everything else → SPA index (React Router handles the route)
        return FileResponse(str(_FRONTEND_DIST / "index.html"))
else:
    @app.get("/")
    def root():
        return {
            "message": "Smart Heritage Conservation Platform API",
            "docs": "/api/docs",
            "health": "/api/health",
            "frontend": "Run `cd frontend && npm run build` then restart the server",
            "version": "1.0.0",
        }
