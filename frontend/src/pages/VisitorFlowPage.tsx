import { useEffect, useState } from 'react'
import { getVisitorFlow } from '../services/api'
import type { VisitorFlowResult } from '../types/api'
import { StatusBadge, ProgressBar, Spinner, ErrorBar, DemoBanner } from '../components/StatusBadge'
import { VisitorTimeSeries, ZoneBarChart } from '../components/Charts'

const SITES = [
  { id: 'site-modhera-001', name: 'Modhera Sun Temple' },
  { id: 'site-ahmedabad-001', name: 'Ahmedabad Walled City' },
]

function generateTimeSeriesData(currentVisitors: number, capacity: number) {
  const data = []
  const now = new Date()
  for (let i = 11; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 30 * 60 * 1000)
    const hour = t.getHours()
    let base = currentVisitors
    if (i > 8) base = Math.floor(currentVisitors * 0.4)
    else if (i > 4) base = Math.floor(currentVisitors * 0.75)
    const jitter = Math.floor((Math.random() - 0.5) * 30)
    data.push({
      time: t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      visitors: Math.max(0, Math.min(base + jitter, capacity)),
      capacity,
    })
  }
  return data
}

export default function VisitorFlowPage() {
  const [siteId, setSiteId] = useState('site-modhera-001')
  const [flow, setFlow] = useState<VisitorFlowResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedZone, setSelectedZone] = useState<string | null>(null)

  const load = async (id: string) => {
    setLoading(true)
    setError('')
    try {
      const data = await getVisitorFlow(id)
      setFlow(data)
      setSelectedZone(null)
    } catch (e: any) {
      setError(e?.response?.data?.detail || e?.message || 'Failed to load visitor data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load(siteId) }, [siteId])

  const timeData = flow ? generateTimeSeriesData(flow.current_visitors, flow.capacity) : []

  return (
    <div className="page">
      <div className="container" style={{ padding: '32px 24px' }}>
        <DemoBanner />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <div className="section-header" style={{ marginBottom: 0 }}>
            <h1 className="section-title">Visitor Flow Monitor</h1>
            <div className="section-subtitle">Real-time pressure analysis — simulated demo data</div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <select className="form-control form-select" style={{ width: 240 }} value={siteId} onChange={e => setSiteId(e.target.value)} aria-label="Select heritage site">
              {SITES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <button className="btn btn-secondary btn-sm" onClick={() => load(siteId)} disabled={loading}>↻ Refresh</button>
          </div>
        </div>

        {error && <ErrorBar message={error} onRetry={() => load(siteId)} />}
        {loading && <div className="loading-overlay"><Spinner size={28} /><span>Loading visitor data…</span></div>}

        {flow && !loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* KPI cards */}
            <div className="grid-4">
              {[
                { label: 'Current Visitors', value: flow.current_visitors.toString(), sub: `of ${flow.capacity} capacity` },
                { label: 'Occupancy', value: flow.occupancy_percent.toFixed(1) + '%', sub: flow.status },
                { label: 'Trend', value: flow.trend === 'INCREASING' ? '↑ Rising' : flow.trend === 'DECREASING' ? '↓ Falling' : '→ Stable', sub: 'Last 2 hours' },
                { label: 'Critical Zones', value: flow.critical_zones.length.toString(), sub: flow.critical_zones.length ? flow.critical_zones[0] : 'None' },
              ].map(kpi => (
                <div key={kpi.label} className="card" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>{kpi.value}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{kpi.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>{kpi.sub}</div>
                </div>
              ))}
            </div>

            {/* Overall pressure */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">Overall Visitor Pressure</div>
                <StatusBadge value={flow.status} />
              </div>
              <ProgressBar
                percent={flow.occupancy_percent}
                status={flow.status}
                label={`${flow.current_visitors} visitors / ${flow.capacity} capacity`}
              />
              <div style={{ marginTop: 12, fontSize: 14, color: 'var(--text)', padding: '10px 14px', background: 'var(--surface)', borderRadius: 6 }}>
                {flow.reason}
              </div>
            </div>

            {/* Time series */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">Visitor Count Over Time</div>
                <span className="demo-badge">SIMULATED DATA</span>
              </div>
              <VisitorTimeSeries data={timeData} />
            </div>

            {/* Zones */}
            <div className="grid-2">
              <div className="card">
                <div className="card-header"><div className="card-title">Zone Occupancy</div></div>
                <ZoneBarChart zones={flow.zone_breakdown} />
              </div>
              <div className="card">
                <div className="card-header"><div className="card-title">Zone Details</div></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {flow.zone_breakdown.map(z => (
                    <div
                      key={z.zone_id}
                      className={`zone-card${selectedZone === z.zone_id ? ' selected' : ''}`}
                      onClick={() => setSelectedZone(selectedZone === z.zone_id ? null : z.zone_id)}
                      role="button"
                      aria-expanded={selectedZone === z.zone_id}
                      tabIndex={0}
                      onKeyDown={e => e.key === 'Enter' && setSelectedZone(selectedZone === z.zone_id ? null : z.zone_id)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <span style={{ fontWeight: 500, fontSize: 14 }}>{z.zone_name}</span>
                        <StatusBadge value={z.pressure} />
                      </div>
                      <ProgressBar percent={z.occupancy_percent} status={z.pressure} />
                      {selectedZone === z.zone_id && (
                        <div style={{ marginTop: 12, fontSize: 13, color: 'var(--muted)' }}>
                          <div>Visitors: {z.visitors} / {z.capacity}</div>
                          <div>Occupancy: {z.occupancy_percent.toFixed(1)}%</div>
                          <div style={{ marginTop: 6, padding: '6px 10px', background: 'var(--surface)', borderRadius: 6, color: 'var(--text)' }}>
                            {z.pressure === 'HIGH' || z.pressure === 'CRITICAL'
                              ? 'High pressure zone — consider redirecting visitors to lower-pressure areas.'
                              : 'Normal visitor levels — suitable for additional visitor redistribution.'}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center' }}>
              Confidence: {(flow.confidence * 100).toFixed(0)}% · {flow.ai_enhanced ? 'AI-enhanced' : 'Deterministic'} · Data: {flow.data_source}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
