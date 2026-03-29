export interface DashboardData {
  status: 'running' | 'paused' | 'completed' | 'initializing'
  started_at: string | null
  updated_at: string | null
  summary: {
    total_cycles: number
    graduates: number
    iterating: number
    pivots: number
    kills: number
  }
  current_pipelines: Pipeline[]
  top_graduates: TopProduct[]
  category_stats: Record<string, CategoryStat>
  recent_kills: RecentKill[]
  pmf_thresholds: PMFThresholds
  product_latest?: Record<string, ProductLatest>
}

export interface ProductLatest {
  product_name: string
  stage: string
  message: string
  timestamp: string
  pmf_score?: number | null
  verdict?: string | null
  url?: string | null
}

export interface Pipeline {
  product_id: string
  product_name: string
  stage: 'ideating' | 'spec' | 'build' | 'qa' | 'deploy' | 'validate' | 'done'
  stage_detail: string
  progress_pct: number
  started_at: string
  elapsed_sec: number
  ranking_score?: number | null  // FR-3: 트렌드 기반 랭킹 점수 (ideating 단계에서 설정)
}

export interface TopProduct {
  product_id: string
  product_name: string
  pmf_score: number
  url: string
  verdict: 'GRADUATE' | 'ITERATE' | 'KILL'
  market_phase: string
}

export interface CategoryStat {
  total: number
  graduates: number
  kills: number
  avg_pmf: number
  best_product?: string
  best_pmf?: number
}

export interface RecentKill {
  product_id: string
  product_name: string
  reason: string
  pmf_score: number | null
  url: string | null
  killed_at: string
  funnel_summary?: {
    layer1_pass_rate: number
    layer2_pass_rate: number
    vd_count: number
    pmf_score: number
  } | null
}

export interface PMFThresholds {
  graduate: number        // 55 (SEPE)
  iterate: number         // 40
  pivot: number           // 25
  sean_ellis_original: number  // 40 (original benchmark)
  sepe_graduate?: number  // 55 (explicit SEPE override)
}

// Version history entry (append-only, 버전별 의사결정→평가 체인)
export interface VersionHistoryEntry {
  version: number
  pmf_score: number
  verdict: 'GRADUATE' | 'ITERATE' | 'KILL'
  validated_at: string | null
  version_path: string | null

  // Builder-PM 의사결정 (왜 이렇게 만들었는가?)
  iterate_direction_applied: {
    strengthen: string
    improve: string
    rationale: {
      strengthen_source: string
      improve_source: string
    }
  } | null

  // Validation 결과 (고객이 어떻게 평가했는가?)
  surveyed_count: number | null
  q1_distribution: Q1Distribution | null
  q2_hxc_profile: string | null
  q3_top_strengths: string[]
  q4_top_improvements: string[]
}

// Product detail state (state/products/{id}.json)
export interface ProductState {
  product_id: string
  product_name: string
  one_liner: string
  target_segment: string
  core_feature: string
  differentiation: string
  revenue_model: string
  url: string | null
  status: 'ideating' | 'spec' | 'build' | 'qa' | 'deploy' | 'validate' | 'done'
  verdict: 'GRADUATE' | 'ITERATE' | 'KILL' | null
  pmf_score: number | null
  market_phase: string | null
  cycle_number: number
  started_at: string
  completed_at: string | null
  elapsed_sec: number | null
  validation_result: ValidationResult | null
  build_result: BuildResult | null
  deploy_result: DeployResult | null
  personas_used: string[]
  category: string
  iterate_history: VersionHistoryEntry[]
}

export interface ValidationResult {
  pmf_score: number
  pmf_delta: number | null
  verdict: 'GRADUATE' | 'ITERATE' | 'KILL'
  nascent_pmf: boolean
  population: {
    total_personas: number
    pre_survey_nd: number
    e2e_attempted: number
    activation_completed: number
    survey_respondents: number
  }
  q1_distribution: Q1Distribution
  vd_count: number
  sd_count: number
  nd_count: number
  vsd_count: number
  nsd_count: number
  core_values: string[]
  conversion_conditions: ConversionCondition[]
  hxc_profile: string
  pm_instruction: string
  validated_at: string
  personas?: PersonaSummary[]
}

export interface ConversionCondition {
  condition: string
  mentions: number
}

export interface Q1Distribution {
  very_disappointed: number
  somewhat_disappointed: number
  not_disappointed: number
  not_applicable: number
}

export interface PersonaSummary {
  persona_id: string
  persona_name: string
  tier: 'deep' | 'mid' | 'lite'
  pre_survey: { pain: number; alternative_advantage: number }
  activation: boolean
  micro_evaluation: {
    comprehension: number
    functionality: number
    value: number
    reuse: number
    business_essence: 'product' | 'content'
  }
  q1: 'very_disappointed' | 'somewhat_disappointed' | 'not_disappointed' | 'not_applicable'
  q2: string | null
  q3: 'vsd' | 'nsd' | null
  q4: string | null
}

export interface BuildResult {
  success: boolean
  build_time_sec: number
  errors: string[]
  warnings: string[]
}

export interface DeployResult {
  success: boolean
  url: string | null
  deploy_time_sec: number
  error: string | null
}

// Heartbeat state (state/heartbeat.json)
export interface HeartbeatState {
  last_beat: string | null
  cycle_count: number
  beat_interval_sec: number
  session_id: string | null
  status: 'running' | 'paused' | 'starting' | 'stopped'
}

// Health status derived from heartbeat staleness
export type HealthStatus = 'green' | 'yellow' | 'red'

export function getHealthStatus(heartbeat: HeartbeatState | null): HealthStatus {
  if (!heartbeat || !heartbeat.last_beat) return 'red'
  const lastBeat = new Date(heartbeat.last_beat).getTime()
  const now = Date.now()
  const diffMinutes = (now - lastBeat) / 1000 / 60

  if (diffMinutes < 5) return 'green'
  if (diffMinutes < 15) return 'yellow'
  return 'red'
}

export function formatElapsed(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}m ${secs}s`
}

// Local ports state (state/local-ports.json)
export interface LocalPortsData {
  base_port: number
  max_port: number
  services: Record<string, LocalService>
  error?: string
}

export interface LocalService {
  port: number
  pid: number
  status: string
  project_path: string
  started_at: string
  verdict?: 'GRADUATE' | 'ITERATE' | 'KILL' | null
  pmf_score?: number | null
  product_name?: string
}

// persona-responses.json types (state/validator-v2/{product_id}/cycle-{n}/persona-responses.json)
export interface PersonaResponseFile {
  meta: {
    schema_version: string
    status: 'complete' | 'partial'
  }
  cycle_meta: {
    product_id: string
    cycle_number: number
    recorded_at: string
  }
  personas: PersonaResponseEntry[]
}

export interface PersonaResponseEntry {
  persona_meta: {
    id: string
    name: string
    age: number
    occupation: string
    bio: string
    tier: 'deep' | 'mid' | 'lite'
    ocean: {
      openness: number
      conscientiousness: number
      extraversion: number
      agreeableness: number
      neuroticism: number
    }
    innovation_adoption: string
    willingness_to_pay: string
    daily_usage_likelihood: string
  }
  behavior_tracking: {
    activated: boolean
    activation_reason: 'success' | 'pre_survey_nd' | 'playwright_failure' | 'webfetch_failure'
    e2e_method: 'playwright' | 'webfetch_fallback' | null
    core_action_count: number
    playwright_results: {
      steps_completed: number
      steps_failed: number
      error_messages: string[]
    }
  }
  pre_survey: {
    pain: number
    alternative_advantage: number
  }
  survey_eligible: boolean
  survey_responses: {
    q1_disappointment: 'very_disappointed' | 'somewhat_disappointed' | 'not_disappointed' | 'not_applicable'
    q1_text: string
    q1_reasoning: string
    q2_core_value: string | null
    q3_classification: 'VD' | 'VSD' | 'NSD' | 'ND'
    q4_conversion_condition: string | null
  } | null
  classification: {
    label: 'VD' | 'VSD' | 'NSD' | 'ND'
    eight_axis_scores: Record<string, { score: number; reason: string }>
  }
}

export function formatTimeAgo(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime()
  const diffSec = Math.floor(diffMs / 1000)
  if (diffSec < 60) return `${diffSec}s ago`
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  return `${diffHr}h ago`
}
