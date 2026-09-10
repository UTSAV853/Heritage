import React, { useState, useEffect } from 'react'
import {
  Edit3, Shield, CheckCircle, AlertTriangle, Send,
  FileCheck, Clock, User, Info, ArrowRight, Zap
} from 'lucide-react'
import { submitManualObservation } from '../api/client'
import { DEMO_SITES } from '../api/mockData'

export default function ManualDataEntry() {
  const [formData, setFormData] = useState({
    site_id: 1,
    zone_id: '',
    observation_type: 'VISITOR_FLOW',
    metric_name: 'visitor_count',
    metric_value: '',
    unit: 'visitors',
    severity: 'Low',
    inspector_name: '',
    details: '',
    observation_date: new Date().toISOString().slice(0, 16)
  })

  const [submitting, setSubmitting] = useState(false)
  const [submissionResult, setSubmissionResult] = useState(null)
  const [formError, setFormError] = useState(null)

  // Suggest default metric name & unit based on observation type
  const handleTypeChange = (type) => {
    let mName = 'visitor_count'
    let unit = 'visitors'
    let sev = 'Low'

    switch (type) {
      case 'VISITOR_FLOW':
        mName = 'visitor_count'
        unit = 'visitors'
        break
      case 'STRUCTURAL_INTEGRITY':
        mName = 'crack_width_mm'
        unit = 'mm'
        sev = 'Moderate'
        break
      case 'ENVIRONMENTAL_CONDITION':
        mName = 'temperature_c'
        unit = '°C'
        break
      case 'ENCROACHMENT':
        mName = 'encroachment_distance_m'
        unit = 'meters'
        sev = 'High'
        break
      case 'CONSERVATION_INCIDENT':
        mName = 'incident_severity_score'
        unit = 'score'
        sev = 'Moderate'
        break
      default:
        break
    }

    setFormData(prev => ({
      ...prev,
      observation_type: type,
      metric_name: mName,
      unit,
      severity: sev
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)
    setSubmissionResult(null)

    if (!formData.metric_value || isNaN(Number(formData.metric_value))) {
      setFormError('Please enter a valid numeric observation value.')
      return
    }

    try {
      setSubmitting(true)
      const payload = {
        site_id: Number(formData.site_id),
        zone_id: formData.zone_id ? Number(formData.zone_id) : null,
        observation_type: formData.observation_type,
        metric_name: formData.metric_name,
        metric_value: parseFloat(formData.metric_value),
        unit: formData.unit,
        severity: formData.severity,
        details: formData.details || null,
        inspector_name: formData.inspector_name || 'Conservation Field Officer',
        observation_date: formData.observation_date ? new Date(formData.observation_date).toISOString() : new Date().toISOString()
      }

      const res = await submitManualObservation(payload)
      setSubmissionResult({
        success: true,
        data: res.data || res,
        observationId: res.data?.observation_id || Date.now()
      })

      // Reset value and details
      setFormData(prev => ({
        ...prev,
        metric_value: '',
        details: ''
      }))
    } catch (err) {
      console.error('Submission failed', err)
      setFormError(err.response?.data?.detail || 'Failed to submit manual observation. Check input parameters.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Edit3 className="text-heritage-400" size={26} />
          Authorized Manual Observation Entry
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Direct field telemetry logging for authorized conservation officers, ASI wardens, and structural inspection engineers.
        </p>
      </div>

      {/* Provenance Guarantee Banner */}
      <div className="card bg-purple-950/20 border border-purple-900/50 p-4 flex items-start gap-3">
        <Shield size={20} className="text-purple-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <span className="font-semibold text-purple-300 block mb-0.5">MANUAL_ENTRY Provenance Protocol</span>
          All records submitted through this terminal are cryptographically tagged with <span className="text-purple-200 font-mono">MANUAL_ENTRY</span> origin,
          audited by the deduplication engine against contemporaneous satellite & sensor telemetry, and routed directly into the deterministic conservation analysis pipeline.
        </div>
      </div>

      {/* Form Error Toast */}
      {formError && (
        <div className="p-4 rounded-lg bg-red-950/40 border border-red-800 text-red-300 text-sm flex items-center gap-2">
          <AlertTriangle size={16} />
          <span>{formError}</span>
        </div>
      )}

      {/* Success Feedback Box */}
      {submissionResult && (
        <div className="card bg-green-950/30 border border-green-800 p-5 space-y-3 slide-in">
          <div className="flex items-center gap-2 text-green-400 font-semibold text-sm">
            <CheckCircle size={18} />
            Observation Successfully Validated and Stored in Unified Pipeline!
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
              <span className="text-slate-400 block">Assigned ID:</span>
              <span className="text-white font-mono font-bold mt-0.5 block">OBS-#{submissionResult.observationId}</span>
            </div>
            <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
              <span className="text-slate-400 block">Provenance Tag:</span>
              <span className="badge badge-purple mt-1">MANUAL_ENTRY</span>
            </div>
            <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
              <span className="text-slate-400 block">Analysis Status:</span>
              <span className="text-emerald-400 font-semibold mt-0.5 block flex items-center gap-1">
                <Zap size={12} /> Deterministic Pipeline Updated
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-300">
            Field measurement is immediately visible in <strong className="text-white">Data Monitoring</strong> and active in cross-agent correlation checks.
          </p>
        </div>
      )}

      {/* Entry Form */}
      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Site Selector */}
          <div>
            <label className="label-text block mb-1.5">Heritage Monument Site *</label>
            <select
              value={formData.site_id}
              onChange={(e) => setFormData({ ...formData, site_id: e.target.value })}
              className="select-field text-sm"
              required
            >
              {DEMO_SITES.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.location})
                </option>
              ))}
            </select>
          </div>

          {/* Observation Domain / Type */}
          <div>
            <label className="label-text block mb-1.5">Observation Domain *</label>
            <select
              value={formData.observation_type}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="select-field text-sm"
              required
            >
              <option value="VISITOR_FLOW">Visitor Flow & Crowd Headcount</option>
              <option value="STRUCTURAL_INTEGRITY">Structural Integrity & Micro-Crack</option>
              <option value="ENVIRONMENTAL_CONDITION">Environmental / Meteorological Condition</option>
              <option value="ENCROACHMENT">Boundary Encroachment Proximity</option>
              <option value="CONSERVATION_INCIDENT">Conservation Incident / Physical Alteration</option>
            </select>
          </div>

          {/* Metric Name */}
          <div>
            <label className="label-text block mb-1.5">Metric Identifier *</label>
            <input
              type="text"
              value={formData.metric_name}
              onChange={(e) => setFormData({ ...formData, metric_name: e.target.value })}
              className="input-field text-sm font-mono"
              placeholder="e.g. visitor_count, crack_width_mm"
              required
            />
          </div>

          {/* Metric Value and Unit */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="label-text block mb-1.5">Metric Value *</label>
              <input
                type="number"
                step="any"
                value={formData.metric_value}
                onChange={(e) => setFormData({ ...formData, metric_value: e.target.value })}
                className="input-field text-sm font-bold text-white"
                placeholder="e.g. 420 or 2.1"
                required
              />
            </div>
            <div>
              <label className="label-text block mb-1.5">Unit of Measurement</label>
              <input
                type="text"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="input-field text-sm"
                placeholder="e.g. visitors, mm, °C"
              />
            </div>
          </div>

          {/* Severity */}
          <div>
            <label className="label-text block mb-1.5">Initial Field Severity Evaluation</label>
            <select
              value={formData.severity}
              onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
              className="select-field text-sm"
            >
              <option value="Low">Low - Normal Range</option>
              <option value="Moderate">Moderate - Elevated Monitoring</option>
              <option value="High">High - Threshold Exceeded</option>
              <option value="Critical">Critical - Immediate Action Required</option>
            </select>
          </div>

          {/* Inspector Credential */}
          <div>
            <label className="label-text block mb-1.5">Inspector Name & Badge / Authority</label>
            <div className="relative">
              <input
                type="text"
                value={formData.inspector_name}
                onChange={(e) => setFormData({ ...formData, inspector_name: e.target.value })}
                className="input-field text-sm pl-8"
                placeholder="e.g. Officer P. Sharma (ASI Vadodara Circle)"
              />
              <User size={14} className="absolute left-2.5 top-3 text-slate-500" />
            </div>
          </div>

          {/* Observation Timestamp */}
          <div className="md:col-span-2">
            <label className="label-text block mb-1.5">Field Observation Timestamp</label>
            <input
              type="datetime-local"
              value={formData.observation_date}
              onChange={(e) => setFormData({ ...formData, observation_date: e.target.value })}
              className="input-field text-sm max-w-sm"
            />
          </div>

          {/* Qualitative Notes / Context */}
          <div className="md:col-span-2">
            <label className="label-text block mb-1.5">Field Evidence & Descriptive Notes</label>
            <textarea
              rows={3}
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              className="input-field text-sm"
              placeholder="Provide contextual observations, turnstile readings, photo references, or specific monument quadrant details..."
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-800">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Info size={13} className="text-heritage-400" />
            Input will be normalized and deduplicated against active sensors.
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary text-sm px-6 py-2.5 flex items-center gap-2"
          >
            <Send size={15} />
            {submitting ? 'Validating & Ingesting...' : 'Submit Field Observation'}
          </button>
        </div>
      </form>
    </div>
  )
}
