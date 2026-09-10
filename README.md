# 🏛️ HeritageGuardian AI
### Smart Heritage Conservation & Visitor Experience Platform

> **IBM Hackathon Submission** — Gujarat Heritage Sites · IBM Granite LLM · Multi-Agent AI Architecture

---

## 🎯 Problem Statement

Gujarat's UNESCO heritage locations — Ahmedabad's Walled City, Modhera Sun Temple, and others — face critical challenges:

| Challenge | Impact |
|---|---|
| Structural deterioration & weathering | Irreversible loss of heritage fabric |
| Urban encroachment near protected zones | Boundary violations, visual obstruction |
| Unmanaged tourist footfall & overcrowding | Structural stress, visitor safety risks |
| Lack of personalized digital storytelling | Disengaged visitors, reduced cultural value |
| No unified AI platform for authorities | Fragmented monitoring, delayed response |

---

## 💡 Solution: HeritageGuardian AI

A **production-quality agentic AI platform** featuring five cooperating AI agents coordinated through a central IBM Granite-powered orchestrator, providing:

- Real-time structural health monitoring via AI-assisted image analysis
- Visitor crowd management with heatmaps and routing
- Automated encroachment detection with before/after comparison
- Personalized multilingual heritage storytelling
- Authority-ready conservation reports with Granite AI summaries
- Cross-agent correlation (visitor × structural × encroachment)
- One-click hackathon demo mode

---

## 🤖 The Five AI Agents

### 1. Structural Health Monitoring Agent
- Analyzes heritage structure images for cracks, deterioration, weathering
- Produces risk score 0–100 with confidence rating
- Classifies: Healthy / Low / Moderate / High / Critical
- Compares current vs. historical inspection images
- Sensor reading integration (moisture, temperature)
- **Disclaimer**: AI-assisted observations only — NOT certified engineering assessments

### 2. Visitor Flow Management Agent
- Simulates real-time visitor density per site and zone
- Crowd classification: 🟢 Green / 🟡 Yellow / 🟠 Orange / 🔴 Red
- Heatmap showing per-zone density
- Route diversion recommendations
- Hourly and weekly visitor trend charts

### 3. Personalized Heritage Storytelling Agent
- Generates personalized narratives via IBM Granite
- Supports: English, Hindi, Gujarati
- Age-appropriate storytelling (Child → Senior)
- Interest-based content: Architecture, Science, Religion, Food, Photography, etc.
- Timed walking routes (15–180 min)
- Did You Know? sections and follow-up questions

### 4. Encroachment Detection Agent
- Detects potential boundary violations via image analysis
- Before/after comparison with historical imagery
- Types: New construction, temporary structures, illegal extensions
- Severity-based action plans for authorities
- **Legal disclaimer**: Observations only — requires field verification

### 5. Conservation Reporting Agent
- Aggregates all agent outputs into authority-ready reports
- IBM Granite executive summary generation
- Cross-agent correlation alerts
- Export: JSON, CSV (PDF-ready)
- Automatic task creation for high-risk findings

---

## 🧠 Agent Orchestrator

The central orchestrator:
1. Receives event/request
2. Determines which agents to invoke
3. Runs agents (in parallel where possible)
4. Detects cross-agent correlations (Visitor × Structural, Encroachment × Structural)
5. Sends combined context to IBM Granite for integrated reasoning
6. Returns actionable recommendations
7. Logs all activity to the Agent Activity terminal

---

## 🔁 Cross-Agent Workflows

### Scenario A: Visitor-Structural Correlation
```
Visitor Agent: "Orange alert — 78% occupancy at Zone A"
     ↓
Structural Agent: "Moderate risk — fragile zone at Zone A facade"
     ↓
Orchestrator: "Geographic overlap detected"
     ↓
IBM Granite: "Combined risk exceeds threshold"
     ↓
System: "Redirect visitors to Route B. Inspect in 7 days."
```

### Scenario B: Encroachment-Structural Correlation
```
Encroachment Agent: "Potential construction near northern boundary"
     ↓
Structural Agent: "Adjacent structure shows deterioration"
     ↓
Orchestrator: "Geographic correlation identified"
     ↓
IBM Granite: "Joint field verification recommended"
     ↓
Conservation Agent: "Emergency task created for Protection Officer"
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                 React.js Frontend                    │
│  Dashboard · Sites · Structural · Visitor · Guide   │
│  Encroachment · Reports · Agent Activity · Demo     │
└─────────────────┬───────────────────────────────────┘
                  │ REST API (FastAPI)
┌─────────────────▼───────────────────────────────────┐
│              Agent Orchestrator                      │
│         (Routes · Correlates · Coordinates)          │
└──┬──────────┬──────────┬──────────┬──────────┬──────┘
   │          │          │          │          │
   ▼          ▼          ▼          ▼          ▼
Structural  Visitor  Storytelling Encroach  Conservation
 Agent      Agent    Agent (IBM   Agent     Agent
 (CV sim)  (IoT sim) Granite)    (CV sim)  (Multi-agent)
   │          │          │          │          │
   └──────────┴──────────┴──────────┴──────────┘
                         │
              ┌──────────▼──────────┐
              │   IBM Granite LLM   │
              │  (watsonx.ai API)   │
              └─────────────────────┘
                         │
              ┌──────────▼──────────┐
              │  SQLite / PostgreSQL │
              │    (SQLAlchemy)      │
              └─────────────────────┘
```

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| AI/LLM | IBM Granite 13B Instruct (via watsonx.ai) |
| AI Framework | Custom multi-agent orchestrator |
| Backend | Python 3.11 · FastAPI · Uvicorn |
| Frontend | React 18 · Vite · Tailwind CSS |
| Database | SQLite (dev) · PostgreSQL (production) |
| ORM | SQLAlchemy 2.0 |
| Charts | Recharts |
| Map | React Leaflet |
| HTTP Client | httpx (async) |
| Cloud Ready | IBM Cloud · Docker · docker-compose |

---

## 📁 Project Structure

```
heritageguardian/
├── backend/
│   ├── agents/
│   │   ├── structural_agent.py   # Structural health monitoring
│   │   ├── visitor_agent.py      # Visitor flow management
│   │   ├── storytelling_agent.py # Heritage storytelling (Granite)
│   │   ├── encroachment_agent.py # Encroachment detection
│   │   └── conservation_agent.py # Report generation
│   ├── orchestrator/
│   │   └── orchestrator.py       # Central AI coordinator
│   ├── models/
│   │   ├── database.py           # SQLAlchemy models
│   │   ├── db_config.py          # DB session management
│   │   └── seed_data.py          # Demo data seeder
│   ├── routes/
│   │   ├── agents.py             # All agent API endpoints
│   │   └── sites.py              # Heritage site CRUD
│   └── services/
│       └── granite_service.py    # IBM Granite LLM integration
├── frontend/
│   └── src/
│       ├── pages/                # Dashboard, Structural, Visitor...
│       ├── components/           # ChatAssistant
│       └── api/client.js         # Axios API client
├── tests/
│   └── test_agents.py            # Pytest test suite
├── .env.example                  # Environment variable template
├── requirements.txt              # Python dependencies
├── docker-compose.yml            # Container orchestration
├── Dockerfile.backend            # Backend Docker image
└── README.md                     # This file
```

---

## ⚡ Quick Start

### Option A: Local Development

```bash
# 1. Clone and enter project
cd heritageguardian

# 2. Backend setup
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

# 3. Configure environment
cp .env.example .env
# Edit .env — add GRANITE_API_KEY if available (demo works without it)

# 4. Start backend
uvicorn backend.main:app --reload --port 8000

# 5. Frontend setup (new terminal)
cd frontend
npm install
npm run dev

# 6. Open http://localhost:3000
```

### Option B: Docker

```bash
cd heritageguardian
cp .env.example .env
docker-compose up --build
# Open http://localhost:3000
```

---

## 🔑 Environment Variables

| Variable | Description | Required |
|---|---|---|
| `GRANITE_API_KEY` | IBM Granite/watsonx API key | Optional (demo works without) |
| `IBM_CLOUD_API_KEY` | IBM Cloud API key for IAM token exchange | Optional |
| `IBM_PROJECT_ID` | IBM watsonx.ai project ID | Optional |
| `DATABASE_URL` | DB connection string | Optional (SQLite default) |
| `ALLOWED_ORIGINS` | CORS origins | Optional |

> Without IBM API keys, the system runs in **Demo Mode** using structured, realistic AI response templates.

---

## 🎬 Demo Instructions

### 3-Minute Hackathon Demo

1. Open http://localhost:3000
2. Click **"▶ Hackathon Demo"** in the sidebar
3. Click **"Start Full Demo"** — runs all 8 scenarios automatically
4. Or run steps individually:
   - **Dashboard** → HeritageGuardian Command Center
   - **Visitor Alert** → Simulated crowd event
   - **Structural Analysis** → AI image analysis demo
   - **Encroachment Detection** → Boundary monitoring
   - **Scenario A** → Visitor × Structural cross-agent
   - **Scenario B** → Encroachment × Structural cross-agent
   - **Conservation Report** → Full Granite report
   - **Heritage Story** → Personalized AI guide

5. Click **"AI Chat"** (top right) → try "What is the condition of Modhera?"

---

## 🗄️ Database Schema

| Table | Description |
|---|---|
| `sites` | Heritage site registry |
| `inspections` | Structural inspection records |
| `structural_alerts` | Active structural alerts |
| `visitor_data` | Visitor count snapshots |
| `encroachment_alerts` | Potential encroachment records |
| `conservation_tasks` | Open/closed conservation work items |
| `agent_logs` | All agent activity events |
| `heritage_stories` | Generated visitor stories |
| `users` | Authority user accounts |

---

## 🔒 Security Features

- No hardcoded credentials — environment variables only
- Input validation on all endpoints
- File upload: extension allowlist + size limit (10MB)
- CORS configuration
- Global error handling
- Secure IAM token exchange for IBM Cloud

---

## 🌐 IBM Granite Integration

IBM Granite is used for:
- **Structural assessment reasoning** — contextual risk interpretation
- **Visitor flow recommendations** — crowd management synthesis
- **Encroachment analysis** — boundary change interpretation
- **Heritage storytelling** — personalized cultural narratives
- **Conservation report summaries** — authority-ready executive summaries
- **Orchestrator synthesis** — cross-agent integrated reasoning
- **Chat assistant** — natural language heritage queries

**Fallback**: When API is unavailable, structured demo responses demonstrate the expected Granite outputs.

---

## ☁️ IBM Cloud Readiness

Pre-configured integration points for:
- **IBM watsonx.ai** — Granite LLM inference (primary)
- **IBM Cloud Object Storage** — Heritage image persistence
- **IBM Watson Visual Recognition** — Production CV model replacement
- **IBM Cloud PostgreSQL** — Production database
- **IBM Cloud Monitoring** — Operational observability

---

## 🧪 Running Tests

```bash
cd heritageguardian
pip install pytest pytest-asyncio httpx
pytest tests/ -v
```

---

## 🔮 Future Improvements

1. **Live IoT Integration** — Real sensor feeds replacing simulated visitor data
2. **Satellite API** — ISRO/ESA imagery for encroachment detection
3. **Certified CV Model** — IBM Watson Vision for production structural analysis
4. **Mobile App** — React Native visitor companion app
5. **ARCore Integration** — Augmented reality heritage overlay
6. **Bengali/Tamil/Marathi** — Additional Indian language support
7. **Offline Mode** — PWA for heritage sites with poor connectivity
8. **Authority Portal** — Role-based access for ASI, municipalities, state heritage
9. **Blockchain Evidence** — Tamper-proof encroachment detection records
10. **Predictive Deterioration** — Time-series structural health forecasting

---

## ⚠️ Important Disclaimers

- **Structural observations** are AI-assisted only — not certified engineering assessments
- **Encroachment detections** are observations — legal determination requires field verification
- **Visitor data** is simulated for demonstration — real deployment requires sensor integration
- **Heritage facts** are based on established records — verify specifics with ASI publications

---

## 👥 Team

| Role | Contribution |
|---|---|
| Solution Architect | Platform design, agent architecture |
| AI/ML Engineer | Granite integration, agent logic |
| Full-stack Developer | FastAPI backend, React frontend |
| UX Designer | Heritage-themed dashboard design |
| Heritage Consultant | Gujarat heritage knowledge base |

---

## 📜 License

MIT License — Built for IBM Hackathon. Heritage data based on publicly available ASI records.

---

*Built with ❤️ for Gujarat's irreplaceable heritage · Powered by IBM Granite AI*
