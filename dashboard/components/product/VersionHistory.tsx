'use client'

import { useState } from 'react'
import type { VersionHistoryEntry } from '@/lib/types'

interface VersionHistoryProps {
  history: VersionHistoryEntry[]
}

const VERDICT_STYLES: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  GRADUATE: { bg: 'bg-green-950/30', text: 'text-green-400', border: 'border-green-900/50', dot: 'bg-green-500' },
  ITERATE:  { bg: 'bg-blue-950/30',  text: 'text-blue-400',  border: 'border-blue-900/50',  dot: 'bg-blue-500' },
  KILL:     { bg: 'bg-red-950/30',   text: 'text-red-400',   border: 'border-red-900/50',   dot: 'bg-red-500' },
}

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('ko-KR', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

function Q1MiniBar({ dist }: { dist: VersionHistoryEntry['q1_distribution'] }) {
  if (!dist) return <span className="text-gray-600 text-xs">데이터 없음</span>
  const total = dist.very_disappointed + dist.somewhat_disappointed + dist.not_disappointed + (dist.not_applicable ?? 0)
  if (total === 0) return null
  const vdPct = Math.round((dist.very_disappointed / total) * 100)
  const sdPct = Math.round((dist.somewhat_disappointed / total) * 100)
  const ndPct = Math.round((dist.not_disappointed / total) * 100)

  return (
    <div className="space-y-1.5">
      <div className="flex h-3 rounded-full overflow-hidden bg-gray-800">
        <div className="bg-green-500" style={{ width: `${vdPct}%` }} title={`VD ${vdPct}%`} />
        <div className="bg-amber-500" style={{ width: `${sdPct}%` }} title={`SD ${sdPct}%`} />
        <div className="bg-red-500" style={{ width: `${ndPct}%` }} title={`ND ${ndPct}%`} />
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>VD {dist.very_disappointed}</span>
        <span>SD {dist.somewhat_disappointed}</span>
        <span>ND {dist.not_disappointed}</span>
      </div>
    </div>
  )
}

function VersionCard({ entry, isLast }: { entry: VersionHistoryEntry; isLast: boolean }) {
  const [expanded, setExpanded] = useState(false)
  const style = VERDICT_STYLES[entry.verdict] ?? VERDICT_STYLES.KILL

  return (
    <div className="relative flex gap-4">
      {/* Timeline connector */}
      <div className="flex flex-col items-center shrink-0">
        <div className={`w-4 h-4 rounded-full ${style.dot} ring-4 ring-gray-950 z-10`} />
        {!isLast && <div className="w-0.5 flex-1 bg-gray-800 mt-1" />}
      </div>

      {/* Card */}
      <div className={`flex-1 mb-4 rounded-xl border ${style.border} ${style.bg} overflow-hidden`}>
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-bold text-white">v{entry.version}</span>
            <span className={`text-xs font-bold ${style.text}`}>{entry.verdict}</span>
            <span className="text-lg font-bold text-white">{entry.pmf_score}%</span>
            {entry.surveyed_count && (
              <span className="text-xs text-gray-500">({entry.surveyed_count}명)</span>
            )}
            <span className="text-xs text-gray-600">{formatDate(entry.validated_at)}</span>
          </div>
          <span className="text-gray-500 text-xs">{expanded ? '▲' : '▼'}</span>
        </button>

        {expanded && (
          <div className="px-4 pb-4 space-y-4 border-t border-gray-800/50">
            {/* PM 의사결정 */}
            {entry.iterate_direction_applied && (
              <div className="pt-3 space-y-2">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  PM 의사결정
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="bg-gray-900/50 rounded-lg p-3 space-y-1">
                    <span className="text-blue-400 font-medium">강화 (Strengthen)</span>
                    <p className="text-gray-300">{entry.iterate_direction_applied.strengthen}</p>
                    {entry.iterate_direction_applied.rationale && (
                      <p className="text-gray-500 italic">
                        근거: {entry.iterate_direction_applied.rationale.strengthen_source}
                      </p>
                    )}
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-3 space-y-1">
                    <span className="text-amber-400 font-medium">개선 (Improve)</span>
                    <p className="text-gray-300">{entry.iterate_direction_applied.improve}</p>
                    {entry.iterate_direction_applied.rationale && (
                      <p className="text-gray-500 italic">
                        근거: {entry.iterate_direction_applied.rationale.improve_source}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 고객 평가 */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                고객 평가
              </h4>

              <Q1MiniBar dist={entry.q1_distribution} />

              {entry.q2_hxc_profile && (
                <div className="text-xs">
                  <span className="text-gray-500">이상 고객: </span>
                  <span className="text-gray-300">{entry.q2_hxc_profile}</span>
                </div>
              )}

              {entry.q3_top_strengths?.length > 0 && (
                <div className="text-xs space-y-1">
                  <span className="text-green-400 font-medium">강점 (Q3)</span>
                  <ul className="text-gray-300 space-y-0.5">
                    {entry.q3_top_strengths.map((s, i) => (
                      <li key={i} className="pl-2 border-l border-green-800">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {entry.q4_top_improvements?.length > 0 && (
                <div className="text-xs space-y-1">
                  <span className="text-amber-400 font-medium">개선 요청 (Q4)</span>
                  <ul className="text-gray-300 space-y-0.5">
                    {entry.q4_top_improvements.map((s, i) => (
                      <li key={i} className="pl-2 border-l border-amber-800">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* 화면 보기 링크 */}
            {entry.version_path && (
              <div className="pt-1">
                <span className="text-xs text-gray-500">
                  화면 경로: <code className="text-gray-400">{entry.version_path}</code>
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export function VersionHistory({ history }: VersionHistoryProps) {
  if (!history || history.length === 0) return null

  const sorted = [...history].sort((a, b) => a.version - b.version)
  const latest = sorted[sorted.length - 1]
  const first = sorted[0]
  const delta = sorted.length > 1 ? latest.pmf_score - first.pmf_score : null

  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
          Version History
        </h2>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-gray-500">{sorted.length} versions</span>
          {delta !== null && (
            <span className={delta > 0 ? 'text-green-400' : 'text-red-400'}>
              {delta > 0 ? '+' : ''}{delta.toFixed(1)}%p
            </span>
          )}
        </div>
      </div>

      {/* PMF Score trend bar */}
      <div className="flex items-end gap-1 h-10">
        {sorted.map((entry) => {
          const height = Math.max(10, (entry.pmf_score / 100) * 100)
          const style = VERDICT_STYLES[entry.verdict] ?? VERDICT_STYLES.KILL
          return (
            <div key={entry.version} className="flex-1 flex flex-col items-center gap-0.5">
              <span className="text-xs text-gray-500">{entry.pmf_score}%</span>
              <div
                className={`w-full rounded-t ${style.dot}`}
                style={{ height: `${height}%`, minHeight: '4px' }}
              />
              <span className="text-xs text-gray-600">v{entry.version}</span>
            </div>
          )
        })}
      </div>

      {/* Version cards */}
      <div className="pt-2">
        {sorted.map((entry, idx) => (
          <VersionCard
            key={entry.version}
            entry={entry}
            isLast={idx === sorted.length - 1}
          />
        ))}
      </div>
    </div>
  )
}
