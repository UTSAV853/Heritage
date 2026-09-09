import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { runOrchestrator } from '../services/api'
import type { OrchestratorResult } from '../types/api'
import AgentTimeline from '../components/AgentTimeline'
import { StatusBadge, Spinner, ErrorBar, DemoBanner } from '../components/StatusBadge'

const SITES = [
  { id: 'site-modhera-001', name: 'Modhera Sun Temple', location: 'Mehsana, Gujarat' },
  { id: 'site-ahmedabad-001', name: 'Ahmedabad Walled City', location: 'Ahmedabad, Gujarat' },
]
const INTERESTS = ['Architecture', 'History', 'Culture', 'Sculpture', 'Photography', 'Religion']
const CROWD_OPTIONS = [
  { value: 'avoid_crowds', label: 'Avoid Crowded Areas' },
  { value: 'moderate', label: 'Moderate Crowds OK' },
  { value: 'any', label: 'No Preference' },
]
const DURATION_OPTIONS = [20, 30, 45, 60, 90, 120, 180, 240]

export default function VisitorGuidePage() {
  const navigate = useNavigate()
  const [siteId, setSiteId] = useState('site-modhera-001')
  const [duration, setDuration] = useState(60)
  const [interests, setInterests] = useState<string[]>(['Architecture'])
  const [crowd, setCrowd] = useState('avoid_crowds')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<OrchestratorResult | null>(null)

  const toggleInterest = (i: string) =>
    setInterests(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])

  const runDemo = async () => {
    setSiteId('site-modhera-001')
    setDuration(60)
    setInterests(['Architecture'])
    setCrowd('avoid_crowds')
    await handleSubmit('site-modhera-001', 60, ['Architecture'], 'avoid_crowds')
  }

  const handleSubmit = async (
    sid = siteId, dur = duration, ints = interests, cr = crowd
  ) => {
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await runOrchestrator({
        site_id: sid,
        duration_minutes: dur,
        interests: ints.map(i => i.toLowerCase()),
        crowd_preference: cr,
        complexity: 'moderate',
        run_conservation: true,
      })
      setResult(res)
    } catch (e: any) {
      setError(e?.response?.data?.detail || e?.message || 'Request failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="container" style={{ padding: '32px 24px' }}>
        <DemoBanner />

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.2fr) minmax(0,2fr)', gap: 24, alignItems: 'start', marginTop: 8 }}>
          {/* INPUT FORM */}
          <div className="card" style={{ position: 'sticky', top: 80 }}>
            <div className="card-header">
              <div>
                <div className="card-title">Heritage Experience Planner</div>
                <div className="card-subtitle">Personalised AI-guided itinerary</div>
              </div>
            </div>

            <fieldset style={{ border: 'none', padding: 0 }}>
              <div className="form-group">
                <label className="form-label" htmlFor="site-select">Heritage Site</label>
                <select id="site-select" className="form-control form-select" value={siteId} onChange={e => setSiteId(e.target.value)}>
                  {SITES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="duration-select">Available Time</label>
                <select id="duration-select" className="form-control form-select" value={duration} onChange={e => setDuration(Number(e.target.value))}>
                  {DURATION_OPTIONS.map(d => <option key={d} value={d}>{d} minutes</option>)}
                </select>
              </div>

              <div className="form-group">
                <span className="form-label">Interests</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {INTERESTS.map(i => (
                    <button
                      key={i} type="button"
                      onClick={() => toggleInterest(i)}
                      aria-pressed={interests.includes(i)}
                      style={{
                        padding: '5px 12px', borderRadius: 20, fontSize: 13, cursor: 'pointer',
                        background: interests.includes(i) ? 'var(--accent)' : 'var(--surface)',
                        color: interests.includes(i) ? 'white' : 'var(--text)',
                        border: interests.includes(i) ? '1px solid var(--accent)' : '1px solid var(--border)',
                      }}
                    >{i}</button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="crowd-select">Crowd Preference</label>
                <select id="crowd-select" className="form-control form-select" value={crowd} onChange={e => setCrowd(e.target.value)}>
                  {CROWD_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>

              {error && <ErrorBar message={error} onRetry={() => handleSubmit()} />}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => handleSubmit()}
                  disabled={loading}
                  style={{ width: '100%', justifyContent: 'center' }}
                  aria-busy={loading}
                >
                  {loading ? <><Spinner size={18} />&nbsp;Generating…</> : '✦ Generate My Heritage Experience'}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={runDemo}
                  disabled={loading}
                  style={{ width: '100%', justifyContent: 'center', fontSize: 13 }}
                >
                  ▶ Run Smart Heritage Demo
                </button>
              </div>
            </fieldset>
          </div>

          {/* RESULTS */}
          <div>
            {!result && !loading && (
              <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--muted)' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🏛</div>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Ready to explore Gujarat's heritage</div>
                <div style={{ fontSize: 14 }}>Fill in your preferences and click Generate to start</div>
              </div>
            )}

            {loading && (
              <div className="card">
                <div className="card-header">
                  <div className="card-title">⬡ Heritage Orchestrator Running</div>
                  <span className="demo-badge">LIVE EXECUTION</span>
                </div>
                <div className="alert-bar alert-bar-info" style={{ marginBottom: 16 }}>
                  Multi-agent workflow executing — connecting to backend orchestrator…
                </div>
                <AgentTimeline runs={[]} loading={true} />
              </div>
            )}

            {result && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Status banner */}
                <div className="card">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 700 }}>{result.site_name}</div>
                      <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>
                        Orchestration {result.status === 'SUCCESS' ? 'completed successfully' : `completed with ${result.degraded_agents.length} degraded agent(s)`}
                      </div>
                    </div>
                    <StatusBadge value={result.status} />
                  </div>
                  {result.degraded_message && (
                    <div className="alert-bar alert-bar-warn" style={{ marginTop: 12 }}>
                      {result.degraded_message}
                    </div>
                  )}
                </div>

                {/* Agent Timeline */}
                <div className="card">
                  <div className="card-header">
                    <div>
                      <div className="card-title">⬡ Agent Execution Timeline</div>
                      <div className="card-subtitle">Actual backend agent run history — request {result.request_id.slice(0, 8)}…</div>
                    </div>
                  </div>
                  <AgentTimeline runs={result.agent_runs} />
                </div>

                {/* Visitor Pressure */}
                {result.visitor_flow && (
                  <div className="card">
                    <div className="card-header">
                      <div className="card-title">👥 Current Visitor Pressure</div>
                      <StatusBadge value={result.visitor_flow.status} />
                    </div>
                    <div className="grid-3" style={{ marginBottom: 16 }}>
                      <div style={{ textAlign: 'center', padding: '12px', background: 'var(--surface)', borderRadius: 8 }}>
                        <div style={{ fontSize: 28, fontWeight: 700 }}>{result.visitor_flow.current_visitors}</div>
                        <div style={{ fontSize: 12, color: 'var(--muted)' }}>Current Visitors</div>
                      </div>
                      <div style={{ textAlign: 'center', padding: '12px', background: 'var(--surface)', borderRadius: 8 }}>
                        <div style={{ fontSize: 28, fontWeight: 700 }}>{result.visitor_flow.occupancy_percent.toFixed(1)}%</div>
                        <div style={{ fontSize: 12, color: 'var(--muted)' }}>Occupancy</div>
                      </div>
                      <div style={{ textAlign: 'center', padding: '12px', background: 'var(--surface)', borderRadius: 8 }}>
                        <div style={{ fontSize: 18, fontWeight: 700 }}>
                          {result.visitor_flow.trend === 'INCREASING' ? '↑' : result.visitor_flow.trend === 'DECREASING' ? '↓' : '→'}
                          {' '}{result.visitor_flow.trend}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--muted)' }}>Trend</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--muted)', padding: '10px 14px', background: 'var(--surface)', borderRadius: 6 }}>
                      {result.visitor_flow.reason}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>
                      {result.visitor_flow.ai_enhanced ? <span className="ai-badge">AI Enhanced</span> : <span className="demo-badge">Deterministic</span>}
                      {' '}· Data: {result.visitor_flow.data_source}
                    </div>
                  </div>
                )}

                {/* Heritage Itinerary */}
                {result.heritage_guide && (
                  <div className="card">
                    <div className="card-header">
                      <div>
                        <div className="card-title">📖 {result.heritage_guide.title}</div>
                        <div className="card-subtitle">{result.heritage_guide.estimated_duration_minutes} min · {result.heritage_guide.recommended_stops.length} stops</div>
                      </div>
                      {result.heritage_guide.ai_enhanced ? <span className="ai-badge">AI Personalised</span> : <span className="demo-badge">DEMO</span>}
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--text)', marginBottom: 20, lineHeight: 1.7 }}>
                      {result.heritage_guide.summary}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {result.heritage_guide.recommended_stops.map((stop, i) => (
                        <div key={i} className="stop-card">
                          <div className="stop-number">{i + 1}</div>
                          <div style={{ paddingRight: 40 }}>
                            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{stop.title}</div>
                            <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 500, marginBottom: 8 }}>
                              {stop.zone} · {stop.duration_minutes} min
                            </div>
                            <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.65 }}>{stop.description}</div>
                            {stop.tags.length > 0 && (
                              <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                {stop.tags.slice(0, 4).map(t => (
                                  <span key={t} style={{ fontSize: 11, padding: '2px 8px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--muted)' }}>
                                    {t}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    {result.heritage_guide.reason && (
                      <div style={{ marginTop: 16, padding: '10px 14px', background: 'var(--surface)', borderRadius: 6 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 4 }}>WHY THIS WAS RECOMMENDED</div>
                        <div style={{ fontSize: 13, color: 'var(--text)' }}>{result.heritage_guide.reason}</div>
                      </div>
                    )}
                    {result.heritage_guide.sources.length > 0 && (
                      <div style={{ marginTop: 12, fontSize: 12, color: 'var(--muted)' }}>
                        <strong>Sources:</strong> {result.heritage_guide.sources.join(' · ')}
                      </div>
                    )}
                    <div style={{ marginTop: 8, fontSize: 12, color: 'var(--muted)' }}>
                      <span className="demo-badge">DEMO CONTENT</span> — Grounded in verified heritage sources. Verify all facts before publication.
                    </div>
                  </div>
                )}

                {/* Conservation */}
                {result.conservation && (
                  <div className="card">
                    <div className="card-header">
                      <div>
                        <div className="card-title">📋 Conservation Validation</div>
                        <div className="card-subtitle">AI decision-support — not an official conservation report</div>
                      </div>
                      <StatusBadge value={result.conservation.priority} />
                    </div>
                    <div className="alert-bar alert-bar-error" style={{ marginBottom: 16 }}>
                      <strong>Human Verification Required</strong> — Conservation decisions require expert review.
                    </div>
                    <p style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>{result.conservation.summary}</p>
                    {result.conservation.recommendations.slice(0, 3).map((rec, i) => (
                      <div key={i} style={{ padding: '10px 14px', background: 'var(--surface)', borderRadius: 6, marginBottom: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontWeight: 700, color: 'var(--accent)', minWidth: 20 }}>{i + 1}.</span>
                          <span style={{ fontWeight: 600, fontSize: 14 }}>{rec.action}</span>
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--muted)', paddingLeft: 28 }}>{rec.rationale}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
