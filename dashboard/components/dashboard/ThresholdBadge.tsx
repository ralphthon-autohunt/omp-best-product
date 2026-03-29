'use client'

import type { PMFThresholds } from '@/lib/types'

interface ThresholdBadgeProps {
  thresholds?: PMFThresholds
}

interface CriterionProps {
  verdict: string
  range: string
  color: string
  bgColor: string
  borderColor: string
  note?: string
}

function Criterion({ verdict, range, color, bgColor, borderColor, note }: CriterionProps) {
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${bgColor} ${borderColor}`}>
      <div>
        <span className={`text-xs font-bold ${color}`}>{verdict}</span>
        <span className="text-gray-400 text-xs ml-1.5">{range}</span>
        {note && <span className="text-gray-600 text-xs ml-1">({note})</span>}
      </div>
    </div>
  )
}

export function ThresholdBadge({ thresholds }: ThresholdBadgeProps) {
  const t = thresholds ?? {
    graduate: 55,
    iterate: 25,
    sean_ellis_original: 40,
  }

  return (
    <div className="bg-gray-900/40 border border-gray-800 rounded-xl px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-gray-500 uppercase tracking-wider shrink-0 mr-1">
          PMF Thresholds:
        </span>

        <Criterion
          verdict="GRADUATE"
          range={`${t.graduate}%+`}
          color="text-green-400"
          bgColor="bg-green-950/30"
          borderColor="border-green-900/50"
          note="SEPE threshold"
        />
        <Criterion
          verdict="ITERATE"
          range={`${t.iterate}–${t.graduate - 1}%`}
          color="text-blue-400"
          bgColor="bg-blue-950/30"
          borderColor="border-blue-900/50"
        />
        <Criterion
          verdict="KILL"
          range={`<${t.iterate}%`}
          color="text-red-400"
          bgColor="bg-red-950/30"
          borderColor="border-red-900/50"
        />

        {/* Sean Ellis original note */}
        <div className="flex items-center gap-1 ml-auto shrink-0">
          <div className="w-3 h-px bg-blue-500/60" style={{ borderTop: '1px dashed #3b82f6' }} />
          <span className="text-xs text-gray-600">
            Sean Ellis original: {t.sean_ellis_original}%
          </span>
        </div>
      </div>
    </div>
  )
}
