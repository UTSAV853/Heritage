import React, { useState, useEffect } from 'react'
import {
  Users, RefreshCw, AlertCircle, Clock, MapPin, TrendingUp, Zap
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts'
import { getVisitorDemo, getSites } from '../api/client'
import toast from 'react-hot-toast'
import CustomVisitorTooltip from '../components/CustomVisitorTooltip'

const CROWD_CONFIG = {
  Green:  { label: 'Low',      color: '#22c55e', bg: 'bg-green-950/30  border-green-800/50' },
  Yellow: { label: 'Moderate', color: '#eab308', bg: 'bg-yellow-950/30 border-yellow-800/50' },
  Orange: { label: 'High',     color: '#f97316', bg: 'bg-orange-950/30 border-orange-800/50' },
  Red:    { label: 'Critical', color: '#ef4444', bg: 'bg-red-950/30    border-red-800/50' },
}

function HeatmapCell({ zone }) {
  const conf = CROWD_CONFIG[zone.crowd_level] || CROWD_CONFIG.Green
  return (
    <div
      className={`rounded-lg p-3 border text-center ${conf.bg}`}
      style={{ minHeight: 70 }}
    >
      <div className="text-xs text-slate-400 mb-1 truncate">{zone.name}</div>
      <div className="text-lg font-bold" style={{ color: conf.color }}>{zone.visitor_count}</div>
      <div className="text-xs" style={{ color: conf.color }}>{zone.crowd_label}</div>
      <div className="text-xs text-slate-600 mt-0.5">{zone.occupancy_pct}% full</div>
    </div>
  )
}

export default function VisitorFlow() {
  const [sites, setSites] = useState([])
  const [selectedSite, setSelectedSite] = useState('Modhera Sun Temple')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(false)

  useEffect(() => {
    getSites().then(res => setSites(res.data))
    fetchData()
  }, [selectedSite])

  useEffect(() => {
    if (!autoRefresh) return
    const iv = setInterval(fetchData, 10000)
    return () => clearInterval(iv)
  }, [autoRefresh, selectedSite])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getVisitorDemo(selectedSite)
      setData(res.data)
    } catch {
      toast.error('Failed to fetch visitor data')
    } finally {
      setLoading(false)
    }
  }

  const crowdConf = data ? (CROWD_CONFIG[data.crowd_level] || CROWD_CONFIG.Green) : null

  return (
    <div className="space-y-5 fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Visitor Flow Management</h1>
          <p className="text-slate-400 text-sm mt-1">AI-monitored crowd density and flow optimization</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`btn-secondary text-sm ${autoRefresh ? 'border-green-700 text-green-400' : ''}`}
          >
            <RefreshCw size={14} className={autoRefresh ? 'animate-spin' : ''} />
            {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh'}
          </button>
          <button onClick={fetchData} disabled={loading} className="btn-primary text-sm">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>
      </div>

      <div className="demo-banner">
        <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
        <span>⚠️ All visitor counts are SIMULATED for demonstration. Real deployment requires IoT sensors, ticketing system, or camera feed integration.</span>
      </div>

      {/* Site selector */}
      <div className="flex items-center gap-3">
        <label className="label-text">Site:</label>
        <select
          value={selectedSite}
          onChange={e => setSelectedSite(e.target.value)}
          className="select-field w-auto"
        >
          <option>Modhera Sun Temple</option>
          <option>Ahmedabad Walled City</option>
          <option>Sidi Saiyyed Mosque</option>
          <option>Rani Ki Vav (Queen's Stepwell)</option>
        </select>
      </div>

      {data && (
        <>
          {/* Main metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`card border ${crowdConf.bg}`}>
              <div className="label-text mb-1">Current Visitors</div>
              <div className="text-3xl font-bold text-slate-100">{data.current_visitor_count}</div>
              <div className="text-xs text-slate-500">of {data.max_capacity} max</div>
            </div>
            <div className={`card border ${crowdConf.bg}`}>
              <div className="label-text mb-1">Occupancy</div>
              <div className="text-3xl font-bold" style={{ color: crowdConf.color }}>
                {data.occupancy_percentage.toFixed(0)}%
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1">
                <div className="h-1.5 rounded-full" style={{ width: `${Math.min(100, data.occupancy_percentage)}%`, background: crowdConf.color }} />
              </div>
            </div>
            <div className={`card border ${crowdConf.bg}`}>
              <div className="label-text mb-1">Crowd Level</div>
              <div className="text-2xl font-bold" style={{ color: crowdConf.color }}>
                {data.crowd_level}
              </div>
              <div className="text-xs" style={{ color: crowdConf.color }}>{crowdConf.label}</div>
            </div>
            <div className="card">
              <div className="label-text mb-1">Est. Wait Time</div>
              <div className="flex items-end gap-1">
                <div className="text-3xl font-bold text-slate-100">{data.estimated_wait_time_minutes}</div>
                <div className="text-sm text-slate-400 mb-1">min</div>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Clock size={10} /> {data.is_peak_hour ? '🔴 Peak hour' : '✅ Off-peak'}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          {data.recommendations?.length > 0 && (
            <div className={`card border ${crowdConf.bg}`}>
              <div className="section-title mb-3">
                <Zap size={15} style={{ color: crowdConf.color }} />
                AI Recommendations
              </div>
              <div className="space-y-2">
                {data.recommendations.map((rec, idx) => (
                  <div key={idx} className="text-sm text-slate-200 p-2.5 bg-slate-800/50 rounded-lg border border-slate-700/50 leading-relaxed">
                    {rec}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Zone Heatmap */}
          <div className="card">
            <div className="section-title mb-4">
              <MapPin size={15} className="text-blue-400" />
              Visitor Density Heatmap — Zone View
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {data.zone_data?.map((zone) => (
                <HeatmapCell key={zone.id} zone={zone} />
              ))}
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
              {Object.entries(CROWD_CONFIG).map(([key, val]) => (
                <span key={key} className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ background: val.color }} />
                  {val.label}
                </span>
              ))}
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="card">
              <div className="section-title mb-3">
                <TrendingUp size={15} className="text-blue-400" />
                Hourly Visitor Pattern (Today)
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={data.hourly_data?.filter((_, i) => i % 2 === 0) || []}>
                  <defs>
                    <linearGradient id="vGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={crowdConf.color} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={crowdConf.color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="hour" tick={{ fill: '#64748b', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                  <Tooltip content={<CustomVisitorTooltip />} />
                  <Area type="monotone" dataKey="visitor_count" stroke={crowdConf.color} fill="url(#vGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <div className="section-title mb-3">
                <TrendingUp size={15} className="text-green-400" />
                Weekly Visitor Trend
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data.weekly_trend || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip content={<CustomVisitorTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }} />
                  <Bar dataKey="visitors" radius={[5, 5, 0, 0]}>
                    {(data.weekly_trend || []).map((entry, idx) => (
                      <Cell key={idx} fill={entry.visitors > 1100 ? '#f97316' : entry.visitors > 800 ? '#eab308' : '#22c55e'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Routes */}
          <div className="card">
            <div className="section-title mb-3"><MapPin size={15} className="text-heritage-400" /> Available Routes</div>
            <div className="space-y-2">
              {Object.entries(data.routes || {}).map(([key, route]) => (
                <div key={key} className="flex items-start gap-3 p-2.5 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <div className={`badge ${key === 'primary' ? 'badge-green' : key === 'alternate_b' ? 'badge-yellow' : 'badge-orange'}`}>
                    {key === 'primary' ? 'Primary' : key === 'alternate_b' ? 'Route B' : 'Overflow'}
                  </div>
                  <div className="text-sm text-slate-300">{route}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
