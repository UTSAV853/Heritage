import axios from 'axios'
import {
  DEMO_SITES,
  getMockOverview,
  getMockVisitorData,
  getMockStructuralAnalysis,
  getMockEncroachmentAnalysis,
  getMockStory,
  getMockConservationReport,
  getMockActivityLogs,
  getMockChatResponse,
  getMockScenarioA,
  getMockScenarioB,
  getMockSources,
  getMockDataRecords,
  getMockDataQuality,
  getMockAlerts,
  getMockInsights
} from './mockData'

// Detect API base URL
export const getCustomApiUrl = () => {
  return localStorage.getItem('heritage_api_url') || import.meta.env.VITE_API_URL || ''
}

export const setCustomApiUrl = (url) => {
  if (url) {
    localStorage.setItem('heritage_api_url', url)
  } else {
    localStorage.removeItem('heritage_api_url')
  }
}

// Check if running on a static host (like GitHub Pages) without an explicit API URL
const isStaticHost = () => {
  if (typeof window === 'undefined') return false
  const host = window.location.hostname
  return host.includes('github.io') || host.includes('pages.dev')
}

const resolveBaseUrl = () => {
  const custom = getCustomApiUrl()
  if (custom) return custom.endsWith('/') ? custom.slice(0, -1) : custom
  if (isStaticHost()) return '' // No backend co-located on static hosts
  return '/api'
}

const api = axios.create({
  baseURL: resolveBaseUrl() || '/api',
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' }
})

// Track backend availability
let _isLiveBackend = null

export const isLiveBackend = () => _isLiveBackend === true

export const checkBackendHealth = async () => {
  const customUrl = getCustomApiUrl()
  if (!customUrl && isStaticHost()) {
    _isLiveBackend = false
    return { online: false, mode: 'demo', message: 'Demo Simulation Engine Active (GitHub Pages)' }
  }

  try {
    const targetUrl = (resolveBaseUrl() || '/api') + '/health'
    const res = await axios.get(targetUrl, { timeout: 3000 })
    if (res.status === 200) {
      _isLiveBackend = true
      return { online: true, mode: 'live', message: 'Connected to Live Backend Server' }
    }
  } catch (e) {
    _isLiveBackend = false
  }

  return { online: false, mode: 'demo', message: 'Demo Simulation Engine Active' }
}

// Standard mock Axios response format
const mockResponse = (data) => Promise.resolve({
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {}
})

// Seamless fallback wrapper: Attempts live backend; if offline or fails, serves simulated data smoothly
async function withFallback(apiCall, mockGenerator) {
  // If we know we're on static host without custom URL, immediately return mock data to save latency
  if (_isLiveBackend === false || (!getCustomApiUrl() && isStaticHost())) {
    return mockResponse(typeof mockGenerator === 'function' ? mockGenerator() : mockGenerator)
  }

  try {
    const res = await apiCall()
    _isLiveBackend = true
    return res
  } catch (err) {
    _isLiveBackend = false
    return mockResponse(typeof mockGenerator === 'function' ? mockGenerator() : mockGenerator)
  }
}

// ─────────────────────────────────────────────
// SITES
// ─────────────────────────────────────────────
export const getSites = () =>
  withFallback(
    () => api.get('/sites/'),
    DEMO_SITES
  )

export const getSite = (id) =>
  withFallback(
    () => api.get(`/sites/${id}`),
    () => DEMO_SITES.find(s => s.id === Number(id)) || DEMO_SITES[0]
  )

export const getSiteSummary = (id) =>
  withFallback(
    () => api.get(`/sites/${id}/summary`),
    () => {
      const site = DEMO_SITES.find(s => s.id === Number(id)) || DEMO_SITES[0]
      return {
        site,
        alerts: {
          structural: 2,
          encroachment: 1,
          conservation_tasks: 3
        }
      }
    }
  )

// ─────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────
export const getDashboardOverview = () =>
  withFallback(
    () => api.get('/agents/dashboard/overview'),
    getMockOverview
  )

// ─────────────────────────────────────────────
// STRUCTURAL AGENT
// ─────────────────────────────────────────────
export const analyzeStructural = (formData) =>
  withFallback(
    () => api.post('/agents/structural/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    () => {
      const siteName = formData?.get ? formData.get('site_name') : 'Modhera Sun Temple'
      return getMockStructuralAnalysis(siteName || 'Modhera Sun Temple')
    }
  )

export const getStructuralDemo = (site = 'Modhera Sun Temple') =>
  withFallback(
    () => api.get(`/agents/structural/demo?site_name=${encodeURIComponent(site)}`),
    () => getMockStructuralAnalysis(site)
  )

// ─────────────────────────────────────────────
// VISITOR AGENT
// ─────────────────────────────────────────────
export const getVisitorData = (siteId) =>
  withFallback(
    () => api.get(`/agents/visitor/${siteId}`),
    () => {
      const site = DEMO_SITES.find(s => s.id === Number(siteId)) || DEMO_SITES[0]
      return getMockVisitorData(site.name)
    }
  )

export const getVisitorDemo = (site = 'Modhera Sun Temple') =>
  withFallback(
    () => api.get(`/agents/visitor/demo/${encodeURIComponent(site)}`),
    () => getMockVisitorData(site)
  )

// ─────────────────────────────────────────────
// ENCROACHMENT AGENT
// ─────────────────────────────────────────────
export const analyzeEncroachment = (formData) =>
  withFallback(
    () => api.post('/agents/encroachment/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    () => {
      const siteName = formData?.get ? formData.get('site_name') : 'Modhera Sun Temple'
      return getMockEncroachmentAnalysis(siteName || 'Modhera Sun Temple')
    }
  )

export const getEncroachmentDemo = (site = 'Modhera Sun Temple') =>
  withFallback(
    () => api.get(`/agents/encroachment/demo?site_name=${encodeURIComponent(site)}`),
    () => getMockEncroachmentAnalysis(site)
  )

// ─────────────────────────────────────────────
// STORYTELLING AGENT
// ─────────────────────────────────────────────
export const generateStory = (data) =>
  withFallback(
    () => api.post('/agents/storytelling/generate', data),
    () => getMockStory(data?.site_name, data?.language, data?.age_group)
  )

export const getStoryDemo = (site, language = 'English', ageGroup = 'Adult (30-60)') =>
  withFallback(
    () => api.get(`/agents/storytelling/demo?site=${encodeURIComponent(site)}&language=${language}&age_group=${encodeURIComponent(ageGroup)}`),
    () => getMockStory(site, language, ageGroup)
  )

// ─────────────────────────────────────────────
// CONSERVATION REPORT
// ─────────────────────────────────────────────
export const getConservationReport = (siteId, format = 'json') =>
  withFallback(
    () => api.get(`/agents/conservation/report/${siteId}?format=${format}`, {
      responseType: format === 'csv' ? 'text' : 'json'
    }),
    () => {
      if (format === 'csv') {
        const site = DEMO_SITES.find(s => s.id === Number(siteId)) || DEMO_SITES[0]
        return `Report ID,Site Name,Risk Score,Risk Level,Open Tasks,Authorized Authority\nHG-${site.id},${site.name},77.3,High,4,ASI Gujarat Circle / IBM Granite Engine`
      }
      return getMockConservationReport(siteId)
    }
  )

export const getConservationDemo = () =>
  withFallback(
    () => api.get('/agents/conservation/demo'),
    () => getMockConservationReport(1)
  )

// ─────────────────────────────────────────────
// CROSS-AGENT SCENARIOS
// ─────────────────────────────────────────────
export const runScenarioA = (siteName = 'Modhera Sun Temple', siteId = 1) =>
  withFallback(
    () => api.post(`/agents/orchestrator/scenario-a?site_name=${encodeURIComponent(siteName)}&site_id=${siteId}`),
    () => getMockScenarioA(siteName, siteId)
  )

export const runScenarioB = (siteName = 'Modhera Sun Temple', siteId = 1) =>
  withFallback(
    () => api.post(`/agents/orchestrator/scenario-b?site_name=${encodeURIComponent(siteName)}&site_id=${siteId}`),
    () => getMockScenarioB(siteName, siteId)
  )

// ─────────────────────────────────────────────
// ACTIVITY LOG
// ─────────────────────────────────────────────
export const getActivityLog = (limit = 50) =>
  withFallback(
    () => api.get(`/agents/activity-log?limit=${limit}`),
    () => {
      const logs = getMockActivityLogs(limit)
      return { logs, count: logs.length }
    }
  )

// ─────────────────────────────────────────────
// AI CHAT
// ─────────────────────────────────────────────
export const sendChatMessage = (query, siteContext = 'Modhera Sun Temple') =>
  withFallback(
    () => api.post('/agents/chat', { query, site_context: siteContext }),
    () => ({
      query,
      response: getMockChatResponse(query, siteContext),
      timestamp: new Date().toISOString(),
      powered_by: 'IBM Granite LLM (Demo Simulation Engine)'
    })
  )

// ─────────────────────────────────────────────
// SMART HERITAGE PLATFORM - UNIFIED APIs
// ─────────────────────────────────────────────

// SOURCES
export const getSources = () =>
  withFallback(
    () => api.get('/sources/'),
    () => getMockSources()
  )

export const getSource = (id) =>
  withFallback(
    () => api.get(`/sources/${id}`),
    () => getMockSources().find(s => s.id === Number(id)) || getMockSources()[0]
  )

export const refreshSource = (id) =>
  withFallback(
    () => api.post(`/sources/${id}/refresh`),
    () => ({ status: 'success', message: 'Source refreshed and verified.', source_id: id, records_stored: 4 })
  )

// DATA RECORDS & MANUAL ENTRY
export const getDataRecords = (params = {}) => {
  const query = new URLSearchParams()
  if (params.site_id) query.append('site_id', params.site_id)
  if (params.origin) query.append('origin', params.origin)
  if (params.observation_type) query.append('observation_type', params.observation_type)
  if (params.severity) query.append('severity', params.severity)
  if (params.limit) query.append('limit', params.limit)
  if (params.offset) query.append('offset', params.offset)

  const qs = query.toString() ? `?${query.toString()}` : ''
  return withFallback(
    () => api.get(`/data/${qs}`),
    () => getMockDataRecords(params)
  )
}

export const getDataQuality = () =>
  withFallback(
    () => api.get('/data/quality'),
    () => getMockDataQuality()
  )

export const getIngestionRuns = (limit = 20) =>
  withFallback(
    () => api.get(`/data/runs?limit=${limit}`),
    () => [
      {
        id: 1,
        source_name: "Open-Meteo Weather API",
        status: "SUCCESS",
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        records_fetched: 5,
        records_stored: 5,
        records_deduplicated: 0,
        records_rejected: 0,
        duration_sec: 0.82
      },
      {
        id: 2,
        source_name: "Wikipedia Heritage Records",
        status: "SUCCESS",
        started_at: new Date(Date.now() - 3600000).toISOString(),
        completed_at: new Date(Date.now() - 3600000).toISOString(),
        records_fetched: 2,
        records_stored: 2,
        records_deduplicated: 0,
        records_rejected: 0,
        duration_sec: 0.45
      }
    ]
  )

export const submitManualObservation = (payload) =>
  withFallback(
    () => api.post('/data/manual', payload),
    () => ({
      status: 'success',
      message: 'Manual observation successfully validated and stored.',
      observation_id: Date.now(),
      data_origin: 'MANUAL_ENTRY'
    })
  )

// ALERTS & HUMAN REVIEW
export const getUnifiedAlerts = (siteId = null) => {
  const path = siteId ? `/alerts/?site_id=${siteId}` : '/alerts/'
  return withFallback(
    () => api.get(path),
    () => getMockAlerts()
  )
}

export const reviewUnifiedAlert = (alertId, payload) =>
  withFallback(
    () => api.post(`/alerts/${alertId}/review`, payload),
    () => ({ status: 'success', message: 'Alert reviewed', alert_id: alertId })
  )

// INSIGHTS
export const getUnifiedInsights = (siteId = null) => {
  const path = siteId ? `/insights/site/${siteId}` : '/insights/'
  return withFallback(
    () => api.get(path),
    () => getMockInsights()
  )
}

// ─────────────────────────────────────────────
// DEMO RESET
// ─────────────────────────────────────────────
export const resetDemo = () =>
  withFallback(
    () => api.post('/demo/reset'),
    () => ({ status: 'success', message: 'Demo data reset successfully. HeritageGuardian is ready for demonstration.' })
  )

export default api

