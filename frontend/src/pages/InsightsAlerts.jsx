import React, { useState, useEffect } from 'react'
import {
  Bell, ShieldAlert, CheckCircle, AlertTriangle, Eye,
  Sparkles, FileText, Check, X, RefreshCw, Layers, Calculator, ArrowRight
} from 'lucide-react'
import { getUnifiedAlerts, getUnifiedInsights, reviewUnifiedAlert } from '../api/client'

export default function InsightsAlerts() {
  const [alerts, setAlerts] = useState([])
  const [insights, setInsights] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('alerts') // 'alerts' or 'insights'
  const [evidenceModal, setEvidenceModal] = useState(null)
  const [reviewModal, setReviewModal] = useState(null)
  const [reviewAction, setReviewAction] = useState('ACKNOWLEDGED')
  const [reviewerNotes, setReviewerNotes] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)
  const [actionMessage, setActionMessage] = useState(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [alertsRes, insightsRes] = await Promise.all([
        getUnifiedAlerts(),
        getUnifiedInsights()
      ])
      setAlerts(alertsRes.data || [])
      setInsights(insightsRes.data || [])
    } catch (err) {
      console.error('Failed to load alerts & insights', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!reviewModal) return

    try {
      setSubmittingReview(true)
      await reviewUnifiedAlert(reviewModal.id, {
        status: reviewAction,
        reviewer_notes: reviewerNotes || 'Verified by conservation officer through dashboard action.'
      })
      setActionMessage(`Alert #${reviewModal.id} status updated to ${reviewAction}`)
      setReviewModal(null)
      setReviewerNotes('')
      await fetchData()
      setTimeout(() => setActionMessage(null), 5000)
    } catch (err) {
      console.error('Failed to submit review', err)
      setActionMessage('Failed to update alert review status.')
    } finally {
      setSubmittingReview(false)
    }
  }

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'Critical':
        return <span className="badge badge-red">Critical</span>
      case 'High':
        return <span className="badge badge-orange">High</span>
      case 'Moderate':
        return <span className="badge badge-yellow">Moderate</span>
      default:
        return <span className="badge badge-green">Low</span>
    }
  }

  const getReviewStatusBadge = (status) => {
    switch (status) {
      case 'ACKNOWLEDGED':
        return <span className="badge badge-green">Acknowledged</span>
      case 'DISMISSED':
        return <span className="badge badge-gray">Resolved / Closed</span>
      case 'REQUIRES_HUMAN_REVIEW':
        return (
          <span className="badge badge-red flex items-center gap-1">
            <AlertTriangle size={11} /> Human Review Required
          </span>
        )
      default:
        return (
          <span className="badge badge-yellow flex items-center gap-1">
            <Bell size={11} /> Pending Review
          </span>
        )
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bell className="text-heritage-400" size={26} />
            Unified Alerts & Traceable Insights
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Deterministic anomaly triggers, multi-source conflict reconciliation, and evidence-traceable conservation intelligence.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="btn-secondary text-xs px-3 py-2 flex items-center gap-1.5"
            disabled={loading}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh Alerts
          </button>
        </div>
      </div>

      {/* Action Toast */}
      {actionMessage && (
        <div className="p-3 rounded-lg bg-green-950/40 border border-green-800 text-green-300 text-xs flex items-center justify-between">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-4 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('alerts')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'alerts'
              ? 'border-heritage-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldAlert size={16} />
          Active Conservation Alerts ({alerts.filter(a => a.human_review_status !== 'DISMISSED').length})
        </button>
        <button
          onClick={() => setActiveTab('insights')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'insights'
              ? 'border-heritage-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles size={16} />
          Traceable Intelligence Insights ({insights.length})
        </button>
      </div>

      {/* TAB 1: ALERTS */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`card border transition-all ${
                alert.severity === 'Critical'
                  ? 'border-red-800/80 bg-red-950/10'
                  : alert.severity === 'High'
                  ? 'border-orange-800/80 bg-orange-950/10'
                  : 'border-slate-800 bg-slate-900/60'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {getSeverityBadge(alert.severity)}
                    {getReviewStatusBadge(alert.human_review_status)}
                    <span className="badge badge-gray font-mono text-[11px]">{alert.detection_method}</span>
                    <span className="text-xs text-slate-400">
                      {new Date(alert.created_at).toLocaleString()}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">
                    {alert.title}
                  </h3>

                  <div className="text-xs text-heritage-400 font-semibold">
                    📍 {alert.site_name || `Site #${alert.site_id}`}
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    {alert.description}
                  </p>

                  <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 text-xs">
                    <span className="text-slate-400 font-medium uppercase tracking-wider block mb-1">
                      Recommended Conservation Protocol:
                    </span>
                    <span className="text-emerald-300 font-medium">
                      {alert.recommended_action}
                    </span>
                  </div>
                </div>

                <div className="flex flex-row lg:flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => setEvidenceModal(alert)}
                    className="btn-secondary text-xs px-3 py-2 flex items-center justify-center gap-1.5"
                  >
                    <Eye size={14} />
                    View Evidence
                  </button>

                  <button
                    onClick={() => setReviewModal(alert)}
                    className="btn-primary text-xs px-3 py-2 flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle size={14} />
                    Human Review
                  </button>
                </div>
              </div>
            </div>
          ))}

          {alerts.length === 0 && !loading && (
            <div className="card p-8 text-center text-slate-400">
              No active conservation alerts detected. Monuments are operating within normal baseline limits.
            </div>
          )}
        </div>
      )}

      {/* TAB 2: TRACEABLE INSIGHTS */}
      {activeTab === 'insights' && (
        <div className="space-y-4">
          {insights.map((insight) => (
            <div key={insight.id} className="card border border-slate-800 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="badge badge-purple">{insight.insight_category}</span>
                    <span className="badge badge-blue">Priority: {insight.priority}</span>
                    <span className="text-xs text-slate-400">
                      Uncertainty Margin: ±{(insight.uncertainty * 100).toFixed(1)}%
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">{insight.title}</h3>
                  <div className="text-xs text-heritage-400 font-medium">
                    📍 {insight.site_name || `Site #${insight.site_id}`}
                  </div>
                </div>

                <button
                  onClick={() => setEvidenceModal(insight)}
                  className="btn-secondary text-xs px-3 py-2 flex items-center gap-1.5 self-start md:self-auto"
                >
                  <Eye size={14} /> View Evidence
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800/80 space-y-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Calculator size={13} className="text-heritage-400" />
                    Deterministic Calculation Summary
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {insight.summary}
                  </p>
                </div>

                <div className="bg-purple-950/20 p-4 rounded-lg border border-purple-900/50 space-y-2">
                  <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles size={13} className="text-purple-400" />
                    IBM Granite Grounded Context
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {insight.granite_reasoning}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {insights.length === 0 && !loading && (
            <div className="card p-8 text-center text-slate-400">
              No conservation intelligence insights generated yet.
            </div>
          )}
        </div>
      )}

      {/* Traceable Evidence Modal */}
      {evidenceModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="card bg-slate-900 border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calculator size={18} className="text-heritage-400" />
                Evidence & Deterministic Provenance Trace
              </h3>
              <button
                onClick={() => setEvidenceModal(null)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 uppercase tracking-wider block">Subject / Finding</span>
                <span className="text-white font-semibold text-sm mt-1 block">{evidenceModal.title}</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                <span className="text-slate-400 uppercase tracking-wider block">Raw Telemetry & Evidence Payload</span>
                <pre className="bg-slate-900 p-3 rounded text-[11px] text-emerald-300 font-mono overflow-x-auto">
                  {JSON.stringify(evidenceModal.evidence || evidenceModal.deterministic_evidence, null, 2)}
                </pre>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 uppercase tracking-wider block">Contributing Source Registry</span>
                <p className="text-slate-300 mt-1">
                  Validated against normalized data points with SHA-256 provenance hashes.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setEvidenceModal(null)}
                className="btn-secondary text-xs px-4 py-2"
              >
                Close Trace
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Human Review Modal */}
      {reviewModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
          <form onSubmit={handleReviewSubmit} className="card bg-slate-900 border border-slate-700 w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle size={18} className="text-heritage-400" />
                Conservation Officer Human Review
              </h3>
              <button
                type="button"
                onClick={() => setReviewModal(null)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-300">
              Reviewing Alert: <strong className="text-white">{reviewModal.title}</strong>
            </div>

            <div>
              <label className="label-text block mb-1.5">Action Determination</label>
              <select
                value={reviewAction}
                onChange={(e) => setReviewAction(e.target.value)}
                className="select-field text-sm"
              >
                <option value="ACKNOWLEDGED">Acknowledge & Confirm Protocol</option>
                <option value="DISMISSED">Resolve & Close Alert</option>
                <option value="REQUIRES_HUMAN_REVIEW">Escalate for Multidisciplinary Audit</option>
              </select>
            </div>

            <div>
              <label className="label-text block mb-1.5">Officer Sign-Off Notes</label>
              <textarea
                rows={3}
                value={reviewerNotes}
                onChange={(e) => setReviewerNotes(e.target.value)}
                placeholder="Detail field inspection confirmation, turnstile reset, or remedial actions..."
                className="input-field text-sm"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReviewModal(null)}
                className="btn-secondary text-xs px-4 py-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingReview}
                className="btn-primary text-xs px-4 py-2"
              >
                {submittingReview ? 'Submitting...' : 'Save Determination'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
