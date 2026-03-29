'use client'

import { useState } from 'react'
import type { LocalService } from '@/lib/types'

interface ProductPreviewProps {
  services: Record<string, LocalService>
}

const VERDICT_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  GRADUATE: { bg: 'bg-green-900/70', text: 'text-green-300', label: 'GRADUATE' },
  ITERATE:  { bg: 'bg-yellow-900/70', text: 'text-yellow-300', label: 'ITERATE' },
  KILL:     { bg: 'bg-red-900/70', text: 'text-red-300', label: 'KILL' },
}

function VerdictBadge({ verdict, pmfScore }: { verdict?: string | null; pmfScore?: number | null }) {
  if (!verdict) return null
  const style = VERDICT_STYLES[verdict]
  if (!style) return null

  return (
    <div className={`${style.bg} ${style.text} text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1`}>
      <span>{style.label}</span>
      {pmfScore != null && <span className="font-normal opacity-80">{pmfScore.toFixed(1)}%</span>}
    </div>
  )
}

function IframeCard({ productId, service }: { productId: string; service: LocalService }) {
  const [hasError, setHasError] = useState(false)
  const url = `http://localhost:${service.port}`
  const displayName = service.product_name || productId

  return (
    <div className="border border-gray-800 rounded-lg overflow-hidden bg-gray-950 relative">
      {/* Verdict badge — top left overlay */}
      {service.verdict && (
        <div className="absolute top-10 left-2 z-10">
          <VerdictBadge verdict={service.verdict} pmfScore={service.pmf_score} />
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-900/60 border-b border-gray-800">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
          <span className="text-sm font-medium text-white truncate">{displayName}</span>
          <span className="text-xs bg-blue-900/50 text-blue-300 px-1.5 py-0.5 rounded shrink-0">
            :{service.port}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-2">
          <a
            href={`/products/${productId}`}
            className="text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-1 rounded-md transition-colors"
          >
            상세 리포트 보기
          </a>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            Open &rarr;
          </a>
        </div>
      </div>

      {/* iframe or fallback */}
      {hasError ? (
        <div className="flex items-center justify-center h-64 bg-gray-900/20">
          <div className="text-center">
            <p className="text-gray-500 text-sm">서버 응답 없음</p>
            <p className="text-gray-600 text-xs mt-1">Port {service.port}</p>
            <button
              onClick={() => setHasError(false)}
              className="mt-2 text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <iframe
          src={url}
          className="w-full h-64 border-0"
          onError={() => setHasError(true)}
          onLoad={(e) => {
            try {
              const frame = e.target as HTMLIFrameElement
              if (!frame.contentWindow) setHasError(true)
            } catch {
              // Cross-origin — expected, iframe is working
            }
          }}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          title={`Preview: ${displayName}`}
        />
      )}
    </div>
  )
}

export function ProductPreview({ services }: ProductPreviewProps) {
  const entries = Object.entries(services)
    .filter(([, s]) => !s.status || s.status === 'running')
    .sort(([, a], [, b]) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime())

  if (entries.length === 0) return null

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
          Local Preview
        </h2>
        <span className="text-xs text-gray-600">
          {entries.length} running
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {entries.map(([productId, service]) => (
          <IframeCard key={productId} productId={productId} service={service} />
        ))}
      </div>
    </div>
  )
}
