# Smart Heritage Conservation Platform
## Gujarat Hackathon 2026

> **Protect Gujarat's Heritage with Agentic AI**
>
> Intelligent visitor management, personalised heritage experiences, and conservation decision support for Modhera Sun Temple and Ahmedabad Walled City.

---

## Problem

Gujarat's UNESCO-listed heritage sites face mounting pressure from rising visitor numbers, inadequate real-time monitoring, and fragmented conservation workflows. Conservation authorities lack integrated tools to manage visitor flow, monitor structural health, and generate timely conservation reports.

## Solution

A full-stack agentic AI platform that coordinates five specialised agents through a central Heritage Orchestrator to deliver:
- **Visitor Flow Management** — real-time pressure analysis with redistribution recommendations
- **Personalised Heritage Storytelling** — grounded AI itineraries from a verified knowledge base
- **Conservation Reporting** — multi-factor decision-support reports with human-verification workflows
- **Structural Health Monitoring** — demo observation-based conservation flagging
- **Encroachment Detection** — boundary monitoring with cautious, human-verified flagging

## Architecture

```
USER GOAL
   ↓
HERITAGE ORCHESTRATOR (FastAPI backend)
   ↓
FIVE SPECIALISED AGENTS (Python async)
   ↓
HERITAGE KNOWLEDGE BASE + VISITOR METRICS (SQLite/PostgreSQL)
   ↓
IBM GRANITE (watsonx.ai — optional, graceful fallback)
   ↓
VALIDATED STRUCTURED RESULTS
   ↓
DATABASE (agent_runs, conservation_reports, alerts)
   ↓
REACT FRONTEND (Vite + TypeScript)
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite + Recharts |
| Backend | Python 3.12+ + FastAPI + SQLAlchemy |
| Database | SQLite (dev) / PostgreSQL-compatible |
| AI Runtime | IBM Granite via watsonx.ai (optional) |
| AI Dev Tool | IBM Bob |

## Agent Architecture

All five agents share a common pattern:
1. **Deterministic computation** (arithmetic, rule-based classification) — never delegated to AI
2. **Grounded retrieval** — only verified heritage content used
3. **Granite enhancement** — contextual explanation and narration
4. **Structured output** — typed JSON responses
5. **Graceful fallback** — works without Granite configured
6. **Human escalation** — consequential findings always flagged for human review

## Local Setup

### Prerequisites
- Python 3.12+ (tested on 3.14)
- Node.js 18+

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Database initializes automatically on first start. Seed data loads automatically.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:5173 and proxies `/api` to http://localhost:8000.

## Environment Variables

Copy `.env.example` to `backend/.env`:

```bash
cp .env.example backend/.env
```

### Required for Granite
```
IBM_API_KEY=your-ibm-cloud-api-key
GRANITE_ENDPOINT=https://us-south.ml.cloud.ibm.com
WATSONX_PROJECT_ID=your-watsonx-project-id
GRANITE_MODEL=ibm/granite-3-3-8b-instruct
```

### Optional
```
DATABASE_URL=sqlite:///./heritage.db
APP_ENV=demo
CORS_ORIGINS=http://localhost:5173
```

If Granite is not configured, the platform runs in **controlled demo mode** — all agent logic is fully functional using deterministic fallbacks.

## Database Setup

The database initializes automatically when the backend starts. To reset:

```bash
cd backend
python -c "from app.database.db import Base, engine; Base.metadata.drop_all(engine); Base.metadata.create_all(engine)"
python -c "from app.database.seed import init_db; init_db()"
```

## Test Commands

```bash
# Backend tests (36 tests)
cd backend
python -m pytest ../tests/test_backend.py -v

# Frontend build verification
cd frontend
npm run build
```

## Demo Workflow (2-3 minutes)

1. Open http://localhost:5173
2. Click **Explore Heritage** → Heritage Guide
3. Select **Modhera Sun Temple**, 60 minutes, Architecture, Avoid Crowds
4. Click **Generate My Heritage Experience** — watch multi-agent execution
5. View the visitor flow analysis, grounded itinerary, and conservation validation
6. Check the **Agent Execution Timeline** — backed by real database records
7. Navigate to **Authority Dashboard** → view alerts and generate a conservation report
8. Visit **Agents** page → see complete execution history from the database

## API Documentation

- Swagger UI: http://localhost:8000/api/docs
- ReDoc: http://localhost:8000/api/redoc
- Full API reference: `docs/API.md`

## Key API Endpoints

```
GET  /api/health                  — Health check + Granite status
GET  /api/sites                   — List heritage sites
GET  /api/sites/{id}              — Site detail with zones
GET  /api/visitor-flow/{site_id}  — Run Visitor Flow Agent
POST /api/visitor-flow/analyze    — Analyze with override
POST /api/heritage-guide          — Run Storytelling Agent
POST /api/orchestrator/run        — Run full orchestration
GET  /api/alerts                  — List conservation alerts
POST /api/conservation/report     — Generate conservation report
GET  /api/agents/runs             — Agent execution history
```

## Docker

```bash
docker-compose up --build
```

- Backend: http://localhost:8000
- Frontend: http://localhost:5173 (dev) or served by nginx (prod)

## Known Limitations

1. **Simulated data** — all visitor counts, structural observations, and encroachment flags are demo data
2. **No real-time feeds** — visitor data is not connected to any live counting system
3. **Granite optional** — AI personalization requires IBM API key configuration
4. **SQLite default** — production deployment should use PostgreSQL
5. **No authentication** — MVP uses Visitor/Authority role switching only

## Data and Claims Policy

| Label | Meaning |
|-------|---------|
| `SIMULATED_DEMO` | Artificially generated data — not real |
| `VERIFIED_PUBLIC` | Based on publicly available heritage information |
| `DEMO_CONTENT` | Heritage content for demonstration; verify before publication |
| `AI_GENERATED_DEMO` | AI-generated report; requires human expert review |
| `VERIFY BEFORE DEPLOYMENT` | Integration not verified in current environment |

**Human verification is required before acting on any AI recommendation.**

## IBM Integration

- **IBM Bob** — development assistant used throughout implementation
- **IBM Granite** (ibm/granite-3-3-8b-instruct via watsonx.ai) — runtime AI for personalization, explanation, and report generation
- All Granite calls have graceful fallback to deterministic logic
- No credentials are hardcoded — configure via environment variables

---

*Gujarat Hackathon 2026 · SIMULATED DEMO — not an official conservation system*
