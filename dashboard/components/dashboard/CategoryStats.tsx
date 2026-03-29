'use client'

import type { DashboardData, CategoryStat } from '@/lib/types'

interface CategoryStatsProps {
  categoryStats?: Record<string, CategoryStat>
}

interface CategoryRowProps {
  name: string
  stat: CategoryStat
  rank: number
}

function CategoryRow({ name, stat, rank }: CategoryRowProps) {
  const graduateRate = stat.total > 0 ? Math.round((stat.graduates / stat.total) * 100) : 0

  return (
    <div className="flex items-center gap-3 py-2 border-b border-gray-800/50 last:border-0">
      <span className="text-xs text-gray-600 w-4 shrink-0">{rank}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-white truncate">{name}</span>
          <span className="text-xs text-gray-400 shrink-0">{(stat.avg_pmf ?? 0).toFixed(0)}% avg</span>
        </div>
        <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
          <span>{stat.total} cycles</span>
          <span className="text-green-500">{stat.graduates} grad</span>
          <span className="text-red-500">{stat.kills} kill</span>
        </div>
      </div>
      <div className="w-12 text-right shrink-0">
        <span className={`text-xs font-medium ${graduateRate >= 20 ? 'text-green-400' : 'text-gray-500'}`}>
          {graduateRate}%
        </span>
      </div>
    </div>
  )
}

export function CategoryStats({ categoryStats }: CategoryStatsProps) {
  const entries = Object.entries(categoryStats ?? {})
    .sort((a, b) => (b[1].avg_pmf ?? 0) - (a[1].avg_pmf ?? 0))
    .slice(0, 8)

  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
          Categories
        </h2>
        <span className="text-xs text-gray-500">by avg PMF</span>
      </div>

      {entries.length === 0 ? (
        <div className="py-6 text-center">
          <p className="text-gray-600 text-xs">No category data yet</p>
        </div>
      ) : (
        <div>
          {entries.map(([name, stat], idx) => (
            <CategoryRow key={name} name={name} stat={stat} rank={idx + 1} />
          ))}
        </div>
      )}
    </div>
  )
}
