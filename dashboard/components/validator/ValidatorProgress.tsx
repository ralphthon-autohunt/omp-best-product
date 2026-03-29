'use client'

import type { ValidatorStepMeta } from '@/lib/validator-types'

interface ValidatorProgressProps {
  currentStep: number
  totalSteps: number
  steps: ValidatorStepMeta[]
  status: string
}

const STEP_LABELS = [
  'VD=북극성',
  'HXC 정의',
  'SD 분리',
  '2-Track',
]

export function ValidatorProgress({ currentStep, totalSteps, steps, status }: ValidatorProgressProps) {
  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-xl px-6 py-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
            통계적 고객집착 루프
          </h2>
          {status === 'running' && (
            <span className="flex items-center gap-1.5 text-xs text-blue-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
              </span>
              Live
            </span>
          )}
          {status === 'completed' && (
            <span className="text-xs text-green-400">완료</span>
          )}
        </div>
        <span className="text-xs text-gray-500">
          {currentStep}/{totalSteps} steps
        </span>
      </div>

      <div className="flex items-center gap-0">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNum = i + 1
          const stepMeta = steps.find(s => s.step === stepNum)
          const isCompleted = stepMeta?.status === 'completed'
          const isActive = stepMeta?.status === 'in_progress'
          const isPending = !isCompleted && !isActive

          return (
            <div key={stepNum} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                  ${isCompleted ? 'bg-green-500/20 text-green-400 border border-green-500/50' : ''}
                  ${isActive ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' : ''}
                  ${isPending ? 'bg-gray-800 text-gray-600 border border-gray-700' : ''}
                `}>
                  {isCompleted ? '✓' : stepNum}
                </div>
                <span className={`text-xs text-center leading-tight ${
                  isCompleted ? 'text-green-400' :
                  isActive ? 'text-blue-400' :
                  'text-gray-600'
                }`}>
                  {STEP_LABELS[i] || `Step ${stepNum}`}
                </span>
              </div>
              {stepNum < totalSteps && (
                <div className={`flex-1 h-px mx-2 ${
                  isCompleted ? 'bg-green-500/50' : 'bg-gray-800'
                }`} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
