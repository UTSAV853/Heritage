import React, { useState, useEffect } from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Shield, Activity, Users, AlertTriangle,
  BookOpen, FileText, Zap, Settings, Menu, X, Bot,
  ChevronRight, Bell, Wifi, WifiOff
} from 'lucide-react'
import Dashboard from './pages/Dashboard'
import HeritageSites from './pages/HeritageSites'
import StructuralMonitoring from './pages/StructuralMonitoring'
import VisitorFlow from './pages/VisitorFlow'
import EncroachmentDetection from './pages/EncroachmentDetection'
import HeritageGuide from './pages/HeritageGuide'
import ConservationReports from './pages/ConservationReports'
import AgentActivity from './pages/AgentActivity'
import DemoMode from './pages/DemoMode'
import ChatAssistant from './components/ChatAssistant'
import { getActivityLog } from './api/client'

const NAV_ITEMS = [
  { path: '/', label: 'Command Center', icon: LayoutDashboard, exact: true },
  { path: '/sites', label: 'Heritage Sites', icon: Shield },
  { path: '/structural', label: 'Structural Monitor', icon: Activity },
  { path: '/visitor', label: 'Visitor Flow', icon: Users },
  { path: '/encroachment', label: 'Encroachment', icon: AlertTriangle },
  { path: '/guide', label: 'AI Heritage Guide', icon: BookOpen },
  { path: '/reports', label: 'Conservation Reports', icon: FileText },
  { path: '/agents', label: 'Agent Activity', icon: Zap },
  { path: '/demo', label: '▶ Hackathon Demo', icon: Bot },
]

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [chatOpen, setChatOpen] = useState(false)
  const [liveAlerts, setLiveAlerts] = useState(0)
  const [backendOnline, setBackendOnline] = useState(true)
  // Poll for live alerts
  useEffect(() => {
    const check = async () => {
      try {
        const res = await getActivityLog(5)
        setLiveAlerts(res.data.count || 0)
        setBackendOnline(true)
      } catch {
        setBackendOnline(false)
      }
    }
    check()
    const iv = setInterval(check, 10000)
    return () => clearInterval(iv)
  }, [])

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      {/* Sidebar */}
      <aside className={`
        flex flex-col bg-slate-900 border-r border-slate-800 transition-all duration-300
        ${sidebarOpen ? 'w-64' : 'w-16'}
        relative z-20
      `}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-800 min-h-[64px]">
          <div className="w-8 h-8 rounded-lg bg-heritage-600 flex items-center justify-center flex-shrink-0">
            <Shield size={16} className="text-white" />
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <div className="text-sm font-bold text-white leading-tight whitespace-nowrap">HeritageGuardian</div>
              <div className="text-xs text-heritage-400 whitespace-nowrap">AI Conservation Platform</div>
            </div>
          )}
        </div>

        {/* Status indicator */}
        {sidebarOpen && (
          <div className={`mx-3 mt-2 px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 ${
            backendOnline ? 'bg-green-950/50 text-green-400 border border-green-900' : 'bg-red-950/50 text-red-400 border border-red-900'
          }`}>
            {backendOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
            {backendOnline ? 'All Agents Online' : 'Backend Offline'}
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ path, label, icon: Icon, exact }) => (
            <NavLink
              key={path}
              to={path}
              end={exact}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                ${isActive
                  ? 'bg-heritage-800/60 text-heritage-200 border border-heritage-700/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }
                ${label.includes('Demo') ? 'mt-2 border border-heritage-700/30 bg-heritage-950/40 text-heritage-300' : ''}
              `}
            >
              <Icon size={16} className="flex-shrink-0" />
              {sidebarOpen && <span className="truncate">{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* IBM powered badge */}
        {sidebarOpen && (
          <div className="mx-3 mb-3 p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <div className="text-xs text-slate-500 text-center">Powered by</div>
            <div className="text-xs text-slate-300 text-center font-semibold">IBM Granite LLM</div>
            <div className="text-xs text-slate-500 text-center">IBM Cloud Ready</div>
          </div>
        )}

        {/* Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center hover:bg-slate-600 transition-colors"
        >
          {sidebarOpen ? <ChevronRight size={12} className="rotate-180 text-slate-300" /> : <ChevronRight size={12} className="text-slate-300" />}
        </button>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-slate-900/80 backdrop-blur border-b border-slate-800 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-400 hover:text-slate-200 lg:hidden">
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-sm font-bold text-slate-100">HeritageGuardian AI</h1>
              <p className="text-xs text-slate-400">Smart Heritage Conservation & Visitor Experience Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs text-slate-500 hidden md:block">Gujarat Heritage Sites · IBM Granite AI</div>
            <div className="relative">
              <Bell size={18} className="text-slate-400 hover:text-slate-200 cursor-pointer" />
              {liveAlerts > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full text-[8px] flex items-center justify-center text-white font-bold">
                  {Math.min(liveAlerts, 9)}
                </span>
              )}
            </div>
            <button
              onClick={() => setChatOpen(!chatOpen)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                chatOpen ? 'bg-purple-800 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              <Bot size={14} />
              <span className="hidden sm:block">AI Chat</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/sites" element={<HeritageSites />} />
            <Route path="/structural" element={<StructuralMonitoring />} />
            <Route path="/visitor" element={<VisitorFlow />} />
            <Route path="/encroachment" element={<EncroachmentDetection />} />
            <Route path="/guide" element={<HeritageGuide />} />
            <Route path="/reports" element={<ConservationReports />} />
            <Route path="/agents" element={<AgentActivity />} />
            <Route path="/demo" element={<DemoMode />} />
          </Routes>
        </main>
      </div>

      {/* Chat assistant panel */}
      {chatOpen && <ChatAssistant onClose={() => setChatOpen(false)} />}
    </div>
  )
}
