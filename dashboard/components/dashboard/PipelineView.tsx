'use client'

import type { Pipeline } from '@/lib/types'
import { formatElapsed } from '@/lib/types'

interface PipelineViewProps {
  pipelines?: Pipeline[]
}

const STAGES = ['ideating', 'spec', 'build', 'qa', 'deploy', 'validate', 'done'] as const

const STAGE_CONFIG: Record<string, { color: string; label: string; shortLabel: string }> = {
  ideating:  { color: 'bg-cyan-500',   label: 'Ideating',   shortLabel: 'Idea' },
  spec:      { color: 'bg-teal-500',   label: 'Spec',       shortLabel: 'Spec' },
  build:     { color: 'bg-amber-500',  label: 'Building',   shortLabel: 'Build' },
  qa:        { color: 'bg-orange-500', label: 'QA',         shortLabel: 'QA' },
  deploy:    { color: 'bg-blue-500',   label: 'Deploying',  shortLabel: 'Deploy' },
  validate:  { color: 'bg-purple-500', label: 'Validating', shortLabel: 'Valid' },
  done:      { color: 'bg-green-500',  label: 'Done',       shortLabel: 'Done' },
}

function StageIndicator({ currentStage }: { currentStage: string }) {
  const currentIdx = STAGES.indexOf(currentStage as typeof STAGES[number])

  return (
    <div className="flex items-center gap-1">
      {STAGES.map((stage, idx) => {
        const config = STAGE_CONFIG[stage]
        const isCompleted = idx < currentIdx
        const isCurrent = idx === currentIdx
        const isFuture = idx > currentIdx

        return (
          <div key={stage} className="flex items-center gap-1">
            {/* Dot */}
            <div className="flex flex-col items-center">
              <div
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  isCompleted
                    ? 'bg-green-500'
                    : isCurrent
                      ? `${config.color} ring-2 ring-offset-1 ring-offset-gray-900 ring-current animate-pulse`
                      : 'bg-gray-700'
                }`}
                title={config.label}
              />
              <span
                className={`text-[9px] mt-0.5 ${
                  isCurrent ? 'text-gray-200 font-medium' : isFuture ? 'text-gray-700' : 'text-gray-500'
                }`}
              >
                {config.shortLabel}
              </span>
            </div>
            {/* Connector line */}
            {idx < STAGES.length - 1 && (
              <div
                className={`w-3 h-px ${
                  idx < currentIdx ? 'bg-green-500' : 'bg-gray-700'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

function PipelineRow({ pipeline }: { pipeline: Pipeline }) {
  const config = STAGE_CONFIG[pipeline.stage] ?? STAGE_CONFIG.done
  const pct = Math.min(100, Math.max(0, pipeline.progress_pct))

  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-white text-sm truncate">
              {pipeline.product_name}
            </span>
            <span className={`${config.color} text-xs text-white px-2 py-0.5 rounded-full font-medium`}>
              {config.label}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5 truncate">{pipeline.stage_detail}</p>
        </div>
        {pipeline.elapsed_sec > 0 && (
          <span className="text-xs text-gray-500 shrink-0">
            {formatElapsed(pipeline.elapsed_sec)}
          </span>
        )}
      </div>

      {/* Stage indicator */}
      <StageIndicator currentStage={pipeline.stage} />

      {/* Progress bar within current stage */}
      {pipeline.stage !== 'done' && pct > 0 && (
        <div className="space-y-1">
          <div className="flex justify-end text-xs text-gray-500">
            <span>{pct}%</span>
          </div>
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full ${config.color} rounded-full transition-all duration-500 animate-pulse-progress`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export function PipelineView({ pipelines }: PipelineViewProps) {
  const active = pipelines ?? []

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
          Active Pipelines
        </h2>
        <span className="text-xs text-gray-500 bg-gray-900 px-2 py-0.5 rounded-full">
          {active.length} running
        </span>
      </div>

      {active.length === 0 ? (
        <div className="bg-gray-900/40 border border-gray-800 rounded-lg py-8 text-center">
          <p className="text-gray-600 text-sm">No active pipelines</p>
          <p className="text-gray-700 text-xs mt-1">SEPE engine idle or not started</p>
        </div>
      ) : (
        <div className="space-y-2">
          {active.map((p) => (
            <PipelineRow key={p.product_id} pipeline={p} />
          ))}
        </div>
      )}
    </div>
  )
}
