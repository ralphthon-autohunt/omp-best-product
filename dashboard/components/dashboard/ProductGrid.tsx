'use client'

import type { DashboardData } from '@/lib/types'

interface ProductGridProps {
  dashboard?: DashboardData
}

const VERDICT_COLORS: Record<string, string> = {
  GRADUATE: 'bg-green-500',
  ITERATE: 'bg-yellow-500',
  PIVOT: 'bg-orange-500',
  KILL: 'bg-red-500',
}

const STAGE_COLORS: Record<string, string> = {
  ideating: 'bg-cyan-500',
  spec: 'bg-teal-500',
  build: 'bg-amber-500',
  qa: 'bg-orange-500',
  deploy: 'bg-blue-500',
  validate: 'bg-purple-500',
  done: 'bg-green-500',
}

interface ProductCardProps {
  product_id: string
  product_name: string
  pmf_score?: number
  status: string
  last_message?: string
  deploy_url?: string
  timestamp?: string
}

function ProductCard({ product_id, product_name, pmf_score, status, last_message, deploy_url, timestamp }: ProductCardProps) {
  const dotColor = VERDICT_COLORS[status] ?? STAGE_COLORS[status] ?? 'bg-gray-500'

  return (
    <a href={`/products/${product_id}`} className="block">
      <div className="bg-gray-900/60 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-600 transition-colors">
        {/* iframe preview */}
        {deploy_url ? (
          <div className="relative bg-white overflow-hidden" style={{ height: '220px' }}>
            <iframe
              src={deploy_url}
              className="origin-top-left"
              style={{ width: '1280px', height: '800px', transform: 'scale(0.28)', transformOrigin: 'top left' }}
              loading="lazy"
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          </div>
        ) : (
          <div className="w-full h-56 bg-gray-800 flex items-center justify-center">
            <span className="text-gray-600 text-xs">No preview</span>
          </div>
        )}

        {/* info bar */}
        <div className="p-3 space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`} />
              <span className="text-sm text-white font-medium truncate">{product_name}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {pmf_score != null && (
                <span className="text-xs font-mono text-green-400">{pmf_score}%</span>
              )}
              <span className="text-xs text-gray-500 uppercase">{status}</span>
            </div>
          </div>
          {last_message && (
            <p className="text-xs text-gray-500 truncate">{last_message}</p>
          )}
          {timestamp && (
            <p className="text-[10px] text-gray-600">{new Date(timestamp).toLocaleString('ko-KR')}</p>
          )}
        </div>
      </div>
    </a>
  )
}

export function ProductGrid({ dashboard }: ProductGridProps) {
  const products: ProductCardProps[] = []
  const seen = new Set<string>()

  // From conductor log — all products with their latest state
  for (const [productId, latest] of Object.entries(dashboard?.product_latest ?? {})) {
    if (!seen.has(productId)) {
      seen.add(productId)
      products.push({
        product_id: productId,
        product_name: latest.product_name,
        pmf_score: latest.pmf_score ?? undefined,
        status: latest.verdict ?? latest.stage ?? 'unknown',
        last_message: latest.message,
        deploy_url: latest.url ?? undefined,
        timestamp: latest.timestamp,
      })
    }
  }

  // From top_graduates (fallback if no conductor log)
  for (const g of dashboard?.top_graduates ?? []) {
    if (!seen.has(g.product_id)) {
      seen.add(g.product_id)
      products.push({
        product_id: g.product_id,
        product_name: g.product_name,
        pmf_score: g.pmf_score,
        status: (g as any).verdict ?? 'GRADUATE',
        deploy_url: g.url || (g as any).deploy_url,
      })
    }
  }

  // From current_pipelines (fallback)
  for (const p of dashboard?.current_pipelines ?? []) {
    if (!seen.has(p.product_id)) {
      seen.add(p.product_id)
      products.push({
        product_id: p.product_id,
        product_name: p.product_name,
        pmf_score: (p as any).pmf_score,
        status: (p as any).status ?? p.stage ?? 'building',
        deploy_url: (p as any).deploy_url,
      })
    }
  }

  // Sort by timestamp descending (latest first)
  products.sort((a, b) => {
    if (!a.timestamp && !b.timestamp) return 0
    if (!a.timestamp) return 1
    if (!b.timestamp) return -1
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  })

  if (products.length === 0) return null

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
        All Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <ProductCard key={p.product_id} {...p} />
        ))}
      </div>
    </div>
  )
}
