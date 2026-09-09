import { useEffect, useState } from 'react'
import { getAgents, getAgentRuns } from '../services/api'
import type { AgentInfo, AgentRunSummary, AgentsListResponse } from '../types/api'
import AgentTimeline from '../components/AgentTimeline'
import { Spinner, ErrorBar } from '../components/StatusBadge'

export default function AgentsPage() {
  const [agentsInfo, setAgentsInfo] = useState<AgentsListResponse | null>(null)
  const [runs, setRuns] = useState<AgentRunSummary[]>([])
  const [loadingInfo, setLoadingInfo] = useState(true)
  const [loadingRuns, setLoadingRuns] = useState(true)
  const [error, setError] = useState('')
  const [filterAgent, setFilterAgent] = useState('')

  const loadAgents = async () => {
    try {
      const data = await getAgents()
      setAgentsInfo(data)
    } catch (e: any) {
      setError(e?.message || 'Failed to load agent info')
    } finally {
      setLoadingInfo(false)
    }
  }

  const loadRuns = async () => {
    setLoadingRuns(true)
    try {
      const data = await getAgentRuns({ limit: 60 })
      setRuns(data)
    } catch (e: any) {
      setError(e?.message || 'Failed to load agent runs')
    } finally {
      setLoadingRuns(false)
    }
  }

  useEffect(() => {
    loadAgents()
    loadRuns()
  }, [])

  const filteredRuns = filterAgent
    ? runs.filter(r => r.agent.toLowerCase().includes(filterAgent.toLowerCase()))
    : runs

  const stats = {
    total: runs.length,
    success: runs.filter(r => r.status === 'SUCCESS').length,
    failed: runs.filter(r => r.status === 'FAILED').length,
    avgMs: runs.filter(r => r.duration_ms).reduce((a, b) => a + (b.duration_ms || 0), 0) / Math.max(runs.filter(r => r.duration_ms).length, 1),
  }

  return (
    <div className="page">
      <div className="container" style={{ padding: '32px 24px' }}>
        <div className="section-header">
          <h1 className="section-title">Agent Operations Centre</h1>
          <div className="section-subtitle">Heritage Orchestrator and all specialized agents — real execution history from database</div>
        </div>

        {error && <ErrorBar message={error} onRetry={loadRuns} />}

        {/* System status */}
        {agentsInfo && (
          <div className="alert-bar alert-bar-info" style={{ marginBottom: 24 }}>
            System mode: {agentsInfo.demo_mode ? <strong>DEMO / CONTROLLED FALLBACK</strong> : <strong>LIVE (IBM Granite active)</strong>}
            &nbsp;·&nbsp; IBM Granite: {agentsInfo.granite_available ? '✓ Active' : '✗ Not configured — using deterministic fallback'}
          </div>
        )}

        {/* Agent registry */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Registered Agents</h2>
          {loadingInfo ? (
            <div className="loading-overlay"><Spinner /><span>Loading…</span></div>
          ) : (
            <div className="grid-3">
              {agentsInfo?.agents.map(agent => (
                <div key={agent.id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{agent.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Priority: {agent.priority}</div>
                    </div>
                    <span style={{ padding: '2px 8px', background: '#dcfce7', color: '#166534', borderRadius: 12, fontSize: 11, fontWeight: 600 }}>{agent.status}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>{agent.role}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Run statistics */}
        <div className="grid-4" style={{ marginBottom: 24 }}>
          {[
            { label: 'Total Runs', value: stats.total },
            { label: 'Successful', value: stats.success },
            { label: 'Failed', value: stats.failed },
            { label: 'Avg Duration', value: `${stats.avgMs.toFixed(0)}ms` },
          ].map(s => (
            <div key={s.label} className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 700 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Execution Timeline</div>
              <div className="card-subtitle">Actual agent runs persisted in database — {runs.length} records</div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                className="form-control"
                style={{ width: 180, fontSize: 13 }}
                placeholder="Filter by agent…"
                value={filterAgent}
                onChange={e => setFilterAgent(e.target.value)}
                aria-label="Filter agent runs"
              />
              <button className="btn btn-secondary btn-sm" onClick={loadRuns} disabled={loadingRuns}>↻</button>
            </div>
          </div>
          {loadingRuns ? (
            <div className="loading-overlay"><Spinner /><span>Loading run history…</span></div>
          ) : (
            <AgentTimeline runs={filteredRuns.slice(0, 50)} />
          )}
        </div>
      </div>
    </div>
  )
}
