import { useEffect, useState } from 'react'
import { getSiteConservationHistory, generateConservationReport, getSites } from '../services/api'
import type { Site, ConservationReport } from '../types/api'
import { StatusBadge, Spinner, ErrorBar, DemoBanner, HumanVerificationWarning } from '../components/StatusBadge'

export default function ReportsPage() {
  const [sites, setSites] = useState<Site[]>([])
  const [selectedSite, setSelectedSite] = useState('site-modhera-001')
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')
  const [newReport, setNewReport] = useState<ConservationReport | null>(null)

  useEffect(() => {
    getSites().then(setSites).catch(() => {})
    loadHistory(selectedSite)
  }, [])

  const loadHistory = async (siteId: string) => {
    setLoading(true)
    setError('')
    try {
      const data = await getSiteConservationHistory(siteId)
      setReports(data)
    } catch (e: any) {
      setError(e?.message || 'Failed to load reports')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async () => {
    setGenerating(true)
    setError('')
    setNewReport(null)
    try {
      const report = await generateConservationReport(selectedSite)
      setNewReport(report)
      loadHistory(selectedSite)
    } catch (e: any) {
      setError(e?.message || 'Failed to generate report')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="page">
      <div className="container" style={{ padding: '32px 24px' }}>
        <DemoBanner />
        <HumanVerificationWarning />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 className="section-title">Conservation Reports</h1>
            <div className="section-subtitle">AI decision-support — all reports require human expert review</div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <select className="form-control form-select" style={{ width: 240 }} value={selectedSite}
              onChange={e => { setSelectedSite(e.target.value); loadHistory(e.target.value) }} aria-label="Select site">
              {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <button className="btn btn-primary" onClick={handleGenerate} disabled={generating}>
              {generating ? <><Spinner size={16} /> Generating…</> : '📋 Generate New Report'}
            </button>
          </div>
        </div>

        {error && <ErrorBar message={error} onRetry={() => loadHistory(selectedSite)} />}

        {/* New report */}
        {newReport && (
          <div className="card" style={{ marginBottom: 24, border: '2px solid var(--accent)' }}>
            <div className="card-header">
              <div>
                <div className="card-title">✦ New Report Generated</div>
                <div className="card-subtitle">{newReport.site} · {newReport.data_source}</div>
              </div>
              <StatusBadge value={newReport.priority} />
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>{newReport.summary}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {newReport.recommendations.slice(0, 4).map((rec: any, i: number) => (
                <div key={i} style={{ padding: '10px 14px', background: 'var(--surface)', borderRadius: 6 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{i + 1}. {rec.action}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)' }}>{rec.rationale}</div>
                  {rec.human_verification_required && <span className="human-badge" style={{ marginTop: 6, display: 'inline-block' }}>Human Verification Required</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History */}
        <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Report History ({reports.length})</h2>
        {loading ? (
          <div className="loading-overlay"><Spinner /><span>Loading reports…</span></div>
        ) : reports.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--muted)' }}>
            No reports yet. Generate your first report above.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {reports.map((r: any) => (
              <div key={r.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                      <StatusBadge value={r.priority} />
                      <span style={{ fontSize: 12, color: 'var(--muted)' }}>{new Date(r.created_at).toLocaleString()}</span>
                    </div>
                    <div style={{ fontSize: 14, color: 'var(--text)', maxWidth: 700 }}>{r.summary?.slice(0, 250)}…</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>
                      Visitor: {r.visitor_flow_status || '—'} · Structural: {r.structural_status || '—'} · Encroachment: {r.encroachment_status || '—'}
                    </div>
                  </div>
                  <span className="demo-badge">{r.data_source}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
