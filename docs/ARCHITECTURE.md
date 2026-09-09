# Architecture — Smart Heritage Conservation Platform

## Overview

A full-stack agentic AI platform for heritage conservation decision support.

```
USER
  ↓
REACT FRONTEND (Vite + TypeScript, port 5173)
  ↓  POST /api/orchestrator/run
FASTAPI BACKEND (Python, port 8000)
  ↓
HERITAGE ORCHESTRATOR
  ↓  parallel/sequential
FIVE SPECIALIZED AGENTS
  ↓
HERITAGE KNOWLEDGE BASE (SQLite)
  ↓
IBM GRANITE (watsonx.ai — optional, graceful fallback)
  ↓
STRUCTURED VALIDATED RESULTS
  ↓
DATABASE (agent_runs, conservation_reports, alerts)
  ↓
FRONTEND STATE → UI
```

---

## Component Map

### Frontend (`frontend/src/`)

| Path | Purpose |
|---|---|
| `App.tsx` | Root router — visitor + authority routes |
| `pages/LandingPage.tsx` | Public hero with dual CTAs |
| `pages/VisitorGuidePage.tsx` | Orchestrator input form + result display |
| `pages/VisitorFlowPage.tsx` | Real-time visitor pressure monitor |
| `pages/DashboardPage.tsx` | Conservation authority overview |
| `pages/AlertsPage.tsx` | Alert management with status updates |
| `pages/ReportsPage.tsx` | Conservation report generation + history |
| `pages/AgentsPage.tsx` | Agent Operations Centre — live run history |
| `components/AgentTimeline.tsx` | Timeline visualization from DB records |
| `components/Charts.tsx` | Recharts visitor trend + zone bar chart |
| `components/Nav.tsx` | Visitor/Authority mode switch navigation |
| `components/StatusBadge.tsx` | Status badges, progress bars, spinners, banners |
| `services/api.ts` | Axios API client — all endpoints |
| `types/api.ts` | TypeScript interfaces mirroring backend schemas |

### Backend (`backend/app/`)

| Path | Purpose |
|---|---|
| `main.py` | FastAPI app, CORS, startup, route registration |
| `database/models.py` | SQLAlchemy ORM models (10 tables) |
| `database/seed.py` | Demo data initialization |
| `database/db.py` | Engine, session, get_db dependency |
| `schemas/schemas.py` | Pydantic request/response schemas |
| `services/granite_service.py` | IBM Granite via watsonx.ai with IAM token cache |
| `prompts/prompts.py` | Centralized Granite prompts for all agents |
| `orchestrator/orchestrator.py` | Central coordinator — dispatches all 5 agents |
| `agents/visitor_flow_agent.py` | Deterministic pressure calc + Granite wording |
| `agents/storytelling_agent.py` | Grounded retrieval + Granite personalization |
| `agents/conservation_agent.py` | Multi-factor synthesis + Granite report narrative |
| `agents/structural_agent.py` | Demo observation rules + Granite summary |
| `agents/encroachment_agent.py` | Boundary observation aggregation + Granite narrative |
| `api/routes_*.py` | FastAPI route handlers (7 modules) |

---

## Database Schema

```
heritage_sites          ← two sites (Modhera, Ahmedabad)
  ↓ 1:N
  heritage_zones        ← 3 zones per site
  heritage_content      ← grounded knowledge base content
  visitor_metrics       ← 72h hourly SIMULATED_DEMO data
  conservation_alerts   ← 3 seed alerts
  structural_observations
  encroachment_observations
  conservation_reports  ← persisted after each run
  agent_runs            ← persisted for every agent execution
visitor_profiles        ← optional session tracking
```

---

## Agent Patterns

Every agent follows this pattern:

1. **Validate inputs** — site must exist, raise ValueError if not
2. **Deterministic computation** — arithmetic, rules, classification
3. **Granite enhancement (optional)** — contextual narration, never facts
4. **Graceful fallback** — returns valid result if Granite is unavailable
5. **Human escalation** — consequential findings always flagged
6. **Structured output** — typed Pydantic schemas

---

## Execution Modes

| Mode | Condition | Behaviour |
|---|---|---|
| LIVE | `IBM_API_KEY` + `GRANITE_ENDPOINT` configured | Granite active for all agents |
| DEMO | No IBM credentials | Deterministic fallbacks, all results valid |
| EMERGENCY | Any external failure | Same as DEMO — fallback is always present |

---

## Security Notes

- No hardcoded credentials (all via env vars)
- CORS restricted to configured origins
- Input validated via Pydantic
- Rate limiting via `slowapi` (backend/requirements.txt)
- No sensitive data in seed records
- Safe error messages (no stack traces in production responses)

---

## IBM Integration

| Tool | Role |
|---|---|
| IBM Bob | Development assistant (this project) |
| IBM Granite (`ibm/granite-3-3-8b-instruct`) | Runtime AI via watsonx.ai |

Granite is used for:
- Visitor flow recommendation wording
- Heritage storytelling personalization
- Conservation report narrative generation
- Structural observation summarization
- Encroachment verification narratives

All Granite calls have deterministic fallbacks. The system never hallucinates heritage facts.
