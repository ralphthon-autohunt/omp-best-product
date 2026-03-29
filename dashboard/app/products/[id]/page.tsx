'use client'

import { usePolling } from '@/lib/polling'
import type { ProductState } from '@/lib/types'
import { ProductHeader } from '@/components/product/ProductHeader'
import { Q1Chart } from '@/components/product/Q1Chart'
import { PersonaHighlights } from '@/components/product/PersonaHighlights'
import { Timeline } from '@/components/product/Timeline'
import { VersionHistory } from '@/components/product/VersionHistory'
import { DiscoveryReport } from '@/components/product/DiscoveryReport'
import { PersonaResponsesPanel } from '@/components/product/PersonaResponsesPanel'

interface ProductPageProps {
  params: { id: string }
}

export default function ProductPage({ params }: ProductPageProps) {
  const { data: product, error, isLoading } = usePolling<ProductState>(
    `/api/products/${params.id}`,
    20000
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-gray-500 text-sm">Loading product data...</div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="space-y-4">
        <a href="/" className="text-gray-500 hover:text-white text-sm transition-colors">
          &larr; Back to Dashboard
        </a>
        <div className="bg-red-950/50 border border-red-800 rounded-lg px-4 py-6 text-center">
          <p className="text-red-300 text-sm">
            Product <code className="bg-red-900/50 px-1 rounded">{params.id}</code> not found.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            {error ?? 'State file may not exist yet.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <a href="/" className="text-gray-500 hover:text-white text-sm transition-colors">
        &larr; Back to Dashboard
      </a>

      <ProductHeader product={product} />

      {product.iterate_history?.length > 0 && (
        <VersionHistory history={product.iterate_history} />
      )}

      <DiscoveryReport productId={params.id} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Q1Chart validationResult={product.validation_result} />
        <PersonaHighlights personas={product.validation_result?.personas} />
      </div>

      <PersonaResponsesPanel
        productId={params.id}
        cycleNumber={product.cycle_number ?? 1}
      />

      <Timeline product={product} />
    </div>
  )
}
