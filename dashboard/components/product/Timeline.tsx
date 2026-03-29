'use client'

import type { ProductState } from '@/lib/types'
import { formatElapsed } from '@/lib/types'

interface TimelineProps {
  product: ProductState
}

type TimelineStage = 'idea' | 'building' | 'deploying' | 'validating' | 'done'

interface TimelineStep {
  stage: TimelineStage
  label: string
  sublabel: string
}

const TIMELINE_STEPS: TimelineStep[] = [
  { stage: 'idea',       label: 'Idea',       sublabel: 'Ideator generates concept' },
  { stage: 'building',   label: 'Build',      sublabel: 'Builder-PM + Engineer + QA' },
  { stage: 'deploying',  label: 'Deploy',     sublabel: 'Vercel deployment' },
  { stage: 'validating', label: 'Validate',   sublabel: 'Sean Ellis 4Q survey' },
  { stage: 'done',       label: 'Result',     sublabel: 'Verdict recorded' },
]

const STAGE_ORDER: Record<string, number> = {
  idea: 0,
  building: 1,
  deploying: 2,
  validating: 3,
  done: 4,
}

function getStepStatus(
  step: TimelineStage,
  currentStatus: string
): 'complete' | 'active' | 'pending' {
  const stepOrder = STAGE_ORDER[step] ?? 0
  const currentOrder = STAGE_ORDER[currentStatus] ?? 0

  if (stepOrder < currentOrder) return 'complete'
  if (stepOrder === currentOrder) return 'active'
  return 'pending'
}

const STEP_STYLES = {
  complete: {
    dot: 'bg-green-500 border-green-500',
    line: 'bg-green-500',
    label: 'text-green-400',
    sublabel: 'text-gray-500',
  },
  active: {
    dot: 'bg-blue-500 border-blue-500 ring-2 ring-blue-500/30',
    line: 'bg-gray-700',
    label: 'text-white',
    sublabel: 'text-gray-400',
  },
  pending: {
    dot: 'bg-gray-800 border-gray-700',
    line: 'bg-gray-800',
    label: 'text-gray-600',
    sublabel: 'text-gray-700',
  },
}

export function Timeline({ product }: TimelineProps) {
  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
          Cycle Timeline
        </h2>
        {product.elapsed_sec !== null && (
          <span className="text-xs text-gray-500">
            Total: {formatElapsed(product.elapsed_sec)}
          </span>
        )}
      </div>

      <div className="relative">
        <div className="flex items-start justify-between relative">
          {TIMELINE_STEPS.map((step, idx) => {
            const status = getStepStatus(step.stage, product.status)
            const styles = STEP_STYLES[status]
            const isLast = idx === TIMELINE_STEPS.length - 1

            return (
              <div key={step.stage} className="flex flex-col items-center flex-1 relative">
                {/* Connector line */}
                {!isLast && (
                  <div
                    className={`absolute top-3 left-1/2 w-full h-0.5 ${styles.line} z-0`}
                    style={{ transform: 'translateX(0)' }}
                  />
                )}

                {/* Dot */}
                <div
                  className={`w-6 h-6 rounded-full border-2 z-10 relative ${styles.dot} flex items-center justify-center`}
                >
                  {status === 'complete' && (
                    <span className="text-white text-xs font-bold">✓</span>
                  )}
                  {status === 'active' && (
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  )}
                </div>

                {/* Labels */}
                <div className="mt-2 text-center px-1">
                  <p className={`text-xs font-medium ${styles.label}`}>{step.label}</p>
                  <p className={`text-xs mt-0.5 hidden sm:block ${styles.sublabel}`}>
                    {step.sublabel}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Meta details */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-2 border-t border-gray-800">
        <div>
          <span className="text-gray-600 block">Cycle #</span>
          <span className="text-gray-300">{product.cycle_number}</span>
        </div>
        <div>
          <span className="text-gray-600 block">Started</span>
          <span className="text-gray-300">
            {new Date(product.started_at).toLocaleTimeString()}
          </span>
        </div>
        {product.completed_at && (
          <div>
            <span className="text-gray-600 block">Completed</span>
            <span className="text-gray-300">
              {new Date(product.completed_at).toLocaleTimeString()}
            </span>
          </div>
        )}
        {product.build_result && (
          <div>
            <span className="text-gray-600 block">Build</span>
            <span className={product.build_result.success ? 'text-green-400' : 'text-red-400'}>
              {product.build_result.success ? 'Success' : 'Failed'}
              {product.build_result.build_time_sec
                ? ` (${formatElapsed(product.build_result.build_time_sec)})`
                : ''}
            </span>
          </div>
        )}
        {product.deploy_result && (
          <div>
            <span className="text-gray-600 block">Deploy</span>
            <span className={product.deploy_result.success ? 'text-green-400' : 'text-red-400'}>
              {product.deploy_result.success ? 'Success' : 'Failed'}
              {product.deploy_result.deploy_time_sec
                ? ` (${formatElapsed(product.deploy_result.deploy_time_sec)})`
                : ''}
            </span>
          </div>
        )}
        <div>
          <span className="text-gray-600 block">Personas</span>
          <span className="text-gray-300">{product.personas_used?.length ?? 0} used</span>
        </div>
      </div>
    </div>
  )
}
