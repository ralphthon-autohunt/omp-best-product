// Validator v2 — 통계적 고객집착 기반 자율 개선 루프

export interface ValidatorStatus {
  current_step: number
  total_steps: number
  status: 'waiting' | 'running' | 'completed'
  started_at: string | null
  updated_at: string | null
  steps: ValidatorStepMeta[]
}

export interface ValidatorStepMeta {
  step: number
  title: string
  alwayz_ref: string
  status: 'pending' | 'in_progress' | 'completed'
  hypothesis: string
  result_summary: string | null
  insight: string | null
  started_at: string | null
  completed_at: string | null
}

export interface ValidatorStepDetail {
  step: number
  title: string
  alwayz_ref: string
  cumulative: boolean
  products: Record<string, StepProductResult>
  pmf_definitions?: Record<string, PMFDefinition>
}

export interface StepProductResult {
  product_name: string
  v1_pmf_score: number
  v2_pmf_score: number
  v1_verdict: string
  v2_verdict: string
  delta: number
  detail: StepProductDetail
  narrative: string
}

export interface StepProductDetail {
  hxc_profile?: {
    persona: string
    core_values: string[]
    why_vd: string
  }
  segment_pmf?: {
    전체: number
    hxc: number
  }
  q1_v2?: {
    VD: number
    VSD: number
    NSD: number
    ND: number
    NA: number
  }
  filtered_feedback?: {
    vd_strengthen: string[]
    vsd_convert: string[]
    excluded_nd_nsd: string[]
  }
  tracks?: {
    a_strengthen: string
    b_convert: string
  }
  sprint_history?: Array<{
    sprint: number
    vd_ratio: number
    vsd_ratio: number
    segment: string
  }>
}

export interface PMFDefinition {
  product_name: string
  core_value: string
  hxc: string
  vd_ratio: number
  hxc_vd_ratio: number
  status: 'PMF_FOUND' | 'ITERATING' | 'SEARCHING'
}

export interface ValidatorOverview {
  current_step: number
  total_steps: number
  status: 'waiting' | 'running' | 'completed'
  products: string[]
  matrix: Record<string, Record<string, number>>
  verdicts: Record<string, Record<string, string>>
  steps_meta: ValidatorStepMeta[]
  pmf_definitions?: Record<string, PMFDefinition>
}
