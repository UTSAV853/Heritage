# API Reference — Smart Heritage Conservation Platform

Base URL: `http://localhost:8000/api`
Interactive docs: http://localhost:8000/api/docs (Swagger UI)
ReDoc: http://localhost:8000/api/redoc

---

## Health

### `GET /health`
System health check including database and Granite status.

**Response**
```json
{
  "status": "ok",
  "version": "1.0.0",
  "database": "ok",
  "demo_mode": true,
  "granite_available": false,
  "timestamp": "2026-01-01T00:00:00",
  "environment": "demo"
}
```

---

## Sites

### `GET /sites`
List all heritage sites.

**Response** `Site[]`

### `GET /sites/{site_id}`
Get detailed site info including zones. Accepts both ID (`site-modhera-001`) and slug (`modhera`).

**Response** `SiteDetail`

---

## Visitor Flow

### `GET /visitor-flow/{site_id}`
Run the Visitor Flow Agent for a site and return current pressure analysis.

**Response** `VisitorFlowResult`
```json
{
  "site_id": "site-modhera-001",
  "site_name": "Modhera Sun Temple",
  "status": "HIGH",
  "occupancy_percent": 91.5,
  "current_visitors": 430,
  "capacity": 470,
  "trend": "INCREASING",
  "critical_zones": ["Main Temple (Gudhamandapa)"],
  "recommended_action": "...",
  "reason": "...",
  "confidence": 0.85,
  "zone_breakdown": [...],
  "data_source": "SIMULATED_DEMO",
  "ai_enhanced": false
}
```

### `POST /visitor-flow/analyze`
Analyze with an override visitor count (for testing thresholds).

**Request**
```json
{
  "site_id": "site-modhera-001",
  "override_visitors": 430
}
```

---

## Heritage Guide

### `POST /heritage-guide`
Run the Personalized Heritage Storytelling Agent. Returns a grounded itinerary.

**Request**
```json
{
  "site_id": "site-modhera-001",
  "duration_minutes": 60,
  "interests": ["architecture", "history"],
  "crowd_preference": "avoid_crowds",
  "complexity": "moderate"
}
```
`crowd_preference`: `avoid_crowds` | `moderate` | `any`
`complexity`: `simple` | `moderate` | `detailed`

**Response** `HeritageGuideResult`

---

## Orchestrator

### `POST /orchestrator/run`
Run the full Heritage Orchestrator — dispatches all 5 agents and returns combined results.

**Request**
```json
{
  "site_id": "site-modhera-001",
  "duration_minutes": 60,
  "interests": ["architecture"],
  "crowd_preference": "avoid_crowds",
  "complexity": "moderate",
  "run_conservation": true
}
```

**Response** `OrchestratorResult`
```json
{
  "request_id": "...",
  "status": "SUCCESS",
  "visitor_flow": {...},
  "heritage_guide": {...},
  "structural": {...},
  "conservation": {...},
  "agent_runs": [...],
  "degraded_agents": [],
  "degraded_message": null,
  "completed_at": "..."
}
```
`status`: `SUCCESS` | `PARTIAL` | `FAILED`

---

## Alerts

### `GET /alerts`
List conservation alerts. Query params: `site_id`, `severity`, `status`, `limit`.

### `POST /alerts`
Create a new conservation alert.

**Request**
```json
{
  "site_id": "site-modhera-001",
  "severity": "HIGH",
  "category": "visitor_flow",
  "agent": "Visitor Flow Agent",
  "title": "Alert title",
  "description": "...",
  "evidence": ["..."],
  "recommendation": "..."
}
```

### `PATCH /alerts/{alert_id}/status`
Update alert status. Query param: `status` = `PENDING_REVIEW` | `IN_PROGRESS` | `RESOLVED`

---

## Conservation Reports

### `POST /conservation/report`
Run the Conservation Reporting Agent and persist a report.

**Request**
```json
{
  "site_id": "site-modhera-001",
  "include_visitor_flow": true,
  "include_structural": true,
  "include_encroachment": true
}
```

### `GET /conservation/sites/{site_id}`
Get conservation report history for a site.

---

## Agents

### `GET /agents`
List all registered agents and system status.

### `GET /agents/runs`
Query agent execution history. Query params: `request_id`, `agent`, `status`, `limit`.

---

## Data Labels

| Label | Meaning |
|---|---|
| `SIMULATED_DEMO` | Artificially generated data — not real |
| `VERIFIED_PUBLIC` | Based on publicly available heritage information |
| `DEMO_CONTENT` | Heritage content for demonstration only |
| `AI_GENERATED_DEMO` | AI-generated report — requires human expert review |

**Human verification is required before acting on any AI recommendation.**
