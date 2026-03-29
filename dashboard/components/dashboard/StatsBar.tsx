'use client'

import type { DashboardData } from '@/lib/types'

interface StatsBarProps {
  summary?: DashboardData['summary']
  status?: DashboardData['status']
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  running: { label: 'Running', color: 'text-green-400' },
  paused: { label: 'Paused', color: 'text-yellow-400' },
  completed: { label: 'Completed', color: 'text-blue-400' },
  initializing: { label: 'Initializing', color: 'text-gray-400' },
}

interface StatCardProps {
  label: string
  value: number
  color: string
  bgColor: string
}

function StatCard({ label, value, color, bgColor }: StatCardProps) {
  return (
    <div className={`${bgColor} rounded-xl border px-5 py-4 flex flex-col gap-1`}>
      <span className={`text-2xl font-bold ${color}`}>{value}</span>
      <span className="text-xs text-gray-400 uppercase tracking-wider">{label}</span>
    </div>
  )
}

export function StatsBar({ summary, status }: StatsBarProps) {
  const statusInfo = STATUS_LABELS[status ?? 'initializing'] ?? STATUS_LABELS.initializing
  const s = summary ?? { total_cycles: 0, graduates: 0, iterating: 0, pivots: 0, kills: 0 }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 uppercase tracking-wider">Status</span>
        <span className={`text-sm font-medium ${statusInfo.color}`}>{statusInfo.label}</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <StatCard
          label="Total Cycles"
          value={s.total_cycles}
          color="text-white"
          bgColor="bg-gray-900 border-gray-800"
        />
        <StatCard
          label="Graduate"
          value={s.graduates}
          color="text-green-400"
          bgColor="bg-green-950/30 border-green-900/50"
        />
        <StatCard
          label="Iterating"
          value={s.iterating}
          color="text-blue-400"
          bgColor="bg-blue-950/30 border-blue-900/50"
        />
        <StatCard
          label="Pivot"
          value={s.pivots}
          color="text-amber-400"
          bgColor="bg-amber-950/30 border-amber-900/50"
        />
        <StatCard
          label="Kill"
          value={s.kills}
          color="text-red-400"
          bgColor="bg-red-950/30 border-red-900/50"
        />
      </div>
    </div>
  )
}
