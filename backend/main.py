"""
HeritageGuardian AI - Main FastAPI Application
Entry point for the backend API server.
"""

import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pathlib import Path

from .models.db_config import init_db, SessionLocal
from .models.seed_data import seed_database
from .routes.agents import router as agents_router
from .routes.sites import router as sites_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger(__name__)

# Create required directories — all paths are env-overridable so Vercel's
# read-only filesystem can redirect everything to /tmp.
_upload_dir = Path(os.getenv("UPLOAD_DIR", "./uploads"))
_reports_dir = Path(os.getenv("REPORTS_DIR", "./reports"))
_data_dir = Path(os.getenv("DATA_DIR", "./data"))
for d in [_upload_dir, _reports_dir, _data_dir]:
    try:
        d.mkdir(parents=True, exist_ok=True)
    except OSError:
        pass  # read-only filesystem on Vercel; /tmp dirs are pre-created in api/index.py

# ── Eager DB init ─────────────────────────────────────────────────────────────
# Called at module import time so tables exist before ANY request is served.
# On Vercel, @vercel/python may not run lifespan before the first request on a
# cold start, so we cannot rely on lifespan alone to create tables.
try:
    init_db()
    _db = SessionLocal()
    try:
        seed_database(_db)
    except Exception as _seed_err:
        logger.warning(f"Seed data warning (non-fatal): {_seed_err}")
    finally:
        _db.close()
    logger.info("HeritageGuardian AI DB initialised at import time.")
except Exception as _init_err:
    logger.error(f"DB init warning (non-fatal): {_init_err}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup/shutdown lifecycle (no-op — DB already init'd above)."""
    logger.info("HeritageGuardian AI starting up...")
    yield
    logger.info("HeritageGuardian AI shutting down.")


app = FastAPI(
    title="HeritageGuardian AI",
    description=(
        "Smart Heritage Conservation & Visitor Experience Platform for Gujarat's UNESCO sites. "
        "Powered by IBM Granite LLM and multi-agent AI architecture."
    ),
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS — allow frontend dev server and production.
# When ALLOWED_ORIGINS="*" (Vercel default set in api/index.py), use allow_origins=["*"]
# with allow_credentials=False (wildcard + credentials is invalid per CORS spec).
_allowed_origins_raw = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000"
)
ALLOWED_ORIGINS = _allowed_origins_raw.split(",")
_wildcard = ALLOWED_ORIGINS == ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=r"https://.*\.vercel\.app" if _wildcard else None,
    allow_credentials=not _wildcard,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers
app.include_router(agents_router)
app.include_router(sites_router)

# Serve uploads as static files (only when aiofiles is available and the dir exists)
_uploads_dir = Path(os.getenv("UPLOAD_DIR", "./uploads"))
if _uploads_dir.exists():
    try:
        from fastapi.staticfiles import StaticFiles
        app.mount("/uploads", StaticFiles(directory=str(_uploads_dir)), name="uploads")
    except Exception:
        pass  # aiofiles not installed (e.g. Vercel serverless) — skip static mount


# Serve frontend dist if available (built during Vercel deployment)
_frontend_dist = Path(__file__).resolve().parent.parent / "frontend" / "dist"
if not _frontend_dist.exists():
    _frontend_dist = Path("./frontend/dist")

if _frontend_dist.exists() and (_frontend_dist / "index.html").exists():
    try:
        from fastapi.staticfiles import StaticFiles
        from fastapi.responses import FileResponse

        _assets_dir = _frontend_dist / "assets"
        if _assets_dir.exists():
            app.mount("/assets", StaticFiles(directory=str(_assets_dir)), name="static_assets")

        @app.get("/{full_path:path}")
        async def serve_frontend(full_path: str):
            if full_path.startswith("api/") or full_path.startswith("uploads/"):
                raise HTTPException(status_code=404, detail="Not found")
            target_file = _frontend_dist / full_path
            if full_path and target_file.exists() and target_file.is_file():
                return FileResponse(target_file)
            return FileResponse(_frontend_dist / "index.html")
    except Exception as _fe_err:
        logger.warning(f"Frontend dist mount warning: {_fe_err}")
else:
    @app.get("/")
    async def root():
        return {
            "name": "HeritageGuardian AI",
            "version": "1.0.0",
            "status": "operational",
            "description": "Smart Heritage Conservation & Visitor Experience Platform",
            "agents": [
                "Structural Health Monitoring Agent",
                "Visitor Flow Management Agent",
                "Personalized Heritage Storytelling Agent",
                "Encroachment Detection Agent",
                "Conservation Reporting Agent"
            ],
            "powered_by": ["IBM Granite LLM", "IBM Cloud (configurable)", "FastAPI", "React"],
            "docs": "/api/docs"
        }


@app.get("/api/health")
async def health():
    return {"status": "healthy", "timestamp": __import__("datetime").datetime.utcnow().isoformat()}


@app.post("/api/demo/reset")
async def reset_demo():
    """Reset demo data — one-click demo reset."""
    db = SessionLocal()
    try:
        from .models.seed_data import clear_and_reseed
        clear_and_reseed(db)
        return {"status": "success", "message": "Demo data reset successfully. HeritageGuardian is ready for demonstration."}
    except Exception as e:
        logger.error(f"Demo reset error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "type": type(exc).__name__}
    )
