'use client'

import type { ProductState } from '@/lib/types'

interface ProductHeaderProps {
  product: ProductState
}

const VERDICT_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  GRADUATE: { bg: 'bg-green-950/50', text: 'text-green-400', border: 'border-green-800' },
  ITERATE:  { bg: 'bg-blue-950/50',  text: 'text-blue-400',  border: 'border-blue-800' },
  KILL:     { bg: 'bg-red-950/50',   text: 'text-red-400',   border: 'border-red-800' },
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  idea:       { label: 'Idea',       color: 'text-gray-400' },
  building:   { label: 'Building',   color: 'text-amber-400' },
  deploying:  { label: 'Deploying',  color: 'text-blue-400' },
  validating: { label: 'Validating', color: 'text-purple-400' },
  done:       { label: 'Done',       color: 'text-green-400' },
}

export function ProductHeader({ product }: ProductHeaderProps) {
  const verdictStyle = product.verdict
    ? VERDICT_STYLES[product.verdict] ?? VERDICT_STYLES.KILL
    : null
  const statusInfo = STATUS_LABELS[product.status] ?? { label: product.status, color: 'text-gray-400' }

  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 space-y-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-bold text-white">{product.product_name}</h1>
            <span className="text-xs text-gray-600 font-mono">{product.product_id}</span>
            {verdictStyle && product.verdict && (
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${verdictStyle.bg} ${verdictStyle.text} ${verdictStyle.border}`}>
                {product.verdict}
              </span>
            )}
          </div>
          <p className="text-gray-400 text-sm">{product.one_liner}</p>
        </div>

        {product.pmf_score !== null && (
          <div className="text-right shrink-0">
            <div className="text-3xl font-bold text-white">
              {product.pmf_score}
              <span className="text-xl text-gray-500">%</span>
            </div>
            <p className="text-xs text-gray-500">PMF Score</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <span className="text-gray-600 block">Segment</span>
          <span className="text-gray-300">{product.target_segment}</span>
        </div>
        <div>
          <span className="text-gray-600 block">Category</span>
          <span className="text-gray-300">{product.category || '—'}</span>
        </div>
        <div>
          <span className="text-gray-600 block">Market Phase</span>
          <span className="text-gray-300">{product.market_phase ?? '—'}</span>
        </div>
        <div>
          <span className="text-gray-600 block">Status</span>
          <span className={statusInfo.color}>{statusInfo.label}</span>
        </div>
      </div>

      {product.url && (
        <div>
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 text-sm transition-colors break-all"
          >
            {product.url}
          </a>
        </div>
      )}

      <p className="text-xs text-gray-600 leading-relaxed">
        <strong className="text-gray-500">Core Feature:</strong> {product.core_feature}
      </p>
    </div>
  )
}
