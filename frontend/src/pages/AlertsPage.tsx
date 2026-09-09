import { useEffect, useState } from 'react'
import { getAlerts, updateAlertStatus } from '../services/api'
import type { Alert } from '../types/api'
import { StatusBadge, Spinner, ErrorBar, DemoBanner, HumanVerificationWarning } from '../components/StatusBadge'

const SEVERITY_ORDER: Record<string, number> = { CRITICAL: 0, HIGH: 1, MODERATE: 2, LOW: 3 }

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<string>('ALL')
  const [updating, setUpdating] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getAlerts()
      setAlerts(data.sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]))
    } catch (e: any) {
      setError(e?.message || 'Failed to load alerts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleStatusUpdate = async (alertId: string, newStatus: string) => {
    setUpdating(alertId)
    try {
      await updateAlertStatus(alertId, newStatus)
      setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: newStatus } : a))
    } catch (e: any) {
      alert('Failed to update status: ' + (e?.message || 'unknown error'))
    } finally {
      setUpdating(null)
    }
  }

  const filtered = filter === 'ALL' ? alerts : alerts.filter(a =>
    filter === 'PENDING' ? a.status === 'PENDING_REVIEW' : a.severity === filter
  )

  return (
    <div className="page">
      <div className="container" style={{ padding: '32px 24px' }}>
        <DemoBanner />
        <HumanVerificationWarning />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <div className="section-header" style={{ marginBottom: 0 }}>
            <h1 className="section-title">Conservation Alerts</h1>
            <div className="section-subtitle">{alerts.length} total · {alerts.filter(a => a.status === 'PENDING_REVIEW').length} pending review</div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['ALL', 'PENDING', 'CRITICAL', 'HIGH', 'MODERATE', 'LOW'].map(f => (
              <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFilter(f)} aria-pressed={filter === f}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {error && <ErrorBar message={error} onRetry={load} />}
        {loading && <div className="loading-overlay"><Spinner size={28} /><span>Loading alerts…</span></div>}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
            No alerts found for this filter.
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(alert => (
            <article key={alert.id} className="card" role="article" aria-label={`Alert: ${alert.title}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                    <StatusBadge value={alert.severity} />
                    <span style={{ fontWeight: 600, fontSize: 15 }}>{alert.title}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>
                    {alert.site_name} · {alert.agent} · {new Date(alert.timestamp).toLocaleString()}
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--text)', marginBottom: 12, lineHeight: 1.65 }}>{alert.description}</p>

                  {alert.evidence.length > 0 && (
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 4 }}>EVIDENCE</div>
                      <ul style={{ listStyle: 'none', padding: 0 }}>
                        {alert.evidence.map((e, i) => (
                          <li key={i} style={{ fontSize: 13, color: 'var(--text)', padding: '3px 0', borderBottom: '1px solid var(--surface2)' }}>
                            · {e}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {alert.recommendation && (
                    <div style={{ padding: '8px 12px', background: 'var(--surface)', borderRadius: 6, fontSize: 13 }}>
                      <strong>Recommendation:</strong> {alert.recommendation}
                    </div>
                  )}

                  {alert.human_verification_required && (
                    <div style={{ marginTop: 8 }}>
                      <span className="human-badge">👤 Human Verification Required</span>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 160 }}>
                  <div style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'right' }}>Status</div>
                  <select
                    className="form-control form-select"
                    style={{ fontSize: 13 }}
                    value={alert.status}
                    onChange={e => handleStatusUpdate(alert.id, e.target.value)}
                    disabled={updating === alert.id}
                    aria-label="Update alert status"
                  >
                    <option value="PENDING_REVIEW">Pending Review</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                  </select>
                  <div style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'right' }}>{alert.data_source}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
