import React, { useState, useEffect, useRef } from 'react'
import { Zap, RefreshCw, Filter, Download, Cpu, Activity } from 'lucide-react'
import { getActivityLog } from '../api/client'

const AGENT_COLORS = {
  'Structural Agent': 'text-orange-400',
  'Visitor Agent': 'text-blue-400',
  'Encroachment Agent': 'text-yellow-400',
  'Storytelling Agent': 'text-green-400',
  'Conservation Agent': 'text-cyan-400',
  'Orchestrator': 'text-heritage-400',
  'Granite LLM': 'text-purple-400',
}

const EVENT_COLORS = {
  ALERT: 'text-red-400', DETECTION: 'text-orange-400', CORRELATION: 'text-purple-400',
  REASONING: 'text-purple-300', SYNTHESIS: 'text-purple-300', ESCALATE: 'text-orange-400',
  COMPLETE: 'text-green-400', TASK: 'text-blue-400', INIT: 'text-slate-400',
  START: 'text-slate-400', ANALYSIS: 'text-slate-300', SCORE: 'text-slate-300',
  STATUS: 'text-slate-300', CLEAR: 'text-green-400', STORY: 'text-green-300',
  CHAT: 'text-slate-400', DEMO_SCENARIO: 'text-heritage-300', NOTIFIED: 'text-blue-300',
}

export default function AgentActivity() {
  const [logs, setLogs] = useState([])
  const [filter, setFilter] = useState('All')
  const [autoScroll, setAutoScroll] = useState(true)
  const [loading, setLoading] = useState(false)
  const logRef = useRef(null)

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const res = await getActivityLog(100)
      setLogs(res.data.logs || [])
    } catch {} 
    finally { setLoading(false) }
  }

  useEffect(() => {
    fetchLogs()
    const iv = setInterval(fetchLogs, 5000)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => {
    if (autoScroll && logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [logs, autoScroll])

  const agents = ['All', 'Structural Agent', 'Visitor Agent', 'Encroachment Agent',
    'Conservation Agent', 'Orchestrator', 'Granite LLM']

  const filtered = filter === 'All' ? logs : logs.filter(l => l.agent === filter)

  const exportLogs = () => {
    const text = filtered.map(l => `[${l.timestamp}] [${l.agent}] [${l.event_type}] ${l.message}`).join('\n')
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'agent_activity.txt'; a.click()
  }

  const agentCounts = logs.reduce((acc, l) => {
    acc[l.agent] = (acc[l.agent] || 0) + 1; return acc
  }, {})

  return (
    <div className="space-y-5 fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Agent Activity</h1>
          <p className="text-slate-400 text-sm mt-1">Real-time log of all AI agent actions and Granite reasoning</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportLogs} className="btn-secondary text-sm">
            <Download size={14} /> Export
          </button>
          <button onClick={fetchLogs} disabled={loading} className="btn-secondary text-sm">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>
      </div>

      {/* Agent stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {['Structural Agent', 'Visitor Agent', 'Encroachment Agent', 'Conservation Agent',
          'Orchestrator', 'Granite LLM', 'Storytelling Agent'].map(agent => (
          <div
            key={agent}
            onClick={() => setFilter(filter === agent ? 'All' : agent)}
            className={`card-sm cursor-pointer hover:border-slate-600 transition-all text-center ${
              filter === agent ? 'border-heritage-600 bg-heritage-950/20' : ''
            }`}
          >
            <div className={`text-lg font-bold ${AGENT_COLORS[agent] || 'text-slate-400'}`}>
              {agentCounts[agent] || 0}
            </div>
            <div className="text-xs text-slate-500 leading-tight mt-0.5">
              {agent.replace(' Agent', '')}
            </div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter size={14} className="text-slate-500" />
        {agents.map(agent => (
          <button
            key={agent}
            onClick={() => setFilter(agent)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
              filter === agent
                ? 'bg-heritage-800/60 border-heritage-600 text-heritage-200'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
            }`}
          >
            {agent}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={e => setAutoScroll(e.target.checked)}
              className="accent-heritage-500"
            />
            Auto-scroll
          </label>
        </div>
      </div>

      {/* Activity log terminal */}
      <div className="card p-0 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>
            <span className="text-xs text-slate-500 ml-2 font-mono">HeritageGuardian Agent Terminal</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity size={12} className="text-green-400" />
            <span className="text-xs text-green-400 font-mono">LIVE</span>
            <span className="text-xs text-slate-600 font-mono">{filtered.length} entries</span>
          </div>
        </div>

        <div
          ref={logRef}
          className="h-[500px] overflow-y-auto p-4 font-mono text-xs space-y-0.5 bg-slate-950"
        >
          {filtered.length === 0 ? (
            <div className="text-slate-600 text-center py-8">No agent activity yet — run a demo or analysis</div>
          ) : (
            filtered.map((log, idx) => (
              <div
                key={idx}
                className={`flex gap-3 py-1 items-start hover:bg-slate-900/50 rounded px-1 transition-colors ${
                  log.is_granite_output ? 'bg-purple-950/20' : ''
                }`}
              >
                <span className="text-slate-700 flex-shrink-0 w-16">{log.timestamp}</span>
                <span className={`flex-shrink-0 font-semibold ${AGENT_COLORS[log.agent] || 'text-slate-400'}`}>
                  [{log.agent}]
                </span>
                <span className={`flex-shrink-0 ${EVENT_COLORS[log.event_type] || 'text-slate-500'}`}>
                  [{log.event_type}]
                </span>
                <span className={`flex-1 ${log.is_granite_output ? 'text-purple-300' : 'text-slate-300'} leading-relaxed`}>
                  {log.message}
                  {log.is_granite_output && (
                    <span className="ml-2 inline-flex items-center gap-1 text-purple-500">
                      <Cpu size={10} /> Granite
                    </span>
                  )}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="card-sm">
        <div className="label-text mb-2">Agent Color Legend</div>
        <div className="flex flex-wrap gap-4 text-xs">
          {Object.entries(AGENT_COLORS).map(([agent, color]) => (
            <span key={agent} className={`flex items-center gap-1.5 ${color}`}>
              <span className="w-2 h-2 rounded-full bg-current" />
              {agent}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
