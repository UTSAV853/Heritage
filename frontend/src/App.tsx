import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import Nav from './components/Nav'
import LandingPage from './pages/LandingPage'
import VisitorGuidePage from './pages/VisitorGuidePage'
import VisitorFlowPage from './pages/VisitorFlowPage'
import DashboardPage from './pages/DashboardPage'
import AlertsPage from './pages/AlertsPage'
import AgentsPage from './pages/AgentsPage'
import ReportsPage from './pages/ReportsPage'

export default function App() {
  return (
    <HashRouter>
      <Nav />
      <main className="content">
        <Routes>
          {/* Public / Visitor */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/visitor" element={<Navigate to="/visitor/guide" replace />} />
          <Route path="/visitor/guide" element={<VisitorGuidePage />} />
          <Route path="/visitor/itinerary" element={<VisitorGuidePage />} />
          <Route path="/visitor/explore" element={<VisitorFlowPage />} />

          {/* Authority / Dashboard */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/sites" element={<DashboardPage />} />
          <Route path="/dashboard/visitor-flow" element={<VisitorFlowPage />} />
          <Route path="/dashboard/alerts" element={<AlertsPage />} />
          <Route path="/dashboard/reports" element={<ReportsPage />} />
          <Route path="/dashboard/agents" element={<AgentsPage />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </HashRouter>
  )
}
