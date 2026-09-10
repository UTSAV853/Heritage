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
  getMockScenarioB
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
// DEMO RESET
// ─────────────────────────────────────────────
export const resetDemo = () =>
  withFallback(
    () => api.post('/demo/reset'),
    () => ({ status: 'success', message: 'Demo data reset successfully. HeritageGuardian is ready for demonstration.' })
  )

export default api
