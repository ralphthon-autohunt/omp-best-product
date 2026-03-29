'use client'

import type { ValidatorOverview, PMFDefinition } from '@/lib/validator-types'

interface ProductDetailPanelProps {
  overview: ValidatorOverview
  selectedProduct: string | null
  onSelect: (prodId: string | null) => void
}

export function ProductDetailPanel({ overview, selectedProduct, onSelect }: ProductDetailPanelProps) {
  const productIds = Object.keys(overview.matrix)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
          제품별 상세
        </h2>
        {selectedProduct && (
          <button
            onClick={() => onSelect(null)}
            className="text-xs text-gray-500 hover:text-white transition-colors"
          >
            전체 보기
          </button>
        )}
      </div>

      {/* Product selector tabs */}
      <div className="flex flex-wrap gap-2">
        {productIds.map(prodId => {
          const name = getProductName(overview, prodId)
          const isSelected = selectedProduct === prodId
          const latestScore = getLatestScore(overview.matrix[prodId])
          const def = overview.pmf_definitions?.[prodId]

          return (
            <button
              key={prodId}
              onClick={() => onSelect(isSelected ? null : prodId)}
              className={`
                px-3 py-2 rounded-lg text-xs font-medium transition-all border
                ${isSelected
                  ? 'bg-blue-950/50 border-blue-500/50 text-blue-300'
                  : 'bg-gray-900/60 border-gray-800 text-gray-400 hover:border-gray-700 hover:text-gray-300'
                }
              `}
            >
              <span>{name}</span>
              <span className={`ml-2 ${latestScore >= 40 ? 'text-green-400' : 'text-amber-400'}`}>
                {latestScore}%
              </span>
            </button>
          )
        })}
      </div>

      {/* Selected product detail */}
      {selectedProduct && (
        <ProductDetail
          prodId={selectedProduct}
          overview={overview}
        />
      )}
    </div>
  )
}

function ProductDetail({ prodId, overview }: { prodId: string; overview: ValidatorOverview }) {
  const scores = overview.matrix[prodId]
  const verdicts = overview.verdicts[prodId]
  const def = overview.pmf_definitions?.[prodId]

  if (!scores) return null

  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">{getProductName(overview, prodId)}</h3>
          {def && (
            <p className="text-xs text-gray-400 mt-0.5">{def.core_value}</p>
          )}
        </div>
        {verdicts && (
          <VerdictBadge verdict={Object.values(verdicts).pop() ?? 'UNKNOWN'} />
        )}
      </div>

      {/* Score progression */}
      <div>
        <span className="text-xs text-gray-500 uppercase tracking-wider">VD Ratio 변화</span>
        <div className="flex items-center gap-3 mt-2">
          {Object.entries(scores).map(([step, score], idx, arr) => {
            const prev = idx > 0 ? Object.values(scores)[idx - 1] : null
            const delta = prev !== null ? score - prev : 0
            return (
              <div key={step} className="flex items-center gap-2">
                <div className="text-center">
                  <p className="text-lg font-bold text-white">{score}%</p>
                  <p className="text-xs text-gray-600">{formatStepLabel(step)}</p>
                  {delta !== 0 && (
                    <span className={`text-xs ${delta > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {delta > 0 ? '+' : ''}{delta.toFixed(0)}p
                    </span>
                  )}
                </div>
                {idx < arr.length - 1 && (
                  <span className="text-gray-700">→</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* HXC Profile */}
      {def && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-l-2 border-violet-500/50 pl-3">
            <span className="text-xs text-violet-400 uppercase tracking-wider">HXC 페르소나</span>
            <p className="text-xs text-gray-300 mt-1">{def.hxc}</p>
          </div>
          <div className="flex items-center gap-6">
            <div>
              <span className="text-xs text-gray-500">전체 VD</span>
              <p className="text-xl font-bold text-green-400">{def.vd_ratio}%</p>
            </div>
            <div>
              <span className="text-xs text-gray-500">HXC VD</span>
              <p className="text-xl font-bold text-emerald-300">{def.hxc_vd_ratio}%</p>
            </div>
            <div className="text-xs text-gray-500">
              +{(def.hxc_vd_ratio - def.vd_ratio).toFixed(0)}p
            </div>
          </div>
        </div>
      )}

      {/* VD Optimism Warning */}
      <div className="bg-amber-950/20 border border-amber-900/30 rounded-lg px-4 py-3">
        <div className="flex items-start gap-2">
          <span className="text-amber-400 text-xs mt-0.5">!</span>
          <div>
            <p className="text-xs text-amber-300 font-medium">VD 낙관 편향 경고</p>
            <p className="text-xs text-gray-500 mt-0.5">
              시뮬레이션 VD는 실제보다 15-20p 높게 측정됨.
              Lite 규칙 기반(50%) + LLM 긍정 편향 + 타겟 세그먼트 자기 충족.
              실제 기준 적용 시 {(scores.v1 * 0.7).toFixed(0)}~{(scores.v1 * 0.8).toFixed(0)}% 추정.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function VerdictBadge({ verdict }: { verdict: string }) {
  const styles: Record<string, string> = {
    GRADUATE: 'bg-green-950/50 text-green-400 border-green-800/50',
    ITERATE: 'bg-blue-950/50 text-blue-400 border-blue-800/50',
    KILL: 'bg-red-950/50 text-red-400 border-red-800/50',
  }
  return (
    <span className={`text-xs px-2 py-1 rounded-full border ${styles[verdict] || 'bg-gray-800 text-gray-500 border-gray-700'}`}>
      {verdict}
    </span>
  )
}

function getProductName(overview: ValidatorOverview, prodId: string): string {
  // Try pmf_definitions first, then use prodId
  return overview.pmf_definitions?.[prodId]?.product_name || prodId
}

function getLatestScore(scores: Record<string, number>): number {
  const values = Object.values(scores)
  return values[values.length - 1] ?? 0
}

function formatStepLabel(step: string): string {
  const labels: Record<string, string> = {
    v1: 'v1',
    'step-1': 'S1',
    'step-2': 'S2',
    'step-3': 'S3',
    'step-4': 'S4',
  }
  return labels[step] || step
}
