import React, { useState } from 'react'
import {
  Bot, Zap, RefreshCw, CheckCircle, ArrowRight, Play,
  Shield, Users, AlertTriangle, FileText, BookOpen, Cpu
} from 'lucide-react'
import {
  getStructuralDemo, getVisitorDemo, getEncroachmentDemo,
  getStoryDemo, getConservationDemo, runScenarioA, runScenarioB,
  resetDemo, getActivityLog
} from '../api/client'
import toast from 'react-hot-toast'

const DEMO_STEPS = [
  { id: 'dashboard', label: 'Dashboard Overview', icon: Shield, desc: 'Command Center with live metrics' },
  { id: 'visitor', label: 'Visitor Alert Demo', icon: Users, desc: 'Simulate high-density crowd event' },
  { id: 'structural', label: 'Structural Analysis', icon: Shield, desc: 'AI image analysis + risk scoring' },
  { id: 'encroachment', label: 'Encroachment Detection', icon: AlertTriangle, desc: 'Boundary monitoring analysis' },
  { id: 'scenario_a', label: 'Agent Collaboration A', icon: Zap, desc: 'Visitor × Structural cross-agent' },
  { id: 'scenario_b', label: 'Agent Collaboration B', icon: Zap, desc: 'Encroachment × Structural cross-agent' },
  { id: 'report', label: 'Conservation Report', icon: FileText, desc: 'Full Granite-powered report' },
  { id: 'story', label: 'Heritage Storytelling', icon: BookOpen, desc: 'Personalized AI cultural guide' },
]

export default function DemoMode() {
  const [currentStep, setCurrentStep] = useState(null)
  const [completedSteps, setCompletedSteps] = useState([])
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState({})
  const [activityLog, setActivityLog] = useState([])
  const [fullDemoRunning, setFullDemoRunning] = useState(false)

  const markComplete = (id) => setCompletedSteps(prev => [...new Set([...prev, id])])

  const runStep = async (stepId) => {
    setCurrentStep(stepId)
    setLoading(true)
    try {
      let result
      switch (stepId) {
        case 'dashboard':
          await new Promise(r => setTimeout(r, 800))
          result = { message: 'Dashboard loaded with live metrics from all agents' }
          break
        case 'visitor':
          result = (await getVisitorDemo('Modhera Sun Temple')).data
          break
        case 'structural':
          result = (await getStructuralDemo('Modhera Sun Temple')).data
          break
        case 'encroachment':
          result = (await getEncroachmentDemo('Modhera Sun Temple')).data
          break
        case 'scenario_a':
          result = (await runScenarioA('Modhera Sun Temple', 1)).data
          break
        case 'scenario_b':
          result = (await runScenarioB('Modhera Sun Temple', 1)).data
          break
        case 'report':
          result = (await getConservationDemo()).data
          break
        case 'story':
          result = (await getStoryDemo('Modhera Sun Temple', 'English', 'Adult (30-60)')).data
          break
        default:
          result = {}
      }
      setResults(prev => ({ ...prev, [stepId]: result }))
      markComplete(stepId)
      toast.success(`✅ ${DEMO_STEPS.find(s => s.id === stepId)?.label} complete`)

      // Refresh activity log
      const logRes = await getActivityLog(30)
      setActivityLog(logRes.data.logs || [])
    } catch (err) {
      toast.error(`Step failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const runFullDemo = async () => {
    setFullDemoRunning(true)
    setCompletedSteps([])
    setResults({})
    for (const step of DEMO_STEPS) {
      await runStep(step.id)
      await new Promise(r => setTimeout(r, 1000))
    }
    setFullDemoRunning(false)
    toast.success('🎉 Full demo complete!')
  }

  const handleReset = async () => {
    try {
      await resetDemo()
      setCompletedSteps([])
      setResults({})
      setCurrentStep(null)
      setActivityLog([])
      toast.success('Demo data reset!')
    } catch { toast.error('Reset failed') }
  }

  const scenarioResult = results['scenario_a'] || results['scenario_b']
  const activeScenario = results['scenario_a'] ? 'scenario_a' : results['scenario_b'] ? 'scenario_b' : null

  return (
    <div className="space-y-5 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Hackathon Demo Mode</h1>
        <p className="text-slate-400 text-sm mt-1">
          Step-by-step demonstration of HeritageGuardian AI capabilities — runs in ~3 minutes
        </p>
      </div>

      {/* Demo controls */}
      <div className="card border-heritage-800/40 bg-gradient-to-br from-slate-900 to-heritage-950/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Bot size={20} className="text-heritage-400" />
              HeritageGuardian AI — Full Demo
            </div>
            <div className="text-sm text-slate-400 mt-1">
              Demonstrates: 5 AI agents · IBM Granite reasoning · Cross-agent collaboration · Gujarat heritage
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleReset} className="btn-secondary text-sm">
              <RefreshCw size={14} /> Reset
            </button>
            <button
              onClick={runFullDemo}
              disabled={loading || fullDemoRunning}
              className="btn-primary pulse-glow"
            >
              {fullDemoRunning
                ? <><RefreshCw size={14} className="animate-spin" /> Running Demo...</>
                : <><Play size={14} /> Start Full Demo</>
              }
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-1 mb-2">
          {DEMO_STEPS.map((step, idx) => (
            <React.Fragment key={step.id}>
              <div className={`flex-1 h-1.5 rounded-full transition-all ${
                completedSteps.includes(step.id) ? 'bg-green-500' :
                currentStep === step.id && loading ? 'bg-heritage-500 animate-pulse' :
                'bg-slate-700'
              }`} />
              {idx < DEMO_STEPS.length - 1 && <div className="w-1" />}
            </React.Fragment>
          ))}
        </div>
        <div className="text-xs text-slate-500 text-right">
          {completedSteps.length} / {DEMO_STEPS.length} steps complete
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Step list */}
        <div className="space-y-2">
          {DEMO_STEPS.map((step) => {
            const Icon = step.icon
            const done = completedSteps.includes(step.id)
            const active = currentStep === step.id && loading
            return (
              <div
                key={step.id}
                className={`card-sm flex items-center justify-between cursor-pointer hover:border-slate-600 transition-all ${
                  done ? 'border-green-800/50 bg-green-950/10' :
                  active ? 'border-heritage-700 bg-heritage-950/20' : ''
                }`}
                onClick={() => !loading && runStep(step.id)}
              >
                <div className="flex items-center gap-3">
                  {done ? (
                    <CheckCircle size={18} className="text-green-400 flex-shrink-0" />
                  ) : active ? (
                    <RefreshCw size={18} className="text-heritage-400 animate-spin flex-shrink-0" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-slate-600 flex-shrink-0" />
                  )}
                  <div>
                    <div className="text-sm font-medium text-slate-200">{step.label}</div>
                    <div className="text-xs text-slate-500">{step.desc}</div>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); !loading && runStep(step.id) }}
                  disabled={loading}
                  className={`btn-secondary text-xs py-1 px-2 ${done ? 'border-green-800' : ''}`}
                >
                  {done ? 'Re-run' : <><Play size={10} /> Run</>}
                </button>
              </div>
            )
          })}
        </div>

        {/* Result panel */}
        <div className="space-y-4">
          {/* Active result */}
          {currentStep && results[currentStep] && (
            <div className="card slide-in">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle size={16} className="text-green-400" />
                <span className="text-sm font-semibold text-slate-200">
                  {DEMO_STEPS.find(s => s.id === currentStep)?.label}
                </span>
              </div>

              {currentStep === 'structural' && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Risk Score</span>
                    <span className="font-bold text-orange-400">{results.structural?.risk_score}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Risk Level</span>
                    <span className="text-slate-200">{results.structural?.risk_level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Issues Detected</span>
                    <span className="text-slate-200">{results.structural?.detected_issues?.length}</span>
                  </div>
                  {results.structural?.granite_reasoning && (
                    <div className="granite-output text-xs mt-2">{results.structural.granite_reasoning.slice(0, 200)}...</div>
                  )}
                </div>
              )}

              {currentStep === 'visitor' && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Visitors</span>
                    <span className="font-bold text-blue-400">{results.visitor?.current_visitor_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Occupancy</span>
                    <span className="text-slate-200">{results.visitor?.occupancy_percentage?.toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Crowd Level</span>
                    <span className="text-slate-200">{results.visitor?.crowd_level} — {results.visitor?.crowd_label}</span>
                  </div>
                </div>
              )}

              {currentStep === 'encroachment' && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Detection</span>
                    <span className={results.encroachment?.encroachment_detected ? 'text-orange-400 font-bold' : 'text-green-400'}>
                      {results.encroachment?.encroachment_detected ? 'POTENTIAL DETECTED' : 'Clear'}
                    </span>
                  </div>
                  {results.encroachment?.encroachment_type && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Type</span>
                      <span className="text-slate-200">{results.encroachment.encroachment_type}</span>
                    </div>
                  )}
                  <div className="text-xs text-slate-500 mt-1">{results.encroachment?.disclaimer?.slice(0, 100)}...</div>
                </div>
              )}

              {(currentStep === 'scenario_a' || currentStep === 'scenario_b') && results[currentStep] && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-heritage-400 mb-2">{results[currentStep].title}</div>
                  {results[currentStep].workflow?.map(step => (
                    <div key={step.step} className="flex items-start gap-2 text-xs">
                      <span className="w-4 h-4 rounded-full bg-slate-700 flex items-center justify-center text-slate-400 flex-shrink-0 text-xs">
                        {step.step}
                      </span>
                      <span className="font-medium text-slate-400 flex-shrink-0 w-24">{step.agent.split(' ')[0]}</span>
                      <span className="text-slate-300">{step.message}</span>
                    </div>
                  ))}
                  <div className="mt-2 p-2 bg-heritage-950/30 border border-heritage-800/40 rounded text-xs text-heritage-200">
                    <strong>Recommendation:</strong> {results[currentStep].recommendation}
                  </div>
                </div>
              )}

              {currentStep === 'report' && results.report && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Overall Risk</span>
                    <span className="font-bold text-orange-400">{results.report.overall_risk?.level}</span>
                  </div>
                  <div className="granite-output text-xs">{results.report.executive_summary?.slice(0, 250)}...</div>
                </div>
              )}

              {currentStep === 'story' && results.story && (
                <div className="space-y-2 text-sm">
                  <div className="text-slate-300">{results.story.short_story?.slice(0, 200)}...</div>
                  {results.story.did_you_know?.[0] && (
                    <div className="text-xs italic text-yellow-200/80 bg-yellow-950/20 border border-yellow-900/30 p-2 rounded">
                      💡 {results.story.did_you_know[0]}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Live activity feed */}
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={14} className="text-yellow-400" />
              <span className="text-sm font-semibold text-slate-200">Live Agent Activity</span>
            </div>
            <div className="space-y-0.5 max-h-48 overflow-y-auto font-mono">
              {activityLog.length === 0 ? (
                <div className="text-slate-600 text-xs text-center py-4">Run a demo step to see agent activity</div>
              ) : (
                activityLog.map((log, idx) => (
                  <div key={idx} className={`text-xs py-0.5 flex gap-2 ${log.is_granite_output ? 'text-purple-300' : 'text-slate-400'}`}>
                    <span className="text-slate-600 w-14 flex-shrink-0">{log.timestamp}</span>
                    <span className={`font-semibold flex-shrink-0 ${
                      log.agent?.includes('Granite') ? 'text-purple-400' :
                      log.agent?.includes('Orchestrator') ? 'text-heritage-400' : 'text-slate-400'
                    }`}>[{log.agent?.split(' ')[0]}]</span>
                    <span className="flex-1">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* IBM Granite badge */}
          <div className="card-sm border-purple-900/40 bg-purple-950/20 text-center">
            <Cpu size={16} className="text-purple-400 mx-auto mb-1" />
            <div className="text-xs font-semibold text-purple-300">IBM Granite LLM Integration</div>
            <div className="text-xs text-slate-500 mt-0.5">
              All AI reasoning powered by IBM Granite model.
              Configure GRANITE_API_KEY in .env for live inference.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
