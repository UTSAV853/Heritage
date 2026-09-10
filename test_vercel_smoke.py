"""Quick smoke test that replicates Vercel cold-start import order."""
import sys, os
from pathlib import Path

ROOT = str(Path(__file__).resolve().parent)
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

for d in ["/tmp/uploads", "/tmp/reports", "/tmp/data"]:
    Path(d).mkdir(parents=True, exist_ok=True)

os.environ["DATABASE_URL"] = "sqlite:////tmp/hg_smoke_test.db"
os.environ["UPLOAD_DIR"] = "/tmp/uploads"
os.environ["REPORTS_DIR"] = "/tmp/reports"
os.environ["DATA_DIR"] = "/tmp/data"
os.environ["ALLOWED_ORIGINS"] = "*"

from backend.main import app  # noqa
from fastapi.testclient import TestClient

client = TestClient(app, raise_server_exceptions=False)

TESTS = [
    "/",
    "/api/health",
    "/api/agents/dashboard/overview",
    "/api/sites/",
    "/api/agents/structural/demo",
    "/api/agents/visitor/demo/Modhera Sun Temple",
    "/api/agents/encroachment/demo",
    "/api/agents/conservation/demo",
    "/api/agents/activity-log",
]

failures = []
for path in TESTS:
    r = client.get(path)
    ok = r.status_code < 500
    print(("PASS" if ok else "FAIL"), path, "->", r.status_code)
    if not ok:
        failures.append((path, r.status_code, r.text[:300]))

print()
if failures:
    for p, s, t in failures:
        print("FAIL DETAIL:", p, s, t)
    sys.exit(1)
else:
    print("ALL TESTS PASSED")
