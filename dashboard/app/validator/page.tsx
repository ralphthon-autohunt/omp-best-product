'use client'

import { useState } from 'react'
import { usePolling } from '@/lib/polling'
import type { ValidatorOverview, ValidatorStatus } from '@/lib/validator-types'
import { ValidatorProgress } from '@/components/validator/ValidatorProgress'
import { ValidatorScoreChart } from '@/components/validator/ValidatorScoreChart'
import { ValidatorTimeline } from '@/components/validator/ValidatorTimeline'
import { ProductDetailPanel } from '@/components/validator/ProductDetailPanel'
import { PMFResultCard } from '@/components/validator/PMFResultCard'
import { ValidatorLimitations } from '@/components/validator/ValidatorLimitations'

export default function ValidatorPage() {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)

  const { data: overview, isLoading: overviewLoading } = usePolling<ValidatorOverview>(
    '/api/validator/overview',
    5000
  )
  const { data: status, isLoading: statusLoading } = usePolling<ValidatorStatus>(
    '/api/validator/status',
    5000
  )

  const isLoading = overviewLoading || statusLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-gray-500 text-sm">Validator v2 로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/" className="text-gray-500 hover:text-white text-sm transition-colors">
            &larr; Dashboard
          </a>
          <div>
            <h1 className="text-xl font-bold text-white">통계적 고객집착</h1>
            <p className="text-gray-500 text-xs mt-0.5">
              Validator v2 — 레브잇(alwayz) PMF 방법론 기반 자율 개선 루프
            </p>
          </div>
        </div>
        {status && status.status !== 'waiting' && (
          <div className="text-right">
            <span className="text-xs text-gray-500">
              {status.updated_at ? formatTimeAgo(status.updated_at) : ''}
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <ValidatorProgress
        currentStep={status?.current_step ?? 0}
        totalSteps={status?.total_steps ?? 4}
        steps={status?.steps ?? []}
        status={status?.status ?? 'waiting'}
      />

      {/* Score Chart */}
      {overview && <ValidatorScoreChart overview={overview} />}

      {/* Product Detail Panel */}
      {overview && (
        <ProductDetailPanel
          overview={overview}
          selectedProduct={selectedProduct}
          onSelect={setSelectedProduct}
        />
      )}

      {/* Timeline */}
      <ValidatorTimeline steps={status?.steps ?? []} />

      {/* PMF Result */}
      {overview?.pmf_definitions && (
        <PMFResultCard definitions={overview.pmf_definitions} />
      )}

      {/* Limitations */}
      <ValidatorLimitations />
    </div>
  )
}

function formatTimeAgo(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime()
  const diffSec = Math.floor(diffMs / 1000)
  if (diffSec < 60) return `${diffSec}s ago`
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  return `${diffHr}h ago`
}
