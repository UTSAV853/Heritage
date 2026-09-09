import { useEffect, useState } from 'react'
import { getSites, getAlerts, getVisitorFlow, generateConservationReport } from '../services/api'
import type { Site, Alert, VisitorFlowResult, ConservationReport } from '../types/api'
import { StatusBadge, Spinner, ErrorBar, DemoBanner, HumanVerificationWarning } from '../components/StatusBadge'
import { Link } from 'react-router-dom'

export default function DashboardPage() {
  const [sites, setSites] = useState<Site[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [flows, setFlows] = useState<Record<string, VisitorFlowResult>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [generatingReport, setGeneratingReport] = useState<string | null>(null)
  const [reports, setReports] = useState<Record<string, ConservationReport>>({})

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const [sitesData, alertsData] = await Promise.all([getSites(), getAlerts()])
      setSites(sitesData)
      setAlerts(alertsData)
      // Load flow for each site
      const flowResults: Record<string, VisitorFlowResult> = {}
      await Promise.all(sitesData.map(async s => {
        try {
          flowResults[s.id] = await getVisitorFlow(s.id)
        } catch {}
      }))
      setFlows(flowResults)
    } catch (e: any) {
      setError(e?.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleGenerateReport = async (siteId: string) => {
    setGeneratingReport(siteId)
    try {
      const report = await generateConservationReport(siteId)
      setReports(prev => ({ ...prev, [siteId]: report }))
    } catch (e: any) {
      alert('Report generation failed: ' + (e?.message || 'unknown'))
    } finally {
      setGeneratingReport(null)
    }
  }

  const pendingAlerts = alerts.filter(a => a.status === 'PENDING_REVIEW')
  const highPressure = Object.values(flows).filter(f => f.status === 'HIGH' || f.status === 'CRITICAL').length

  return (
    <div className="page">
      <div className="container" style={{ padding: '32px 24px' }}>
        <DemoBanner />
        <HumanVerificationWarning />

        <div style={{ marginBottom: 24 }}>
          <h1 className="section-title">Conservation Dashboard</h1>
          <div className="section-subtitle">Heritage site monitoring and decision support — Gujarat Heritage Authority</div>
        </div>

        {error && <ErrorBar message={error} onRetry={load} />}
        {loading && <div className="loading-overlay"><Spinner size={28} /><span>Loading dashboard…</span></div>}

        {!loading && (
          <>
            {/* Summary KPIs */}
            <div className="grid-4" style={{ marginBottom: 28 }}>
              {[
                { label: 'Total Sites', value: sites.length, color: 'var(--text)' },
                { label: 'Sites Requiring Attention', value: reports ? Object.values(reports).filter(r => r.priority === 'HIGH' || r.priority === 'CRITICAL').length : '—', color: 'var(--warn)' },
                { label: 'High Visitor Pressure', value: highPressure, color: highPressure > 0 ? '#ea580c' : 'var(--ok)' },
                { label: 'Pending Alerts', value: pendingAlerts.length, color: pendingAlerts.length > 0 ? 'var(--danger)' : 'var(--ok)' },
              ].map(kpi => (
                <div key={kpi.label} className="card" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 36, fontWeight: 700, color: kpi.color }}>{kpi.value}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{kpi.label}</div>
                </div>
              ))}
            </div>

            {/* Site Cards */}
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Heritage Sites</h2>
            <div className="grid-2" style={{ marginBottom: 28 }}>
              {sites.map(site => {
                const flow = flows[site.id]
                const report = reports[site.id]
                const siteAlerts = alerts.filter(a => a.site_id === site.id && a.status === 'PENDING_REVIEW')

                return (
                  <div key={site.id} className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 16 }}>{site.name}</div>
                        <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>{site.location}</div>
                      </div>
                      {report && <StatusBadge value={report.priority} />}
                    </div>

                    <div className="grid-2" style={{ gap: 10, marginBottom: 12 }}>
                      <div style={{ padding: '10px', background: 'var(--surface)', borderRadius: 6 }}>
                        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 2 }}>Visitor Pressure</div>
                        <div style={{ fontWeight: 600 }}>
                          {flow ? <StatusBadge value={flow.status} /> : <span style={{ color: 'var(--muted)', fontSize: 13 }}>Loading…</span>}
                        </div>
                        {flow && <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{flow.occupancy_percent.toFixed(1)}% · {flow.trend}</div>}
                      </div>
                      <div style={{ padding: '10px', background: 'var(--surface)', borderRadius: 6 }}>
                        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 2 }}>Pending Alerts</div>
                        <div style={{ fontWeight: 700, fontSize: 20, color: siteAlerts.length > 0 ? 'var(--danger)' : 'var(--ok)' }}>
                          {siteAlerts.length}
                        </div>
                      </div>
                    </div>

                    {report && (
                      <div style={{ padding: '10px 12px', background: 'var(--surface)', borderRadius: 6, marginBottom: 12, fontSize: 13, lineHeight: 1.6 }}>
                        {report.summary?.slice(0, 200)}…
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link to={`/dashboard/visitor-flow?site=${site.id}`}>
                        <button className="btn btn-secondary btn-sm">Visitor Flow</button>
                      </Link>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleGenerateReport(site.id)}
                        disabled={generatingReport === site.id}
                      >
                        {generatingReport === site.id ? <><Spinner size={14} /> Generating…</> : '📋 Generate Report'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Recent Alerts */}
            {pendingAlerts.length > 0 && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 600 }}>Active Alerts ({pendingAlerts.length})</h2>
                  <Link to="/dashboard/alerts"><button className="btn btn-secondary btn-sm">View All</button></Link>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {pendingAlerts.slice(0, 3).map(alert => (
                    <div key={alert.id} className="card" style={{ borderLeft: `4px solid ${alert.severity === 'CRITICAL' ? 'var(--danger)' : alert.severity === 'HIGH' ? '#ea580c' : alert.severity === 'MODERATE' ? 'var(--warn)' : 'var(--ok)'}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                        <div>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                            <StatusBadge value={alert.severity} />
                            <span style={{ fontWeight: 600, fontSize: 14 }}>{alert.title}</span>
                          </div>
                          <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{alert.site_name} · {alert.agent}</div>
                        </div>
                        {alert.human_verification_required && <span className="human-badge">Human Review Required</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
