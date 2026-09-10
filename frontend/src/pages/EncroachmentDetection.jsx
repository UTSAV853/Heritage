import React, { useState } from 'react'
import { AlertTriangle, Upload, RefreshCw, AlertCircle, CheckCircle, Eye, Cpu } from 'lucide-react'
import { analyzeEncroachment, getEncroachmentDemo } from '../api/client'
import toast from 'react-hot-toast'

const SEV_COLORS = {
  Low: 'text-green-400', Moderate: 'text-yellow-400', High: 'text-orange-400', Critical: 'text-red-400'
}
const SEV_BADGE = {
  Low: 'badge-green', Moderate: 'badge-yellow', High: 'badge-orange', Critical: 'badge-red'
}

export default function EncroachmentDetection() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [siteName, setSiteName] = useState('Modhera Sun Temple')
  const [imgPreview, setImgPreview] = useState(null)
  const [histPreview, setHistPreview] = useState(null)

  const handleImg = (e, setter) => {
    const f = e.target.files[0]
    if (f) { const r = new FileReader(); r.onloadend = () => setter(r.result); r.readAsDataURL(f) }
  }

  const runDemo = async () => {
    setLoading(true)
    try {
      const res = await getEncroachmentDemo(siteName)
      setResult(res.data)
      toast.success('Encroachment analysis complete')
    } catch { toast.error('Analysis failed') }
    finally { setLoading(false) }
  }

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.target)
    try {
      const res = await analyzeEncroachment(fd)
      setResult(res.data)
      toast.success('Analysis complete')
    } catch { toast.error('Analysis failed') }
    finally { setLoading(false) }
  }

  return (
    <div className="space-y-5 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Encroachment Detection</h1>
        <p className="text-slate-400 text-sm mt-1">AI-assisted heritage boundary monitoring via image analysis</p>
      </div>

      <div className="ai-disclaimer">
        <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
        <div>
          <strong>Important Legal Notice</strong> — All detections use language "potential" and "possible". 
          This system does NOT make legal determinations. Field verification by authorized government officials
          is REQUIRED before any enforcement action.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <form onSubmit={submit} className="card space-y-4">
          <div className="section-title"><Eye size={16} className="text-orange-400" /> Upload Images for Analysis</div>

          <div>
            <label className="label-text block mb-1">Heritage Site *</label>
            <select name="site_name" value={siteName} onChange={e => setSiteName(e.target.value)} className="select-field">
              <option>Modhera Sun Temple</option>
              <option>Ahmedabad Walled City</option>
              <option>Sidi Saiyyed Mosque</option>
              <option>Rani Ki Vav (Queen's Stepwell)</option>
            </select>
          </div>

          <div>
            <label className="label-text block mb-1">Current Site Image (drone/satellite/ground)</label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-700 rounded-lg cursor-pointer hover:border-orange-700 transition-colors bg-slate-800/30">
              {imgPreview ? (
                <img src={imgPreview} className="h-full w-full object-cover rounded-lg" alt="current" />
              ) : (
                <div className="text-slate-500 text-xs flex flex-col items-center gap-2"><Upload size={18} /> Upload current site image</div>
              )}
              <input type="file" name="image" accept=".jpg,.jpeg,.png,.webp" className="hidden" onChange={e => handleImg(e, setImgPreview)} />
            </label>
          </div>

          <div>
            <label className="label-text block mb-1">Historical Reference Image (optional — enables comparison)</label>
            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-700 rounded-lg cursor-pointer hover:border-slate-600 bg-slate-800/30">
              {histPreview ? (
                <img src={histPreview} className="h-full w-full object-cover rounded-lg" alt="historical" />
              ) : (
                <div className="text-slate-500 text-xs flex items-center gap-2"><Upload size={14} /> Upload historical image for before/after comparison</div>
              )}
              <input type="file" name="historical_image" accept=".jpg,.jpeg,.png,.webp" className="hidden" onChange={e => handleImg(e, setHistPreview)} />
            </label>
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? <><RefreshCw size={14} className="animate-spin" /> Analyzing...</> : <><AlertTriangle size={14} /> Analyze Boundary</>}
            </button>
            <button type="button" onClick={runDemo} disabled={loading} className="btn-secondary">
              Sample Satellite Scan
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {!result && !loading && (
            <div className="card flex flex-col items-center justify-center h-64 text-slate-500 gap-3">
              <AlertTriangle size={40} className="text-slate-700" />
              <div className="text-center">
                <div className="font-medium text-slate-400">Awaiting Analysis</div>
                <div className="text-sm">Upload imagery or click Sample Satellite Scan to analyze perimeter</div>
              </div>
            </div>
          )}

          {loading && (
            <div className="card flex flex-col items-center justify-center h-64 gap-4">
              <div className="w-12 h-12 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
              <div className="text-slate-400 text-sm text-center">
                <div className="font-medium">Boundary Analysis in Progress</div>
                <div className="text-xs text-slate-500">Running image comparison + IBM Granite reasoning...</div>
              </div>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-4 slide-in">
              {/* Detection result */}
              <div className={`card border ${result.encroachment_detected ? 'border-orange-700/50 bg-orange-950/20' : 'border-green-700/50 bg-green-950/20'}`}>
                <div className="flex items-start gap-3 mb-3">
                  {result.encroachment_detected ? (
                    <AlertTriangle size={20} className="text-orange-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className={`text-lg font-bold ${result.encroachment_detected ? 'text-orange-300' : 'text-green-300'}`}>
                      {result.encroachment_detected ? 'Potential Encroachment Detected' : 'No Significant Changes Detected'}
                    </div>
                    <div className="text-sm text-slate-400">{result.site_name}</div>
                  </div>
                  {result.encroachment_detected && (
                    <div className="text-right">
                      <div className="text-2xl font-bold text-orange-400">{Math.round(result.confidence * 100)}%</div>
                      <div className="text-xs text-slate-500">confidence</div>
                    </div>
                  )}
                </div>

                {result.encroachment_detected && (
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      <div className="label-text">Type</div>
                      <div className="text-sm text-slate-200">{result.encroachment_type}</div>
                    </div>
                    <div>
                      <div className="label-text">Severity</div>
                      <span className={`badge ${SEV_BADGE[result.severity] || 'badge-gray'}`}>{result.severity}</span>
                    </div>
                  </div>
                )}

                {result.comparison_note && (
                  <div className="mt-3 p-2 bg-slate-800/50 rounded text-xs text-slate-400">{result.comparison_note}</div>
                )}
              </div>

              {/* Detected changes */}
              {result.detected_changes?.length > 0 && (
                <div className="card">
                  <div className="section-title mb-3">Detected Changes</div>
                  <div className="space-y-2">
                    {result.detected_changes.map((change, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-800/50 rounded-lg border border-slate-700/50">
                        <div>
                          <div className="text-sm text-slate-200">{change.change}</div>
                          <div className="text-xs text-slate-500">{change.location}</div>
                        </div>
                        <span className="badge badge-gray">{Math.round(change.confidence * 100)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action plan */}
              {result.action_plan?.length > 0 && (
                <div className="card">
                  <div className="section-title mb-3"><AlertTriangle size={14} className="text-orange-400" /> Recommended Authority Actions</div>
                  <div className="space-y-1.5">
                    {result.action_plan.map((action, idx) => (
                      <div key={idx} className="text-sm text-slate-300 flex items-start gap-2 p-2 bg-slate-800/30 rounded">
                        <span className="text-slate-600 text-xs mt-0.5 flex-shrink-0">{idx + 1}.</span>
                        {action}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Granite reasoning */}
              {result.granite_reasoning && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Cpu size={14} className="text-purple-400" />
                    <span className="text-xs font-semibold text-purple-400">IBM Granite Analysis</span>
                  </div>
                  <div className="granite-output">{result.granite_reasoning}</div>
                </div>
              )}

              {/* Disclaimer */}
              <div className="ai-disclaimer">
                <AlertCircle size={12} className="flex-shrink-0 mt-0.5" />
                <span>{result.disclaimer || 'AI-assisted observation only. Field verification required before any official action.'}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
