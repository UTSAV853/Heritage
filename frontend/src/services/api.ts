import axios from 'axios'
import type {
  Site, VisitorFlowResult, HeritageGuideResult, OrchestratorResult,
  Alert, AgentRunSummary, AgentsListResponse, ConservationReport,
} from '../types/api'

const BASE = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: BASE,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
})

// Sites
export const getSites = () => api.get<Site[]>('/sites').then(r => r.data)
export const getSite = (id: string) => api.get<Site>(`/sites/${id}`).then(r => r.data)

// Visitor Flow
export const getVisitorFlow = (siteId: string) =>
  api.get<VisitorFlowResult>(`/visitor-flow/${siteId}`).then(r => r.data)

export const analyzeVisitorFlow = (siteId: string, overrideVisitors?: number) =>
  api.post<VisitorFlowResult>('/visitor-flow/analyze', {
    site_id: siteId,
    ...(overrideVisitors !== undefined ? { override_visitors: overrideVisitors } : {}),
  }).then(r => r.data)

// Heritage Guide
export const generateHeritageGuide = (params: {
  site_id: string
  duration_minutes: number
  interests: string[]
  crowd_preference: string
  complexity: string
}) => api.post<HeritageGuideResult>('/heritage-guide', params).then(r => r.data)

// Orchestrator
export const runOrchestrator = (params: {
  site_id: string
  duration_minutes: number
  interests: string[]
  crowd_preference: string
  complexity: string
  run_conservation?: boolean
}) => api.post<OrchestratorResult>('/orchestrator/run', params).then(r => r.data)

// Alerts
export const getAlerts = (siteId?: string, severity?: string) => {
  const params: Record<string, string> = {}
  if (siteId) params.site_id = siteId
  if (severity) params.severity = severity
  return api.get<Alert[]>('/alerts', { params }).then(r => r.data)
}

export const updateAlertStatus = (alertId: string, status: string) =>
  api.patch(`/alerts/${alertId}/status`, null, { params: { status } }).then(r => r.data)

// Conservation
export const generateConservationReport = (siteId: string) =>
  api.post<ConservationReport>('/conservation/report', {
    site_id: siteId,
    include_visitor_flow: true,
    include_structural: true,
    include_encroachment: true,
  }).then(r => r.data)

export const getSiteConservationHistory = (siteId: string) =>
  api.get<ConservationReport[]>(`/conservation/sites/${siteId}`).then(r => r.data)

// Agents
export const getAgents = () =>
  api.get<AgentsListResponse>('/agents').then(r => r.data)

export const getAgentRuns = (params?: { request_id?: string; agent?: string; limit?: number }) =>
  api.get<AgentRunSummary[]>('/agents/runs', { params }).then(r => r.data)

// Health
export const getHealth = () =>
  api.get('/health').then(r => r.data)

export default api
