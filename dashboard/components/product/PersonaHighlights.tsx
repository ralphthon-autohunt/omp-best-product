'use client'

import type { PersonaSummary } from '@/lib/types'

interface PersonaHighlightsProps {
  personas?: PersonaSummary[]
}

const TIER_COLORS: Record<string, { bg: string; text: string }> = {
  deep: { bg: 'bg-purple-950/50', text: 'text-purple-400' },
  mid:  { bg: 'bg-blue-950/50',   text: 'text-blue-400' },
  lite: { bg: 'bg-gray-900',      text: 'text-gray-400' },
}

const Q1_COLORS: Record<string, string> = {
  very_disappointed:     'text-green-400',
  somewhat_disappointed: 'text-yellow-400',
  not_disappointed:      'text-red-400',
  not_applicable:        'text-gray-500',
}

const Q1_LABELS: Record<string, string> = {
  very_disappointed:     'VD',
  somewhat_disappointed: 'SD',
  not_disappointed:      'ND',
  not_applicable:        'N/A',
}

interface PersonaCardProps {
  persona: PersonaSummary
}

function PersonaCard({ persona }: PersonaCardProps) {
  const tierStyle = TIER_COLORS[persona.tier] ?? TIER_COLORS.lite
  const q1Color = Q1_COLORS[persona.q1] ?? 'text-gray-400'
  const q1Label = Q1_LABELS[persona.q1] ?? persona.q1

  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-4 space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-xs px-2 py-0.5 rounded-full ${tierStyle.bg} ${tierStyle.text} font-medium`}>
          {persona.tier}
        </span>
        <span className="text-sm font-medium text-white">{persona.persona_name}</span>
        <span className={`text-xs ${q1Color} ml-auto font-semibold`}>
          {q1Label}
        </span>
      </div>

      {persona.q2 && (
        <blockquote className="text-xs text-gray-400 italic border-l-2 border-gray-700 pl-3 leading-relaxed">
          &ldquo;{persona.q2}&rdquo;
        </blockquote>
      )}

      {persona.q4 && (
        <p className="text-xs text-gray-500">
          전환 조건: <span className="text-gray-300">{persona.q4}</span>
        </p>
      )}

      <div className="flex items-center gap-4 text-xs text-gray-600">
        <span>Pain: <span className="text-gray-400">{persona.pre_survey.pain}/2</span></span>
        <span>가치: <span className="text-gray-400">{persona.micro_evaluation.value}/2</span></span>
        {persona.q3 && (
          <span className={persona.q3 === 'vsd' ? 'text-yellow-400' : 'text-gray-500'}>
            {persona.q3.toUpperCase()}
          </span>
        )}
      </div>
    </div>
  )
}

export function PersonaHighlights({ personas }: PersonaHighlightsProps) {
  // Show top 5 personas: prioritize VD (deep first) > VSD > others
  const sorted = (personas ?? [])
    .sort((a, b) => {
      const q1Order: Record<string, number> = { very_disappointed: 0, somewhat_disappointed: 1, not_disappointed: 2, not_applicable: 3 }
      const tierOrder: Record<string, number> = { deep: 0, mid: 1, lite: 2 }
      const q1Diff = (q1Order[a.q1] ?? 3) - (q1Order[b.q1] ?? 3)
      if (q1Diff !== 0) return q1Diff
      return (tierOrder[a.tier] ?? 3) - (tierOrder[b.tier] ?? 3)
    })
    .slice(0, 5)

  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
          Persona Highlights
        </h2>
        <span className="text-xs text-gray-500">Top {sorted.length}</span>
      </div>

      {sorted.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-gray-600 text-sm">No persona data available</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((p) => (
            <PersonaCard key={p.persona_id} persona={p} />
          ))}
        </div>
      )}
    </div>
  )
}
