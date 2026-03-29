'use client'

import type { RecentKill } from '@/lib/types'
import { formatTimeAgo } from '@/lib/types'

interface RecentKillsProps {
  kills?: RecentKill[]
}

function FunnelBar({ label, rate }: { label: string; rate: number }) {
  const pct = Math.round(rate * 100)
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-gray-500 w-6 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-red-500/60 rounded-full"
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      <span className="text-[10px] text-gray-500 w-8 text-right">{pct}%</span>
    </div>
  )
}

function KillCard({ kill }: { kill: RecentKill }) {
  const previewUrl = kill.url

  return (
    <div className="border border-red-900/30 rounded-lg overflow-hidden bg-gray-950">
      {/* iframe preview */}
      {previewUrl && (
        <div className="relative border-b border-gray-800 bg-white" style={{ height: '140px' }}>
          <iframe
            src={previewUrl}
            className="pointer-events-none origin-top-left"
            style={{ width: '1280px', height: '800px', transform: 'scale(0.18)', transformOrigin: 'top left' }}
            loading="lazy"
            sandbox="allow-scripts allow-same-origin"
          />
          {/* KILL badge overlay */}
          <div className="absolute top-2 left-2 bg-red-900/80 text-red-300 text-[10px] font-bold px-1.5 py-0.5 rounded">
            KILL {kill.funnel_summary?.pmf_score != null ? `${kill.funnel_summary.pmf_score.toFixed(1)}%` : ''}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <span className="font-medium text-white text-sm truncate">{kill.product_name}</span>
          <span className="text-[10px] text-gray-600 shrink-0">
            {kill.killed_at ? formatTimeAgo(kill.killed_at) : ''}
          </span>
        </div>

        {/* Funnel bars */}
        {kill.funnel_summary && (
          <div className="space-y-1">
            <FunnelBar label="L1" rate={kill.funnel_summary.layer1_pass_rate} />
            <FunnelBar label="L2" rate={kill.funnel_summary.layer2_pass_rate} />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-500 w-6 shrink-0">VD</span>
              <span className="text-[10px] text-red-400 font-medium">
                {kill.funnel_summary.vd_count}/250
              </span>
            </div>
          </div>
        )}

        {/* Reason */}
        {!kill.funnel_summary && kill.reason && (
          <p className="text-[11px] text-gray-500 line-clamp-2">{kill.reason}</p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3">
          {previewUrl && (
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              Open &#8599;
            </a>
          )}
          <a
            href={`/products/${kill.product_id}`}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            Details &rarr;
          </a>
        </div>
      </div>
    </div>
  )
}

export function RecentKills({ kills }: RecentKillsProps) {
  const items = (kills ?? []).slice(0, 6)

  if (items.length === 0) return null

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
          Recent Kills
        </h2>
        <span className="text-xs text-gray-600">{items.length} products</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {items.map((kill) => (
          <KillCard key={kill.product_id} kill={kill} />
        ))}
      </div>
    </div>
  )
}
