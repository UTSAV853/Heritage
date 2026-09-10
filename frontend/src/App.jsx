import React, { useState, useEffect, useRef } from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Shield, Activity, Users, AlertTriangle,
  BookOpen, FileText, Zap, Settings, Menu, X, Bot,
  ChevronRight, Bell, Wifi, WifiOff, Globe, Database, Edit3
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
import SourceManagement from './pages/SourceManagement'
import DataMonitoring from './pages/DataMonitoring'
import ManualDataEntry from './pages/ManualDataEntry'
import InsightsAlerts from './pages/InsightsAlerts'
import ChatAssistant from './components/ChatAssistant'
import NotificationsDropdown from './components/NotificationsDropdown'
import {
  getActivityLog, checkBackendHealth, getCustomApiUrl, setCustomApiUrl, getUnifiedAlerts
} from './api/client'

const NAV_ITEMS = [
  { path: '/', label: 'Command Center', icon: LayoutDashboard, exact: true },
  { path: '/sites', label: 'Heritage Sites', icon: Shield },
  { path: '/visitor', label: 'Visitor Intelligence', icon: Users },
  { path: '/structural', label: 'Structural Health', icon: Activity },
  { path: '/encroachment', label: 'Encroachment', icon: AlertTriangle },
  { path: '/reports', label: 'Conservation Reports', icon: FileText },
  { path: '/insights', label: 'Insights & Alerts', icon: Bell },
  { path: '/data', label: 'Data Monitoring', icon: Database },
  { path: '/sources', label: 'Data Sources', icon: Globe },
  { path: '/data-entry', label: 'Field Data Entry', icon: Edit3 },
  { path: '/guide', label: 'Cultural Guide', icon: BookOpen },
  { path: '/agents', label: 'Agent Operations', icon: Zap },
]

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [chatOpen, setChatOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [liveAlerts, setLiveAlerts] = useState(4)
  const [backendStatus, setBackendStatus] = useState({ online: false, mode: 'demo', message: 'Demo Simulation Engine Active' })
  const [apiUrlInput, setApiUrlInput] = useState(getCustomApiUrl())

  // Notifications state
  const [notifOpen, setNotifOpen] = useState(false)
  const notifRef = useRef(null)
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      type: 'ALERT',
      severity: 'Critical',
      title: 'High visitor pressure alert',
      message: 'Modhera Sun Temple headcount reached 410 visitors (82% carrying capacity).',
      site: 'Modhera Sun Temple',
      timeAgo: '10 min ago',
      read: false,
      link: '/insights'
    },
    {
      id: 'notif-2',
      type: 'REPORT',
      severity: 'Moderate',
      title: 'New conservation report',
      message: 'Multi-agent structural and condition assessment generated for Rani Ki Vav.',
      site: 'Rani Ki Vav',
      timeAgo: '2 hours ago',
      read: false,
      link: '/reports'
    },
    {
      id: 'notif-3',
      type: 'SYSTEM',
      severity: 'Low',
      title: 'Data updated from UNESCO',
      message: 'World Heritage List gazetteer and boundary polygons synchronized.',
      site: 'Ahmedabad Walled City',
      timeAgo: '4 hours ago',
      read: false,
      link: '/sources'
    },
    {
      id: 'notif-4',
      type: 'MANUAL_ENTRY',
      severity: 'Low',
      title: 'Field inspection logged',
      message: 'Physical condition survey recorded by ASI inspection warden.',
      site: 'Sidi Saiyyed Mosque',
      timeAgo: 'Yesterday',
      read: true,
      link: '/data'
    }
  ])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const handleClearAllNotifications = () => {
    setNotifications([])
    setNotifOpen(false)
  }

  const handleNotificationClick = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const checkStatus = async () => {
    const status = await checkBackendHealth()
    setBackendStatus(status)
    try {
      const res = await getActivityLog(5)
      setLiveAlerts(res.data?.count || 4)
    } catch {
      setLiveAlerts(4)
    }
  }

  useEffect(() => {
    checkStatus()
    const iv = setInterval(checkStatus, 15000)
    return () => clearInterval(iv)
  }, [])

  const handleSaveApiUrl = (e) => {
    e.preventDefault()
    setCustomApiUrl(apiUrlInput.trim())
    setSettingsOpen(false)
    checkStatus()
    window.location.reload()
  }

  const handleResetToDemo = () => {
    setCustomApiUrl('')
    setApiUrlInput('')
    setSettingsOpen(false)
    checkStatus()
    window.location.reload()
  }

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
          <div className="mx-3 mt-2 flex items-center gap-1.5">
            <button
              onClick={() => setSettingsOpen(true)}
              title="Click to configure backend connection"
              className={`flex-1 px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                backendStatus.online
                  ? 'bg-green-950/50 text-green-400 border border-green-800/80 hover:bg-green-900/40'
                  : 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/50 hover:bg-emerald-900/30'
              }`}
            >
              <span className="flex items-center gap-2 font-medium">
                {backendStatus.online ? <Wifi size={12} className="text-green-400" /> : <Zap size={12} className="text-emerald-400" />}
                {backendStatus.online ? 'Backend Connected' : 'Standalone Pipeline Active'}
              </span>
              <Settings size={12} className="text-slate-400 hover:text-slate-200" />
            </button>
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
            {/* Notifications Button & Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className={`p-2 rounded-lg transition-colors relative flex items-center justify-center ${
                  notifOpen ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
                title="Notifications"
                aria-label="Toggle notifications panel"
              >
                <Bell size={18} />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-orange-500 rounded-full text-[10px] flex items-center justify-center text-white font-extrabold shadow ring-2 ring-slate-900 animate-pulse">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>

              {notifOpen && (
                <NotificationsDropdown
                  notifications={notifications}
                  onMarkAllAsRead={handleMarkAllAsRead}
                  onClearAll={handleClearAllNotifications}
                  onNotificationClick={handleNotificationClick}
                  onClose={() => setNotifOpen(false)}
                />
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
            <Route path="/reports" element={<ConservationReports />} />
            <Route path="/insights" element={<InsightsAlerts />} />
            <Route path="/dashboard/insights" element={<InsightsAlerts />} />
            <Route path="/alerts" element={<InsightsAlerts />} />
            <Route path="/data" element={<DataMonitoring />} />
            <Route path="/dashboard/data" element={<DataMonitoring />} />
            <Route path="/sources" element={<SourceManagement />} />
            <Route path="/dashboard/sources" element={<SourceManagement />} />
            <Route path="/data-entry" element={<ManualDataEntry />} />
            <Route path="/dashboard/data-entry" element={<ManualDataEntry />} />
            <Route path="/guide" element={<HeritageGuide />} />
            <Route path="/agents" element={<AgentActivity />} />
            <Route path="/demo" element={<DemoMode />} />
          </Routes>
        </main>
      </div>

      {/* Chat assistant panel */}
      {chatOpen && <ChatAssistant onClose={() => setChatOpen(false)} />}

      {/* Settings modal */}
      {settingsOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Settings size={18} className="text-heritage-400" />
                <h3 className="text-base font-semibold text-white">System & Backend Settings</h3>
              </div>
              <button onClick={() => setSettingsOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
                <div className="text-xs text-slate-400 mb-1">Current Active Mode</div>
                <div className="flex items-center gap-2 font-medium">
                  {backendStatus.online ? (
                    <span className="text-green-400 flex items-center gap-1.5">
                      <Wifi size={14} /> Live Backend Connected
                    </span>
                  ) : (
                    <span className="text-emerald-400 flex items-center gap-1.5">
                      <Zap size={14} /> Client Demo Engine Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  {backendStatus.online
                    ? 'Requests are proxied live to the FastAPI multi-agent backend server.'
                    : 'Running in self-contained simulation mode. All 5 AI agents, charts, telemetry, and IBM Granite storytelling are fully functional client-side.'}
                </p>
              </div>

              <form onSubmit={handleSaveApiUrl} className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Custom Backend API URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={apiUrlInput}
                    onChange={(e) => setApiUrlInput(e.target.value)}
                    placeholder="e.g. https://your-heritage-api.vercel.app/api"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-heritage-500"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Leave blank to use the built-in Demo Simulation Engine on GitHub Pages.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleResetToDemo}
                    className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                  >
                    Reset to Demo Engine
                  </button>
                  <button
                    type="submit"
                    className="btn-primary text-xs py-1.5 px-3"
                  >
                    Save & Reconnect
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
