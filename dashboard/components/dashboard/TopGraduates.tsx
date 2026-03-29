'use client'

import type { TopProduct } from '@/lib/types'

interface TopGraduatesProps {
  graduates?: TopProduct[]
}

interface GraduateCardProps {
  product: TopProduct
  rank: number
}

const RANK_STYLES = [
  'border-yellow-700/50 bg-yellow-950/20',
  'border-gray-600/50 bg-gray-900/40',
  'border-amber-800/50 bg-amber-950/20',
]

const RANK_LABELS = ['1st', '2nd', '3rd']

function GraduateCard({ product, rank }: GraduateCardProps) {
  const borderStyle = RANK_STYLES[rank - 1] ?? 'border-gray-800 bg-gray-900/40'
  const rankLabel = RANK_LABELS[rank - 1] ?? `${rank}th`
  const previewUrl = product.url || (product as any).deploy_url

  return (
    <div className={`border rounded-lg p-3 space-y-2 ${borderStyle}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{rankLabel}</span>
            <span className="font-medium text-white text-sm truncate">
              {product.product_name}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">{product.market_phase}</p>
        </div>
        <div className="shrink-0 text-right">
          <span className="text-lg font-bold text-green-400">{product.pmf_score}%</span>
          <p className="text-xs text-green-600">PMF</p>
        </div>
      </div>

      {previewUrl && (
        <>
          <div className="rounded-md overflow-hidden border border-gray-700 bg-white" style={{ height: '160px' }}>
            <iframe
              src={previewUrl}
              className="pointer-events-none origin-top-left"
              style={{ width: '1280px', height: '800px', transform: 'scale(0.22)', transformOrigin: 'top left' }}
              loading="lazy"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-xs text-blue-400 hover:text-blue-300 truncate transition-colors"
          >
            {previewUrl} &#8599;
          </a>
        </>
      )}

      <a
        href={`/products/${product.product_id}`}
        className="block text-xs text-gray-500 hover:text-gray-300 transition-colors"
      >
        View details &rarr;
      </a>
    </div>
  )
}

export function TopGraduates({ graduates }: TopGraduatesProps) {
  const top = (graduates ?? []).slice(0, 3)

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
        Top Graduates
      </h2>

      {top.length === 0 ? (
        <div className="bg-gray-900/40 border border-gray-800 rounded-lg py-6 text-center">
          <p className="text-gray-600 text-xs">No graduates yet</p>
          <p className="text-gray-700 text-xs mt-1">Need PMF 55%+</p>
        </div>
      ) : (
        <div className="space-y-2">
          {top.map((product, idx) => (
            <GraduateCard key={product.product_id} product={product} rank={idx + 1} />
          ))}
        </div>
      )}
    </div>
  )
}
