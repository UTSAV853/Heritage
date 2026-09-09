import type { AgentRunSummary } from '../types/api'
import { Spinner } from './StatusBadge'

const AGENT_ICONS: Record<string, string> = {
  'Heritage Orchestrator': '⬡',
  'Visitor Flow Agent': '👥',
  'Heritage Storytelling Agent': '📖',
  'Structural Health Agent': '🏛',
  'Encroachment Detection Agent': '🗺',
  'Conservation Reporting Agent': '📋',
}

const STATUS_LABELS: Record<string, string> = {
  SUCCESS: 'Success',
  FAILED: 'Failed',
  RUNNING: 'Running',
  PENDING: 'Pending',
  SKIPPED: 'Skipped',
}

interface AgentTimelineProps {
  runs: AgentRunSummary[]
  loading?: boolean
}

export default function AgentTimeline({ runs, loading }: AgentTimelineProps) {
  if (loading) {
    return (
      <div className="loading-overlay">
        <Spinner size={28} />
        <span>Agents executing…</span>
      </div>
    )
  }

  if (!runs.length) {
    return (
      <div style={{ color: 'var(--muted)', padding: '24px 0', fontSize: 14 }}>
        No agent runs to display.
      </div>
    )
  }

  return (
    <div className="timeline" aria-label="Agent execution timeline">
      {runs.map((run, i) => {
        const icon = AGENT_ICONS[run.agent] || '🤖'
        const isRunning = run.status === 'RUNNING' || run.status === 'PENDING'
        const time = run.start_time
          ? new Date(run.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
          : ''

        return (
          <div key={run.id} className="timeline-item">
            <div className="timeline-line" aria-hidden="true" />
            <div className={`timeline-dot ${run.status}`} aria-hidden="true">
              {isRunning ? <Spinner size={14} /> : icon}
            </div>
            <div className="timeline-content">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{run.agent}</span>
                <span className={`pressure-badge pressure-${run.status === 'SUCCESS' ? 'LOW' : run.status === 'FAILED' ? 'CRITICAL' : run.status === 'SKIPPED' ? 'MODERATE' : 'MODERATE'}`}
                  style={{ fontSize: 11 }} aria-label={'Agent status: ' + run.status}>
                  {STATUS_LABELS[run.status] || run.status}
                </span>
                {run.duration_ms !== undefined && run.duration_ms !== null && (
                  <span style={{ fontSize: 12, color: 'var(--muted)' }}>{run.duration_ms}ms</span>
                )}
              </div>
              {time && (
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                  <time>{time}</time>
                </div>
              )}
              {run.output_summary && (
                <div style={{ fontSize: 13, color: 'var(--text)', marginTop: 6, padding: '6px 10px', background: 'var(--surface)', borderRadius: 6 }}>
                  {run.output_summary}
                </div>
              )}
              {run.error && (
                <div style={{ fontSize: 13, color: 'var(--danger)', marginTop: 6, padding: '6px 10px', background: '#fee2e2', borderRadius: 6 }}>
                  Error: {run.error}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
