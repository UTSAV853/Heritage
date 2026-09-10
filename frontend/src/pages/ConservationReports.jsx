import React, { useState, useEffect } from 'react'
import { FileText, RefreshCw, Download, AlertCircle, CheckCircle, Cpu, Shield, Users, AlertTriangle, Zap } from 'lucide-react'
import { getConservationReport, getConservationDemo, getSites } from '../api/client'
import toast from 'react-hot-toast'

const RISK_COLORS = {
  Healthy: '#16a34a', Low: '#22c55e', Moderate: '#eab308', High: '#f97316', Critical: '#ef4444'
}

function WorkflowStep({ step, status, agent, message }) {
  const statusColor = {
    DETECTED: 'text-orange-400', ALERT: 'text-orange-400', FLAGGED: 'text-yellow-400',
    CORRELATED: 'text-purple-400', REASONING: 'text-purple-300',
    TASK_CREATED: 'text-blue-400', COMPLETE: 'text-green-400'
  }
  return (
    <div className="flex items-start gap-3 p-2.5 bg-slate-800/50 rounded-lg border border-slate-700/50">
      <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 flex-shrink-0">
        {step}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-300">{agent}</span>
          <span className={`badge badge-gray text-xs ${statusColor[status] || 'text-slate-400'}`}>{status}</span>
        </div>
        <div className="text-xs text-slate-400 mt-0.5">{message}</div>
      </div>
    </div>
  )
}

export default function ConservationReports() {
  const [sites, setSites] = useState([])
  const [selectedSiteId, setSelectedSiteId] = useState(1)
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [scenarioResult, setScenarioResult] = useState(null)

  useEffect(() => {
    getSites().then(res => setSites(res.data))
    loadDemo()
  }, [])

  const loadDemo = async () => {
    setLoading(true)
    try {
      const res = await getConservationDemo()
      setReport(res.data)
    } catch { toast.error('Failed to load demo report') }
    finally { setLoading(false) }
  }

  const generateReport = async () => {
    setLoading(true)
    try {
      const res = await getConservationReport(selectedSiteId)
      setReport(res.data)
      toast.success('Conservation report generated!')
    } catch { toast.error('Report generation failed') }
    finally { setLoading(false) }
  }

  const downloadJSON = () => {
    if (!report) return
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url
    a.download = `conservation_report_${report.report_id || 'export'}.json`; a.click()
    URL.revokeObjectURL(url)
  }

  const downloadCSV = async () => {
    if (!selectedSiteId) return
    try {
      const res = await getConservationReport(selectedSiteId, 'csv')
      const blob = new Blob([res.data], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a'); a.href = url
      a.download = `conservation_report_${selectedSiteId}.csv`; a.click()
    } catch { toast.error('CSV download failed') }
  }

  const riskColor = report?.overall_risk ? (RISK_COLORS[report.overall_risk.level] || '#eab308') : '#eab308'

  return (
    <div className="space-y-5 fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Conservation Reports</h1>
          <p className="text-slate-400 text-sm mt-1">AI-generated multi-agent conservation reports for heritage authorities</p>
        </div>
        <div className="flex items-center gap-2">
          {report && (
            <>
              <button onClick={downloadJSON} className="btn-secondary text-sm">
                <Download size={14} /> JSON
              </button>
              <button onClick={downloadCSV} className="btn-secondary text-sm">
                <Download size={14} /> CSV
              </button>
            </>
          )}
        </div>
      </div>

      <div className="ai-disclaimer">
        <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
        <div>
          AI-generated reports are informational tools. Structural observations are NOT certified engineering assessments.
          Encroachment detections require official field verification. All recommendations need professional review before action.
        </div>
      </div>

      {/* Generate controls */}
      <div className="card">
        <div className="section-title mb-4"><FileText size={16} className="text-blue-400" /> Generate Report</div>
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={selectedSiteId}
            onChange={e => setSelectedSiteId(+e.target.value)}
            className="select-field w-auto"
          >
            {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <button onClick={generateReport} disabled={loading} className="btn-primary">
            {loading ? <><RefreshCw size={14} className="animate-spin" /> Generating...</> : <><Zap size={14} /> Generate Multi-Agent Report</>}
          </button>
          <button onClick={loadDemo} disabled={loading} className="btn-secondary">Demo Report</button>
        </div>
      </div>

      {loading && (
        <div className="card flex flex-col items-center justify-center h-48 gap-4">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <div className="text-slate-400 text-center text-sm">
            <div>Coordinating all agents...</div>
            <div className="text-xs text-slate-500 mt-1">Structural + Visitor + Encroachment + Granite LLM</div>
          </div>
        </div>
      )}

      {report && !loading && (
        <div className="space-y-5 slide-in">
          {/* Report header */}
          <div className="card border" style={{ borderColor: `${riskColor}44` }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-xs text-slate-500 mb-1">Report ID: {report.report_id}</div>
                <div className="text-xl font-bold text-slate-100">{report.site_name}</div>
                <div className="text-sm text-slate-400">{report.report_date}</div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold" style={{ color: riskColor }}>
                  {report.overall_risk?.level}
                </div>
                <div className="text-sm text-slate-400">Overall Risk</div>
                <div className="text-sm font-semibold text-slate-300 mt-0.5">Score: {report.overall_risk?.score}/100</div>
              </div>
            </div>

            {/* Executive summary */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Cpu size={13} className="text-purple-400" />
                <span className="text-xs font-semibold text-purple-400">IBM Granite Executive Summary</span>
              </div>
              <div className="granite-output text-sm">{report.executive_summary}</div>
            </div>
          </div>

          {/* Three columns: Structural, Visitor, Encroachment */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <Shield size={14} className="text-orange-400" />
                <div className="text-sm font-semibold text-slate-200">Structural Health</div>
              </div>
              <div className="text-2xl font-bold mb-1" style={{ color: report.structural_health?.score > 60 ? '#f97316' : report.structural_health?.score > 40 ? '#eab308' : '#22c55e' }}>
                {report.structural_health?.score?.toFixed(0)}/100
              </div>
              <div className="text-xs text-slate-400">{report.structural_health?.status}</div>
              <div className="text-xs text-slate-500 mt-1">{report.structural_health?.issues_count} issues detected</div>
              <div className="badge badge-orange mt-2">Priority: {report.structural_health?.priority}</div>
            </div>

            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <Users size={14} className="text-blue-400" />
                <div className="text-sm font-semibold text-slate-200">Visitor Conditions</div>
              </div>
              <div className="text-2xl font-bold mb-1 text-blue-400">{report.visitor_conditions?.occupancy_pct?.toFixed(0)}%</div>
              <div className="text-xs text-slate-400">Occupancy — {report.visitor_conditions?.crowd_level} level</div>
              <div className="text-xs text-slate-500 mt-1">{report.visitor_conditions?.current_count} visitors</div>
              {report.visitor_conditions?.is_simulated && (
                <div className="badge badge-gray mt-2">⚠️ Simulated</div>
              )}
            </div>

            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={14} className="text-orange-400" />
                <div className="text-sm font-semibold text-slate-200">Encroachment</div>
              </div>
              {report.encroachment_alerts?.detected ? (
                <>
                  <div className="text-sm font-bold text-orange-400 mb-1">Potential Alert</div>
                  <div className="text-xs text-slate-400">{report.encroachment_alerts?.type}</div>
                  <div className="text-xs text-slate-500 mt-1">Severity: {report.encroachment_alerts?.severity}</div>
                  <div className="badge badge-orange mt-2">{Math.round(report.encroachment_alerts?.confidence * 100)}% confidence</div>
                </>
              ) : (
                <>
                  <CheckCircle size={20} className="text-green-400 mb-1" />
                  <div className="text-sm text-green-400">No alerts</div>
                </>
              )}
            </div>
          </div>

          {/* Cross-agent correlations */}
          {report.cross_agent_correlations?.length > 0 && (
            <div className="card border border-heritage-800/40 bg-heritage-950/10">
              <div className="section-title mb-3">
                <Zap size={15} className="text-heritage-400" />
                Cross-Agent Correlations (Granite AI)
              </div>
              {report.cross_agent_correlations.map((corr, idx) => (
                <div key={idx} className="mb-3 p-3 bg-slate-800/50 rounded-lg border border-heritage-800/30">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`badge ${corr.severity === 'High' ? 'badge-orange' : 'badge-yellow'}`}>{corr.severity}</span>
                    <span className="text-xs font-semibold text-heritage-300">{corr.type}</span>
                  </div>
                  <div className="text-sm text-slate-300 mb-2">{corr.message}</div>
                  <div className="text-xs text-slate-400 font-medium">→ {corr.action}</div>
                </div>
              ))}
            </div>
          )}

          {/* Recommended actions */}
          <div className="card">
            <div className="section-title mb-3">Recommended Actions</div>
            <div className="space-y-2">
              {report.recommended_actions?.map((action, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <div className={`badge flex-shrink-0 ${
                    action.priority === 'Urgent' || action.priority === 'Immediate' ? 'badge-red' :
                    action.priority === 'High' ? 'badge-orange' :
                    action.priority === 'Medium' ? 'badge-yellow' : 'badge-gray'
                  }`}>{action.priority}</div>
                  <div className="flex-1">
                    <div className="text-sm text-slate-200">{action.action}</div>
                    <div className="text-xs text-slate-500 mt-0.5">Dept: {action.dept} · Deadline: {action.deadline}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="ai-disclaimer">
            <AlertCircle size={12} className="flex-shrink-0 mt-0.5" />
            <span className="text-xs">{report.disclaimer}</span>
          </div>
        </div>
      )}
    </div>
  )
}
