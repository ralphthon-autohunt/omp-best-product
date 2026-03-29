'use client'

import type { ValidatorStepMeta } from '@/lib/validator-types'

interface ValidatorTimelineProps {
  steps: ValidatorStepMeta[]
}

export function ValidatorTimeline({ steps }: ValidatorTimelineProps) {
  if (steps.length === 0) {
    return (
      <div className="bg-gray-900/40 border border-gray-800 rounded-lg py-8 text-center">
        <p className="text-gray-600 text-sm">루프 시작 대기 중...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
        개선 여정
      </h2>
      {steps.map(step => (
        <StepCard key={step.step} step={step} />
      ))}
    </div>
  )
}

function StepCard({ step }: { step: ValidatorStepMeta }) {
  const isCompleted = step.status === 'completed'
  const isActive = step.status === 'in_progress'

  return (
    <div className={`
      bg-gray-900/60 border rounded-xl p-5 space-y-3 transition-all
      ${isActive ? 'border-blue-500/50 shadow-lg shadow-blue-500/5' : 'border-gray-800'}
    `}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`
            w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
            ${isCompleted ? 'bg-green-500/20 text-green-400' : ''}
            ${isActive ? 'bg-blue-500/20 text-blue-400' : ''}
            ${!isCompleted && !isActive ? 'bg-gray-800 text-gray-600' : ''}
          `}>
            {isCompleted ? '✓' : step.step}
          </div>
          <div>
            <span className="text-sm font-medium text-white">
              Step {step.step}: {step.title}
            </span>
            <span className="text-xs text-gray-500 ml-2">
              ({step.alwayz_ref})
            </span>
          </div>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full ${
          isCompleted ? 'bg-green-950/50 text-green-400' :
          isActive ? 'bg-blue-950/50 text-blue-400' :
          'bg-gray-800 text-gray-500'
        }`}>
          {isCompleted ? '완료' : isActive ? '진행중' : '대기'}
        </span>
      </div>

      {/* Hypothesis */}
      <div className="border-l-2 border-blue-500/50 pl-3">
        <span className="text-xs text-blue-400 uppercase tracking-wider">가설</span>
        <p className="text-xs text-gray-300 mt-1">{step.hypothesis}</p>
      </div>

      {/* Result */}
      {isCompleted && step.result_summary && (
        <div className="border-l-2 border-green-500/50 pl-3">
          <span className="text-xs text-green-400 uppercase tracking-wider">결과</span>
          <p className="text-xs text-gray-300 mt-1">{step.result_summary}</p>
          {step.insight && (
            <p className="text-xs text-gray-500 mt-1 italic">{step.insight}</p>
          )}
        </div>
      )}

      {/* Active indicator */}
      {isActive && (
        <div className="border-l-2 border-blue-500/50 pl-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
            </span>
            <span className="text-xs text-blue-400">분석 진행 중...</span>
          </div>
        </div>
      )}
    </div>
  )
}
