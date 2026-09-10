import React, { useState, useEffect } from 'react'
import {
  Shield, Activity, Users, AlertTriangle, FileText, Zap,
  TrendingUp, TrendingDown, MapPin, RefreshCw, AlertCircle, CheckCircle
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts'
import { getDashboardOverview, getVisitorDemo, getActivityLog } from '../api/client'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

const RISK_COLORS = {
  Healthy: '#16a34a', 'Low Risk': '#22c55e',
  'Moderate Risk': '#eab308', 'High Risk': '#f97316', Critical: '#ef4444'
}

const CROWD_COLORS = {
  Green: '#22c55e', Yellow: '#eab308', Orange: '#f97316', Red: '#ef4444'
}

function StatCard({ title, value, subtitle, icon: Icon, accent, trend, link }) {
  const content = (
    <div className="card hover:border-slate-700 transition-colors group">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-lg ${accent}`}>
          <Icon size={18} className="text-white" />
        </div>
        {trend !== undefined && (
          <span className={`text-xs flex items-center gap-1 ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-slate-100 mb-0.5">{value}</div>
      <div className="text-sm font-medium text-slate-300">{title}</div>
      {subtitle && <div className="text-xs text-slate-500 mt-1">{subtitle}</div>}
    </div>
  )
  return link ? <Link to={link}>{content}</Link> : content
}

function RiskGauge({ score }) {
  const angle = (score / 100) * 180 - 90
  const color = score < 30 ? '#16a34a' : score < 50 ? '#22c55e' : score < 70 ? '#eab308' : score < 85 ? '#f97316' : '#ef4444'
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-32 h-16 overflow-hidden">
        <div className="w-32 h-32 rounded-full border-8 border-slate-700 absolute -bottom-16"
          style={{ borderTopColor: color, borderRightColor: color, transform: 'rotate(0deg)' }} />
        <div
          className="absolute bottom-0 left-1/2 w-0.5 h-10 bg-white origin-bottom transition-transform duration-1000"
          style={{ transform: `translateX(-50%) rotate(${angle}deg)` }}
        />
        <div className="absolute bottom-0 left-1/2 w-2 h-2 rounded-full bg-white -translate-x-1/2 translate-y-1" />
      </div>
      <div className="text-3xl font-bold" style={{ color }}>{score}</div>
      <div className="text-xs text-slate-400">Heritage Health Score</div>
    </div>
  )
}

export default function Dashboard() {
  const [overview, setOverview] = useState(null)
  const [visitorData, setVisitorData] = useState(null)
  const [activityLog, setActivityLog] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const [ovRes, logRes] = await Promise.all([
        getDashboardOverview(),
        getActivityLog(8)
      ])
      setOverview(ovRes.data)
      setActivityLog(logRes.data.logs || [])

      if (ovRes.data.sites?.length > 0) {
        const vRes = await getVisitorDemo(ovRes.data.sites[0].name)
        setVisitorData(vRes.data)
      }
    } catch (err) {
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-heritage-500 border-t-transparent rounded-full animate-spin" />
          <div className="text-slate-400 text-sm">Initializing HeritageGuardian AI...</div>
        </div>
      </div>
    )
  }

  const ov = overview || {}
  const healthScore = Math.round(ov.overall_heritage_health_score || 72)
  const visitorPct = visitorData?.occupancy_percentage || 0
  const crowdColor = CROWD_COLORS[visitorData?.crowd_level] || '#22c55e'

  // Hourly visitor chart data
  const hourlyData = visitorData?.hourly_data?.filter((_, i) => i % 2 === 0) || []

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">HeritageGuardian Command Center</h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time AI-assisted monitoring · Gujarat Heritage Sites · IBM Granite Powered
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="btn-secondary text-sm"
          >
            <RefreshCw size={14} /> Refresh
          </button>
          <Link to="/demo" className="btn-primary text-sm pulse-glow">
            <Zap size={14} /> Start Demo
          </Link>
        </div>
      </div>

      {/* Demo data notice */}
      <div className="demo-banner">
        <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
        <div>
          <strong>Demo Mode Active</strong> — Visitor counts are simulated. Structural scores from AI-assisted analysis.
          Encroachment detections are AI observations requiring field verification. Not real-world operational data.
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Heritage Sites"
          value={ov.total_sites || 4}
          subtitle="Under AI monitoring"
          icon={MapPin}
          accent="bg-blue-700"
          link="/sites"
        />
        <StatCard
          title="Healthy Sites"
          value={ov.healthy_sites || 2}
          subtitle={`${ov.sites_needing_attention || 2} need attention`}
          icon={CheckCircle}
          accent="bg-green-700"
          link="/structural"
        />
        <StatCard
          title="Encroachment Alerts"
          value={ov.active_encroachment_alerts || 3}
          subtitle="Pending verification"
          icon={AlertTriangle}
          accent="bg-orange-700"
          link="/encroachment"
        />
        <StatCard
          title="Conservation Tasks"
          value={ov.open_conservation_tasks || 6}
          subtitle="Open tasks"
          icon={FileText}
          accent="bg-purple-700"
          link="/reports"
        />
      </div>

      {/* Main metrics row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Heritage health gauge */}
        <div className="card flex flex-col items-center justify-center gap-3 py-6">
          <div className="label-text">Overall Heritage Health</div>
          <RiskGauge score={healthScore} />
          <div className={`badge ${healthScore >= 70 ? 'badge-green' : healthScore >= 50 ? 'badge-yellow' : 'badge-red'}`}>
            {healthScore >= 70 ? 'Satisfactory' : healthScore >= 50 ? 'Moderate Risk' : 'Needs Attention'}
          </div>
        </div>

        {/* Visitor load */}
        <div className="card">
          <div className="label-text mb-3">Current Visitor Load</div>
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="text-3xl font-bold" style={{ color: crowdColor }}>
                {visitorPct.toFixed(0)}%
              </div>
              <div className="text-xs text-slate-400">
                {visitorData?.current_visitor_count || 0} / {visitorData?.max_capacity || 500} visitors
              </div>
            </div>
            <div className={`badge`} style={{ backgroundColor: `${crowdColor}22`, color: crowdColor, border: `1px solid ${crowdColor}55` }}>
              {visitorData?.crowd_level || 'Green'} — {visitorData?.crowd_label || 'Low'}
            </div>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-3">
            <div
              className="h-3 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(100, visitorPct)}%`, backgroundColor: crowdColor }}
            />
          </div>
          <div className="text-xs text-slate-500 mt-2 text-right">
            ⚠️ Simulated data — not real-time
          </div>
        </div>

        {/* Alert summary */}
        <div className="card">
          <div className="label-text mb-3">Active Alerts Summary</div>
          <div className="space-y-2.5">
            {[
              { label: 'Structural Alerts', count: ov.active_structural_alerts || 4, color: 'text-orange-400', badge: 'badge-orange' },
              { label: 'Visitor Alerts', count: ov.active_visitor_alerts || 1, color: 'text-yellow-400', badge: 'badge-yellow' },
              { label: 'Encroachment Alerts', count: ov.active_encroachment_alerts || 3, color: 'text-red-400', badge: 'badge-red' },
            ].map(({ label, count, color, badge }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-sm text-slate-300">{label}</span>
                <span className={`badge ${badge}`}>{count} active</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-sm">
            <span className="text-slate-400">Conservation Tasks</span>
            <span className="font-semibold text-purple-400">{ov.open_conservation_tasks || 6} open</span>
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Visitor trend */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="section-title"><Users size={16} className="text-blue-400" /> Visitor Flow (Today)</div>
            <span className="badge badge-gray text-xs">⚠️ Simulated</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={hourlyData}>
              <defs>
                <linearGradient id="visitorGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="hour" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8 }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Area type="monotone" dataKey="visitor_count" stroke="#3b82f6" fill="url(#visitorGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Site health scores */}
        <div className="card">
          <div className="section-title mb-4"><Shield size={16} className="text-heritage-400" /> Site Health Scores</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={(ov.sites || []).map(s => ({ name: s.name.split(' ')[0], score: Math.round(s.health_score) }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8 }}
              />
              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {(ov.sites || []).map((site, idx) => (
                  <Cell key={idx} fill={site.health_score >= 70 ? '#22c55e' : site.health_score >= 50 ? '#eab308' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sites grid and activity log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Heritage sites */}
        <div className="card">
          <div className="section-title mb-4"><MapPin size={16} className="text-blue-400" /> Monitored Heritage Sites</div>
          <div className="space-y-3">
            {(ov.sites || []).map((site) => (
              <div key={site.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${site.health_score >= 70 ? 'bg-green-500' : site.health_score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                  <div>
                    <div className="text-sm font-medium text-slate-200">{site.name}</div>
                    <div className="text-xs text-slate-500">{site.site_type}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold" style={{ color: site.health_score >= 70 ? '#22c55e' : site.health_score >= 50 ? '#eab308' : '#ef4444' }}>
                    {Math.round(site.health_score)}/100
                  </div>
                  {site.unesco_status && <div className="badge badge-blue text-xs">UNESCO</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live agent activity */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="section-title"><Zap size={16} className="text-yellow-400" /> Agent Activity</div>
            <Link to="/agents" className="text-xs text-heritage-400 hover:text-heritage-300">View all →</Link>
          </div>
          <div className="space-y-1 max-h-52 overflow-y-auto">
            {activityLog.length === 0 ? (
              <div className="text-slate-500 text-sm text-center py-4">No recent activity</div>
            ) : (
              activityLog.map((log, idx) => (
                <div key={idx} className="agent-log-entry">
                  <span className="text-xs text-slate-600 font-mono w-16 flex-shrink-0">{log.timestamp}</span>
                  <span className={`text-xs flex-shrink-0 font-medium ${
                    log.is_granite_output ? 'text-purple-400' :
                    log.agent?.includes('Orchestrator') ? 'text-heritage-400' :
                    log.agent?.includes('Conservation') ? 'text-blue-400' : 'text-slate-400'
                  }`}>
                    [{log.agent?.split(' ')[0]}]
                  </span>
                  <span className="text-xs text-slate-400 flex-1 truncate">{log.message}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Cross-agent workflow preview */}
      <div className="card border-heritage-800/40 bg-gradient-to-br from-slate-900 to-heritage-950/20">
        <div className="section-title mb-3">
          <Zap size={16} className="text-heritage-400" />
          Cross-Agent Intelligence — Live Workflow
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {[
            { label: 'Visitor Agent', status: 'Orange Alert', color: '#f97316' },
            { label: '→', arrow: true },
            { label: 'Structural Agent', status: 'Fragile Zone', color: '#eab308' },
            { label: '→', arrow: true },
            { label: 'Orchestrator', status: 'Correlation', color: '#a78bfa' },
            { label: '→', arrow: true },
            { label: 'Granite LLM', status: 'Reasoning', color: '#c084fc', granite: true },
            { label: '→', arrow: true },
            { label: 'Conservation', status: 'Task Created', color: '#60a5fa' },
          ].map((item, idx) => (
            item.arrow ? (
              <div key={idx} className="text-slate-600 text-lg flex-shrink-0">→</div>
            ) : (
              <div key={idx} className={`flex-shrink-0 px-3 py-2 rounded-lg border text-xs text-center min-w-24 ${
                item.granite ? 'border-purple-700/50 bg-purple-950/40' : 'border-slate-700 bg-slate-800/50'
              }`}>
                <div className="font-semibold text-slate-200">{item.label}</div>
                <div style={{ color: item.color }} className="mt-0.5">{item.status}</div>
              </div>
            )
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <Link to="/demo" className="btn-primary text-xs py-1.5">Run Full Demo Scenario →</Link>
          <Link to="/agents" className="btn-secondary text-xs py-1.5">View Agent Activity</Link>
        </div>
      </div>
    </div>
  )
}
