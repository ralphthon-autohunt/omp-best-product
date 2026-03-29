'use client'

import { usePolling } from '@/lib/polling'
import type { DashboardData, HeartbeatState, LocalPortsData } from '@/lib/types'
import { StatsBar } from '@/components/dashboard/StatsBar'
import { PipelineView } from '@/components/dashboard/PipelineView'
import { PMFChart } from '@/components/dashboard/PMFChart'
import { CategoryStats } from '@/components/dashboard/CategoryStats'
import { TopGraduates } from '@/components/dashboard/TopGraduates'
import { SessionHealth } from '@/components/dashboard/SessionHealth'
import { ThresholdBadge } from '@/components/dashboard/ThresholdBadge'
import { ProductPreview } from '@/components/dashboard/ProductPreview'
import { RecentKills } from '@/components/dashboard/RecentKills'

// 5s interval for presentations, 20s default
const POLL_INTERVAL_MS = 20000

export default function DashboardPage() {
  const { data: dashboard, error: dashError, lastUpdated } = usePolling<DashboardData>(
    '/api/dashboard',
    POLL_INTERVAL_MS
  )
  const { data: health } = usePolling<HeartbeatState & { staleness_min: number | null; health: 'green' | 'yellow' | 'red' }>(
    '/api/health',
    POLL_INTERVAL_MS
  )
  const { data: localPorts } = usePolling<LocalPortsData>(
    '/api/local-ports',
    POLL_INTERVAL_MS
  )

  return (
    <div className="space-y-6">
      {/* Top row: session health + threshold badge */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">SEPE Engine</h1>
          <p className="text-gray-400 text-sm mt-0.5">Autonomous PMF Discovery Loop</p>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <SessionHealth health={health} />
          {lastUpdated && (
            <span className="text-xs text-gray-600">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {dashError && (
        <div className="bg-red-950/50 border border-red-800 rounded-lg px-4 py-3 text-red-300 text-sm">
          State file unavailable: {dashError}. SEPE engine may not be running.
        </div>
      )}

      {/* ThresholdBadge — always visible (AC-9) */}
      <ThresholdBadge thresholds={dashboard?.pmf_thresholds} />

      {/* Stats row */}
      <StatsBar summary={dashboard?.summary} status={dashboard?.status} />

      {/* Local Preview — shown only when local servers are running */}
      {localPorts?.services && Object.keys(localPorts.services).length > 0 && (
        <ProductPreview services={localPorts.services} />
      )}

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: active pipelines (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <PipelineView pipelines={dashboard?.current_pipelines} />
          <PMFChart dashboard={dashboard} />
        </div>

        {/* Right sidebar (1/3 width) */}
        <div className="space-y-6">
          <TopGraduates graduates={dashboard?.top_graduates} />
          <RecentKills kills={dashboard?.recent_kills} />
          <CategoryStats categoryStats={dashboard?.category_stats} />
        </div>
      </div>
    </div>
  )
}
