'use client'

import { useState } from 'react'
import { usePolling } from '@/lib/polling'
import type { PersonaResponseFile, PersonaResponseEntry } from '@/lib/types'

interface PersonaResponsesPanelProps {
  productId: string
  cycleNumber?: number
}

const EIGHT_AXES = [
  'inertia',
  'frequency',
  'trust',
  'mvp_quality',
  'problem_intensity',
  'diy_substitution',
  'social_proof',
  'retention',
] as const

const LABEL_COLORS: Record<string, { bg: string; text: string }> = {
  VD:  { bg: 'bg-green-950/60',  text: 'text-green-400' },
  VSD: { bg: 'bg-yellow-950/60', text: 'text-yellow-400' },
  NSD: { bg: 'bg-orange-950/60', text: 'text-orange-400' },
  ND:  { bg: 'bg-red-950/60',    text: 'text-red-400' },
}

const TIER_COLORS: Record<string, { bg: string; text: string }> = {
  deep: { bg: 'bg-purple-950/50', text: 'text-purple-400' },
  mid:  { bg: 'bg-blue-950/50',   text: 'text-blue-400' },
  lite: { bg: 'bg-gray-900',      text: 'text-gray-400' },
}

const AXIS_LABELS: Record<string, string> = {
  inertia:           'Inertia',
  frequency:         'Frequency',
  trust:             'Trust',
  mvp_quality:       'MVP Quality',
  problem_intensity: 'Problem',
  diy_substitution:  'DIY Sub',
  social_proof:      'Social',
  retention:         'Retention',
}

const LABEL_ORDER: Record<string, number> = { VD: 0, VSD: 1, NSD: 2, ND: 3 }

function ScoreBar({ score }: { score: number }) {
  const filled = Math.max(0, Math.min(2, score))
  return (
    <div className="flex gap-0.5">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`h-2 w-4 rounded-sm ${
            i < filled
              ? filled === 2
                ? 'bg-green-500'
                : filled === 1
                ? 'bg-yellow-500'
                : 'bg-red-700'
              : 'bg-gray-700'
          }`}
        />
      ))}
    </div>
  )
}

function AxisScores({ scores }: { scores: Record<string, { score: number; reason: string }> }) {
  return (
    <div className="grid grid-cols-4 gap-x-3 gap-y-1.5">
      {EIGHT_AXES.map((axis) => {
        const entry = scores[axis]
        if (!entry) return null
        return (
          <div key={axis} className="flex flex-col gap-0.5" title={entry.reason}>
            <span className="text-[10px] text-gray-500 leading-none">
              {AXIS_LABELS[axis] ?? axis}
            </span>
            <ScoreBar score={entry.score} />
          </div>
        )
      })}
    </div>
  )
}

function PersonaCard({ persona }: { persona: PersonaResponseEntry }) {
  const label = persona.classification.label
  const labelStyle = LABEL_COLORS[label] ?? { bg: 'bg-gray-900', text: 'text-gray-400' }
  const tierStyle = TIER_COLORS[persona.persona_meta.tier] ?? TIER_COLORS.lite

  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-4 space-y-3">
      {/* Header row */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${labelStyle.bg} ${labelStyle.text}`}>
          {label}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full ${tierStyle.bg} ${tierStyle.text}`}>
          {persona.persona_meta.tier}
        </span>
        <span className="text-sm font-medium text-white">{persona.persona_meta.name}</span>
        <span className="text-xs text-gray-500">
          {persona.persona_meta.age}세 · {persona.persona_meta.occupation}
        </span>
      </div>

      {/* Activation + pre-survey row */}
      <div className="flex items-center gap-4 text-xs text-gray-600">
        <span>
          Pain:{' '}
          <span className="text-gray-400">{persona.pre_survey.pain}/2</span>
        </span>
        <span>
          Alt:{' '}
          <span className="text-gray-400">{persona.pre_survey.alternative_advantage}/2</span>
        </span>
        <span>
          Activation:{' '}
          <span className={persona.behavior_tracking.activated ? 'text-green-400' : 'text-red-400'}>
            {persona.behavior_tracking.activation_reason}
          </span>
        </span>
      </div>

      {/* 8-axis scores */}
      <AxisScores scores={persona.classification.eight_axis_scores} />

      {/* Q1 reasoning (survey eligible only) */}
      {persona.survey_eligible && persona.survey_responses?.q1_reasoning && (
        <blockquote className="text-xs text-gray-400 italic border-l-2 border-gray-700 pl-3 leading-relaxed">
          &ldquo;{persona.survey_responses.q1_reasoning}&rdquo;
        </blockquote>
      )}

      {/* VSD conversion condition */}
      {persona.survey_eligible && persona.survey_responses?.q4_conversion_condition && (
        <p className="text-xs text-gray-500">
          전환 조건:{' '}
          <span className="text-gray-300">{persona.survey_responses.q4_conversion_condition}</span>
        </p>
      )}
    </div>
  )
}

type FilterLabel = 'ALL' | 'VD' | 'VSD' | 'NSD' | 'ND'

export function PersonaResponsesPanel({ productId, cycleNumber = 1 }: PersonaResponsesPanelProps) {
  const { data, error, isLoading } = usePolling<PersonaResponseFile>(
    `/api/products/${productId}/persona-responses?cycle=${cycleNumber}`,
    60000
  )

  const [filter, setFilter] = useState<FilterLabel>('ALL')

  if (isLoading) {
    return (
      <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6 animate-pulse">
        <div className="h-4 bg-gray-800 rounded w-56 mb-3" />
        <div className="h-24 bg-gray-800/50 rounded" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-2">
          Persona Responses
        </h3>
        <p className="text-gray-600 text-sm">No persona response data available for cycle {cycleNumber}.</p>
      </div>
    )
  }

  const statusBadge = data.meta.status === 'complete'
    ? { bg: 'bg-green-900/50', text: 'text-green-400', label: 'complete' }
    : { bg: 'bg-amber-900/50', text: 'text-amber-400', label: 'partial' }

  const filtered = data.personas
    .filter((p) => filter === 'ALL' || p.classification.label === filter)
    .sort((a, b) => (LABEL_ORDER[a.classification.label] ?? 4) - (LABEL_ORDER[b.classification.label] ?? 4))

  const counts = data.personas.reduce<Record<string, number>>((acc, p) => {
    acc[p.classification.label] = (acc[p.classification.label] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
            Persona Responses
          </h2>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge.bg} ${statusBadge.text}`}>
            {statusBadge.label}
          </span>
        </div>
        <span className="text-xs text-gray-500">
          Cycle {data.cycle_meta.cycle_number} · {data.personas.length} personas
        </span>
      </div>

      {/* Filter buttons */}
      <div className="flex gap-2 flex-wrap">
        {(['ALL', 'VD', 'VSD', 'NSD', 'ND'] as FilterLabel[]).map((lbl) => {
          const count = lbl === 'ALL' ? data.personas.length : (counts[lbl] ?? 0)
          const active = filter === lbl
          const labelStyle = lbl !== 'ALL' ? LABEL_COLORS[lbl] : null
          return (
            <button
              key={lbl}
              onClick={() => setFilter(lbl)}
              className={`text-xs px-3 py-1 rounded-full transition-colors ${
                active
                  ? labelStyle
                    ? `${labelStyle.bg} ${labelStyle.text} ring-1 ring-current`
                    : 'bg-gray-700 text-white'
                  : 'bg-gray-800/60 text-gray-500 hover:text-gray-300'
              }`}
            >
              {lbl} {count > 0 && <span className="opacity-70">({count})</span>}
            </button>
          )
        })}
      </div>

      {/* Persona cards */}
      {filtered.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-gray-600 text-sm">No personas matching filter &ldquo;{filter}&rdquo;</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
          {filtered.map((p) => (
            <PersonaCard key={p.persona_meta.id} persona={p} />
          ))}
        </div>
      )}
    </div>
  )
}
