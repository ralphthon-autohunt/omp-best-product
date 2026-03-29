'use client'

import type { HeartbeatState } from '@/lib/types'
import { formatTimeAgo } from '@/lib/types'

interface HeartbeatWithHealth extends HeartbeatState {
  staleness_min: number | null
  health: 'green' | 'yellow' | 'red'
}

interface SessionHealthProps {
  health?: HeartbeatWithHealth | null
}

const HEALTH_CONFIG = {
  green: {
    dot: 'bg-green-500',
    ring: 'ring-green-500/30',
    label: 'Healthy',
    textColor: 'text-green-400',
    bg: 'bg-green-950/30 border-green-900/50',
    message: (min: number | null) => min !== null ? `${min}m ago` : 'Active',
  },
  yellow: {
    dot: 'bg-yellow-500',
    ring: 'ring-yellow-500/30',
    label: 'Warning',
    textColor: 'text-yellow-400',
    bg: 'bg-yellow-950/30 border-yellow-900/50',
    message: (min: number | null) => min !== null ? `${min}m ago — check session` : 'Delayed',
  },
  red: {
    dot: 'bg-red-500',
    ring: 'ring-red-500/30',
    label: 'Critical',
    textColor: 'text-red-400',
    bg: 'bg-red-950/30 border-red-900/50',
    message: (min: number | null) =>
      min !== null ? `${min}m ago — run /omp:resume` : 'Session may be down — run /omp:resume',
  },
}

export function SessionHealth({ health }: SessionHealthProps) {
  const status = health?.health ?? 'red'
  const config = HEALTH_CONFIG[status]
  const msg = config.message(health?.staleness_min ?? null)

  return (
    <div className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border ${config.bg}`}>
      {/* Pulsing dot */}
      <div className="relative shrink-0">
        <div className={`w-2.5 h-2.5 rounded-full ${config.dot}`} />
        {status === 'green' && (
          <div className={`absolute inset-0 rounded-full ${config.dot} opacity-40 animate-ping`} />
        )}
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <span className={`text-xs font-medium ${config.textColor}`}>
            {config.label}
          </span>
          {health?.cycle_count !== undefined && (
            <span className="text-xs text-gray-600">
              · cycle {health.cycle_count}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 truncate max-w-48">{msg}</p>
      </div>
    </div>
  )
}
