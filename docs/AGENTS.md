# Agents Reference — Smart Heritage Conservation Platform

All agents share a common execution contract:

```
name           string identifier
role           what the agent does
inputs         what it accepts
processing     deterministic computation first, then AI
tools/data     database queries, knowledge base retrieval
output schema  typed Pydantic model
failure        raises ValueError for bad input; graceful on AI failure
confidence     returned as float [0,1]
escalation     human_verification_required when consequential
```

---

## Heritage Orchestrator

**ID:** `orchestrator`  
**Priority:** P0  
**File:** `backend/app/orchestrator/orchestrator.py`

Central coordinator. Receives a user goal (`OrchestratorRequest`) and:
1. Logs orchestrator start to `agent_runs`
2. Runs Visitor Flow Agent
3. Runs Heritage Storytelling Agent
4. Runs Structural Health Agent
5. Runs Encroachment Detection Agent
6. Runs Conservation Reporting Agent (if `run_conservation=true`)
7. Handles partial failure — agents that fail are listed in `degraded_agents`
8. Persists a `ConservationReport` record
9. Returns `OrchestratorResult` with all outputs + agent run history

Partial failure example:
```
Visitor Flow       SUCCESS
Storytelling       SUCCESS  
Structural         FAILED    ← listed in degraded_agents
Encroachment       SUCCESS
Conservation       CONTINUES ← uses available inputs
```

---

## Visitor Flow Management Agent

**ID:** `visitor-flow`  
**Priority:** P0  
**File:** `backend/app/agents/visitor_flow_agent.py`

**Inputs:** `site_id`, optional `override_visitors`

**Deterministic computation:**
- `occupancy_percent = visitors / capacity * 100`
- Pressure classification: LOW (<60%) / MODERATE (60-80%) / HIGH (80-95%) / CRITICAL (≥95%)
- Trend: compares last 2h avg vs previous 2h avg — INCREASING/STABLE/DECREASING (±10% threshold)
- Zone breakdown from `visitor_metrics` table

**Granite use:** Recommendation wording only (not arithmetic)

**Output:** `VisitorFlowResult` — status, occupancy, trend, zone breakdown, recommendation

**Thresholds:** DEMO/PROPOSED — not from an authoritative source

---

## Personalized Heritage Storytelling Agent

**ID:** `storytelling`  
**Priority:** P0  
**File:** `backend/app/agents/storytelling_agent.py`

**Inputs:** `HeritageGuideRequest` (site, duration, interests, crowd preference, complexity)

**Processing:**
1. Retrieve all `HeritageContent` for the site from database
2. Score content items against visitor interests (tag matching, content type)
3. Select items within time budget
4. Build content context string from verified records
5. Optionally call Granite with STORYTELLING_PROMPT for personalization

**Grounding guarantee:** Granite only personalizes presentation of pre-retrieved facts. It never invents heritage content.

**Fallback:** Returns deterministic itinerary from scored content items.

**Output:** `HeritageGuideResult` — title, summary, stops, reason, sources

---

## Conservation Reporting Agent

**ID:** `conservation`  
**Priority:** P0  
**File:** `backend/app/agents/conservation_agent.py`

**Inputs:** `ConservationReportRequest` + optional `visitor_flow`, `structural`, `encroachment` results

**Processing:**
1. Map each input to a priority level (LOW/MODERATE/HIGH/CRITICAL)
2. Take worst-case priority as overall priority
3. Generate factors and recommendations deterministically
4. Try Granite for narrative enrichment

**Always appends:** human verification reminder as final recommendation

**Output:** `ConservationReportResult` — priority, factors, recommendations, summary

**Policy:** `human_verification_required` is always `true`. AI is decision-support only.

---

## Structural Health Monitoring Agent

**ID:** `structural`  
**Priority:** P1  
**File:** `backend/app/agents/structural_agent.py`

**Inputs:** `site_id`

**Processing:**
1. Query `structural_observations` table (most recent first)
2. Take worst-case condition (GOOD/FAIR/POOR/CRITICAL) across all records
3. Generate deterministic recommendation based on worst condition
4. Try Granite for a concise summary

**Disclaimer:** "DEMO DATA — not a professional structural engineering assessment. Human inspection required."

**Output:** `StructuralResult` — condition, risk_level, observations, recommended_action

---

## Encroachment Detection Agent

**ID:** `encroachment`  
**Priority:** P1  
**File:** `backend/app/agents/encroachment_agent.py`

**Inputs:** `site_id`

**Processing:**
1. Query `encroachment_observations` table
2. Flag `potential_encroachment = true` if any observation is flagged
3. Aggregate evidence and confidence
4. Try Granite for cautious narrative

**Wording policy:** Always cautious. "Potential encroachment — human verification required." Never accuses without verified evidence.

**Output:** `EncroachmentResult` — potential_encroachment, confidence, evidence, recommended_verification

---

## Agent Run Logging

Every agent execution is logged to the `agent_runs` table:

```
id              UUID
request_id      groups all agents in one orchestrator call
agent           agent name string
status          RUNNING → SUCCESS | FAILED | SKIPPED
start_time      UTC
end_time        UTC
duration_ms     integer
input_summary   truncated at 500 chars
output_summary  truncated at 500 chars
error           truncated at 500 chars
```

The Agent Operations Centre page (`/dashboard/agents`) queries this table and displays the real execution history.
