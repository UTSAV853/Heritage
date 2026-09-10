"""
Vercel serverless entrypoint for HeritageGuardian AI.

Vercel looks for `app` in api/index.py. This module adds the project root
to sys.path so the `backend` package (which uses relative imports internally)
can be imported as a package, then re-exports the FastAPI `app`.
"""

import sys
import os
from pathlib import Path

# Add the project root to sys.path so `import backend.main` resolves correctly.
# Try relative to __file__ first, fallback to os.getcwd() if 'backend' is not found.
_possible_roots = [
    Path(__file__).resolve().parent.parent,
    Path(__file__).resolve().parent,
    Path(os.getcwd())
]
for _root in _possible_roots:
    if (_root / "backend").exists():
        if str(_root) not in sys.path:
            sys.path.insert(0, str(_root))
        break

# Ensure writable /tmp directories exist for uploads/reports/data on Vercel
for d in ["/tmp/uploads", "/tmp/reports", "/tmp/data"]:
    Path(d).mkdir(parents=True, exist_ok=True)

# Override env defaults so all I/O goes to /tmp (the only writable path on Vercel).
# These MUST be set before importing backend.main so module-level os.getenv() calls
# in the agents/routes pick up the correct values.
if not os.environ.get("DATABASE_URL"):
    os.environ["DATABASE_URL"] = "sqlite:////tmp/heritageguardian.db"
if not os.environ.get("UPLOAD_DIR"):
    os.environ["UPLOAD_DIR"] = "/tmp/uploads"
if not os.environ.get("REPORTS_DIR"):
    os.environ["REPORTS_DIR"] = "/tmp/reports"
if not os.environ.get("DATA_DIR"):
    os.environ["DATA_DIR"] = "/tmp/data"

# Allow all origins by default on Vercel (frontend is on a separate domain).
# Override with ALLOWED_ORIGINS env var in Vercel project settings for production.
if not os.environ.get("ALLOWED_ORIGINS"):
    os.environ["ALLOWED_ORIGINS"] = "*"

# Import and re-export the FastAPI app
from backend.main import app  # noqa: E402

__all__ = ["app"]
