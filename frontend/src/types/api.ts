// API Types — mirroring backend schemas

export interface Site {
  id: string
  name: string
  slug: string
  description: string
  location: string
  site_type: string
  total_capacity: number
  tags: string[]
  established_year?: number
  state?: string
  country?: string
  zones?: Zone[]
  data_source?: string
}

export interface Zone {
  id: string
  name: string
  slug: string
  capacity: number
  zone_type: string
}

export interface ZoneFlowResult {
  zone_id: string
  zone_name: string
  visitors: number
  capacity: number
  occupancy_percent: number
  pressure: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'
}

export interface VisitorFlowResult {
  site_id: string
  site_name: string
  status: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'
  occupancy_percent: number
  current_visitors: number
  capacity: number
  trend: 'INCREASING' | 'STABLE' | 'DECREASING'
  critical_zones: string[]
  recommended_action: string
  reason: string
  confidence: number
  zone_breakdown: ZoneFlowResult[]
  data_source: string
  ai_enhanced: boolean
}

export interface HeritageStop {
  zone: string
  title: string
  description: string
  duration_minutes: number
  tags: string[]
  content_id?: string
}

export interface HeritageGuideResult {
  title: string
  summary: string
  recommended_stops: HeritageStop[]
  reason: string
  estimated_duration_minutes: number
  sources: string[]
  ai_enhanced: boolean
  data_source: string
}

export interface StructuralResult {
  site_id: string
  site_name: string
  condition: string
  risk_level: string
  observations: string[]
  recommended_action: string
  confidence: number
  human_inspection_required: boolean
  data_source: string
  disclaimer: string
}

export interface EncroachmentResult {
  site_id: string
  potential_encroachment: boolean
  confidence: number
  evidence: string[]
  recommended_verification: string
  status: string
  data_source: string
  disclaimer: string
}

export interface ConservationFactor {
  category: string
  description: string
  severity: string
  evidence: string[]
}

export interface ConservationRecommendation {
  priority: number
  action: string
  rationale: string
  human_verification_required: boolean
}

export interface ConservationReport {
  priority: string
  site: string
  site_id: string
  factors: ConservationFactor[]
  recommendations: ConservationRecommendation[]
  human_verification_required: boolean
  summary: string
  ai_enhanced: boolean
  data_source: string
}

export interface AgentRunSummary {
  id: string
  request_id: string
  agent: string
  status: 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED' | 'SKIPPED'
  start_time?: string
  end_time?: string
  duration_ms?: number
  input_summary?: string
  output_summary?: string
  error?: string
}

export interface OrchestratorResult {
  request_id: string
  site_id: string
  site_name: string
  status: 'SUCCESS' | 'PARTIAL' | 'FAILED'
  visitor_flow?: VisitorFlowResult
  heritage_guide?: HeritageGuideResult
  structural?: StructuralResult
  conservation?: ConservationReport
  agent_runs: AgentRunSummary[]
  degraded_agents: string[]
  degraded_message?: string
  completed_at: string
}

export interface Alert {
  id: string
  site_id: string
  site_name?: string
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'
  category: string
  agent: string
  title: string
  description: string
  evidence: string[]
  recommendation: string
  status: string
  human_verification_required: boolean
  timestamp: string
  data_source: string
}

export interface AgentInfo {
  id: string
  name: string
  role: string
  status: string
  priority: string
}

export interface AgentsListResponse {
  agents: AgentInfo[]
  granite_available: boolean
  demo_mode: boolean
}
