import React, { useState } from 'react'
import { Activity, Upload, AlertCircle, CheckCircle, RefreshCw, Camera, Cpu } from 'lucide-react'
import { analyzeStructural, getStructuralDemo } from '../api/client'
import toast from 'react-hot-toast'

const RISK_COLORS = {
  'Healthy': 'text-green-400', 'Low Risk': 'text-green-300',
  'Moderate Risk': 'text-yellow-400', 'High Risk': 'text-orange-400', 'Critical': 'text-red-400'
}
const RISK_BG = {
  'Healthy': 'bg-green-950/30 border-green-800/50', 'Low Risk': 'bg-green-950/30 border-green-800/50',
  'Moderate Risk': 'bg-yellow-950/30 border-yellow-800/50',
  'High Risk': 'bg-orange-950/30 border-orange-800/50', 'Critical': 'bg-red-950/30 border-red-800/50'
}

function RiskScoreBar({ score }) {
  const color = score < 30 ? '#22c55e' : score < 50 ? '#84cc16' : score < 70 ? '#eab308' : score < 85 ? '#f97316' : '#ef4444'
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-400">Risk Score</span>
        <span className="font-bold" style={{ color }}>{score}/100</span>
      </div>
      <div className="w-full bg-slate-800 rounded-full h-3">
        <div className="h-3 rounded-full transition-all duration-1000" style={{ width: `${score}%`, background: color }} />
      </div>
    </div>
  )
}

export default function StructuralMonitoring() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [siteName, setSiteName] = useState('Modhera Sun Temple')
  const [imagePreview, setImagePreview] = useState(null)
  const [prevImagePreview, setPrevImagePreview] = useState(null)
  const [moisture, setMoisture] = useState('')
  const [temperature, setTemperature] = useState('')

  const handleImageChange = (e, setPrev) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setPrev(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const runDemo = async () => {
    setLoading(true)
    try {
      const res = await getStructuralDemo(siteName)
      setResult(res.data)
      toast.success('AI analysis complete')
    } catch (err) {
      toast.error('Analysis failed — check backend connection')
    } finally {
      setLoading(false)
    }
  }

  const runAnalysis = async (e) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.target)
    if (moisture) formData.set('sensor_moisture', moisture)
    if (temperature) formData.set('sensor_temperature', temperature)
    try {
      const res = await analyzeStructural(formData)
      setResult(res.data)
      toast.success('Structural analysis complete')
    } catch (err) {
      toast.error('Analysis failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Structural Health Monitoring</h1>
        <p className="text-slate-400 text-sm mt-1">AI-assisted visual analysis of heritage structure condition</p>
      </div>

      <div className="ai-disclaimer">
        <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
        <div>
          <strong>AI-Assisted Observation Only</strong> — Results are NOT certified structural engineering assessments.
          Physical inspection by qualified engineers is required for official determinations and safety decisions.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Input form */}
        <form onSubmit={runAnalysis} className="card space-y-4">
          <div className="section-title"><Camera size={16} className="text-heritage-400" /> Upload for Analysis</div>

          <div>
            <label className="label-text block mb-1">Heritage Site Name *</label>
            <select
              name="site_name"
              value={siteName}
              onChange={e => setSiteName(e.target.value)}
              className="select-field"
            >
              <option>Modhera Sun Temple</option>
              <option>Ahmedabad Walled City</option>
              <option>Sidi Saiyyed Mosque</option>
              <option>Rani Ki Vav (Queen's Stepwell)</option>
            </select>
          </div>

          <div>
            <label className="label-text block mb-1">Current Image (optional — demo works without image)</label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-700 rounded-lg cursor-pointer hover:border-heritage-600 transition-colors bg-slate-800/30">
              {imagePreview ? (
                <img src={imagePreview} alt="preview" className="h-full w-full object-cover rounded-lg" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-500">
                  <Upload size={20} />
                  <span className="text-xs">Click to upload JPG/PNG (max 10MB)</span>
                </div>
              )}
              <input
                type="file"
                name="image"
                accept=".jpg,.jpeg,.png,.webp"
                className="hidden"
                onChange={(e) => handleImageChange(e, setImagePreview)}
              />
            </label>
          </div>

          <div>
            <label className="label-text block mb-1">Previous Inspection Image (optional)</label>
            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-700 rounded-lg cursor-pointer hover:border-slate-600 transition-colors bg-slate-800/30">
              {prevImagePreview ? (
                <img src={prevImagePreview} alt="prev preview" className="h-full w-full object-cover rounded-lg" />
              ) : (
                <div className="text-slate-500 text-xs flex items-center gap-2"><Upload size={14} /> Upload previous image for comparison</div>
              )}
              <input type="file" name="previous_image" accept=".jpg,.jpeg,.png,.webp" className="hidden"
                onChange={(e) => handleImageChange(e, setPrevImagePreview)} />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-text block mb-1">Moisture Sensor (%)</label>
              <input
                type="number" min="0" max="100" step="0.1"
                value={moisture} onChange={e => setMoisture(e.target.value)}
                placeholder="e.g. 72.5"
                className="input-field"
              />
            </div>
            <div>
              <label className="label-text block mb-1">Temperature (°C)</label>
              <input
                type="number" min="-10" max="60" step="0.1"
                value={temperature} onChange={e => setTemperature(e.target.value)}
                placeholder="e.g. 38.2"
                className="input-field"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? <><RefreshCw size={14} className="animate-spin" /> Analyzing...</> : <><Cpu size={14} /> Analyze Structure</>}
            </button>
            <button type="button" onClick={runDemo} disabled={loading} className="btn-secondary">
              Demo
            </button>
          </div>
        </form>

        {/* Result panel */}
        <div className="space-y-4">
          {!result && !loading && (
            <div className="card flex flex-col items-center justify-center h-64 text-slate-500 gap-3">
              <Activity size={40} className="text-slate-700" />
              <div className="text-center">
                <div className="font-medium text-slate-400">No analysis yet</div>
                <div className="text-sm">Upload an image or click Demo to run AI analysis</div>
              </div>
            </div>
          )}

          {loading && (
            <div className="card flex flex-col items-center justify-center h-64 gap-4">
              <div className="w-12 h-12 border-2 border-heritage-500 border-t-transparent rounded-full animate-spin" />
              <div className="text-slate-400 text-sm text-center">
                <div className="font-medium">AI Analysis in Progress</div>
                <div className="text-xs text-slate-500">Running computer vision + IBM Granite reasoning...</div>
              </div>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-4 slide-in">
              {/* Risk summary card */}
              <div className={`card border ${RISK_BG[result.risk_level] || 'border-slate-700'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Risk Assessment</div>
                    <div className={`text-2xl font-bold ${RISK_COLORS[result.risk_level]}`}>
                      {result.risk_level}
                    </div>
                    <div className="text-sm text-slate-400">{result.site_name}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${RISK_COLORS[result.risk_level]}`}>
                      {result.risk_score}
                    </div>
                    <div className="text-xs text-slate-500">/ 100</div>
                    <div className="badge badge-gray text-xs mt-1">
                      Confidence: {Math.round(result.confidence_score * 100)}%
                    </div>
                  </div>
                </div>
                <RiskScoreBar score={result.risk_score} />
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <div className="label-text">Priority</div>
                    <div className={`font-semibold text-sm ${
                      result.priority === 'Immediate' ? 'text-red-400' :
                      result.priority === 'High' ? 'text-orange-400' :
                      result.priority === 'Medium' ? 'text-yellow-400' : 'text-green-400'
                    }`}>{result.priority}</div>
                  </div>
                  <div>
                    <div className="label-text">Next Inspection</div>
                    <div className="text-sm text-slate-300">{result.next_inspection_days} days</div>
                  </div>
                </div>
              </div>

              {/* Detected issues */}
              {result.detected_issues?.length > 0 && (
                <div className="card">
                  <div className="section-title mb-3">
                    <AlertCircle size={15} className="text-orange-400" />
                    Detected Issues ({result.detected_issues.length})
                  </div>
                  <div className="space-y-2">
                    {result.detected_issues.map((issue, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-2.5 bg-slate-800/50 rounded-lg border border-slate-700/50">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                          issue.severity === 'High' ? 'bg-red-500' :
                          issue.severity === 'Moderate' ? 'bg-yellow-500' : 'bg-green-500'
                        }`} />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-slate-200">{issue.issue_type}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{issue.location} · Severity: {issue.severity}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{issue.description}</div>
                        </div>
                        <div className="text-xs text-slate-500 flex-shrink-0">{Math.round(issue.confidence * 100)}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              <div className="card">
                <div className="label-text mb-2">Recommended Actions</div>
                <div className="text-sm text-slate-300 leading-relaxed">{result.recommendations}</div>
              </div>

              {/* Granite reasoning */}
              {result.granite_reasoning && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Cpu size={14} className="text-purple-400" />
                    <span className="text-xs font-semibold text-purple-400">IBM Granite AI Reasoning</span>
                  </div>
                  <div className="granite-output">{result.granite_reasoning}</div>
                </div>
              )}

              {/* Comparison */}
              {result.comparison && (
                <div className="card-sm border border-slate-700">
                  <div className="label-text mb-2">Change from Previous Inspection</div>
                  <div className="flex items-center gap-3">
                    <div className={`text-lg font-bold ${
                      result.comparison.change > 5 ? 'text-red-400' :
                      result.comparison.change < -5 ? 'text-green-400' : 'text-yellow-400'
                    }`}>
                      {result.comparison.change > 0 ? '+' : ''}{result.comparison.change}
                    </div>
                    <div>
                      <div className="text-sm text-slate-300">{result.comparison.trend}</div>
                      <div className="text-xs text-slate-500">{result.comparison.note}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              <div className="ai-disclaimer">
                <AlertCircle size={12} className="flex-shrink-0 mt-0.5" />
                <span>{result.disclaimer}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
