import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.detail || err.message || 'API error'
    console.error('API Error:', msg)
    return Promise.reject(err)
  }
)

// Sites
export const getSites = () => api.get('/sites/')
export const getSite = (id) => api.get(`/sites/${id}`)
export const getSiteSummary = (id) => api.get(`/sites/${id}/summary`)

// Dashboard
export const getDashboardOverview = () => api.get('/agents/dashboard/overview')

// Structural Agent
export const analyzeStructural = (formData) =>
  api.post('/agents/structural/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const getStructuralDemo = (site = 'Modhera Sun Temple') =>
  api.get(`/agents/structural/demo?site_name=${encodeURIComponent(site)}`)

// Visitor Agent
export const getVisitorData = (siteId) => api.get(`/agents/visitor/${siteId}`)
export const getVisitorDemo = (site = 'Modhera Sun Temple') =>
  api.get(`/agents/visitor/demo/${encodeURIComponent(site)}`)

// Encroachment Agent
export const analyzeEncroachment = (formData) =>
  api.post('/agents/encroachment/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const getEncroachmentDemo = (site = 'Modhera Sun Temple') =>
  api.get(`/agents/encroachment/demo?site_name=${encodeURIComponent(site)}`)

// Storytelling Agent
export const generateStory = (data) => api.post('/agents/storytelling/generate', data)
export const getStoryDemo = (site, language, ageGroup) =>
  api.get(`/agents/storytelling/demo?site=${encodeURIComponent(site)}&language=${language}&age_group=${encodeURIComponent(ageGroup)}`)

// Conservation Report
export const getConservationReport = (siteId, format = 'json') =>
  api.get(`/agents/conservation/report/${siteId}?format=${format}`, {
    responseType: format === 'csv' ? 'text' : 'json'
  })
export const getConservationDemo = () => api.get('/agents/conservation/demo')

// Cross-agent scenarios
export const runScenarioA = (siteName, siteId) =>
  api.post(`/agents/orchestrator/scenario-a?site_name=${encodeURIComponent(siteName)}&site_id=${siteId}`)
export const runScenarioB = (siteName, siteId) =>
  api.post(`/agents/orchestrator/scenario-b?site_name=${encodeURIComponent(siteName)}&site_id=${siteId}`)

// Activity log
export const getActivityLog = (limit = 50) => api.get(`/agents/activity-log?limit=${limit}`)

// Chat
export const sendChatMessage = (query, siteContext = null) =>
  api.post('/agents/chat', { query, site_context: siteContext })

// Demo reset
export const resetDemo = () => api.post('/demo/reset')

export default api
