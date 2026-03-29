'use client'

import type { PMFDefinition } from '@/lib/validator-types'

interface PMFResultCardProps {
  definitions?: Record<string, PMFDefinition>
}

export function PMFResultCard({ definitions }: PMFResultCardProps) {
  if (!definitions || Object.keys(definitions).length === 0) {
    return (
      <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">
          PMF Found
        </h2>
        <div className="py-6 text-center">
          <p className="text-gray-600 text-xs">루프 완료 후 PMF 정의가 표시됩니다</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
        PMF Found
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(definitions).map(([prodId, def]) => (
          <PMFCard key={prodId} prodId={prodId} definition={def} />
        ))}
      </div>
    </div>
  )
}

function PMFCard({ prodId, definition }: { prodId: string; definition: PMFDefinition }) {
  return (
    <div className="bg-gray-900/60 border border-green-900/30 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-white">{definition.product_name}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full ${
          definition.status === 'PMF_FOUND'
            ? 'bg-green-950/50 text-green-400 border border-green-800/50'
            : 'bg-blue-950/50 text-blue-400 border border-blue-800/50'
        }`}>
          {definition.status === 'PMF_FOUND' ? 'PMF 달성' : '탐색 중'}
        </span>
      </div>

      <p className="text-xs text-gray-400 leading-relaxed">
        {definition.core_value}
      </p>

      <div className="space-y-2">
        <div>
          <span className="text-xs text-gray-500 uppercase tracking-wider">HXC</span>
          <p className="text-xs text-gray-300 mt-0.5">{definition.hxc}</p>
        </div>

        <div className="flex items-center gap-4">
          <div>
            <span className="text-xs text-gray-500">전체 VD</span>
            <p className="text-lg font-bold text-green-400">{definition.vd_ratio}%</p>
          </div>
          <div>
            <span className="text-xs text-gray-500">HXC VD</span>
            <p className="text-lg font-bold text-emerald-300">{definition.hxc_vd_ratio}%</p>
          </div>
          <div className="ml-auto">
            <span className="text-xs text-gray-600">+{(definition.hxc_vd_ratio - definition.vd_ratio).toFixed(0)}p</span>
          </div>
        </div>
      </div>
    </div>
  )
}
