'use client'

import { usePolling } from '@/lib/polling'

interface DiscoverySection {
  cycle: string | null
  product_name: string
  verdict: string | null
  raw_markdown: string
  idea_section: string[]
  build_section: string[]
  pmf_section: string[]
  persona_section: string[]
  iterate_section: string[]
  market_section: string[]
  kill_reason: string[]
  structural_lesson: string[]
}

interface DiscoveryData {
  product_id: string
  product_name: string
  found: boolean
  sections: DiscoverySection[]
  error?: string
}

const SECTION_ICONS: Record<string, string> = {
  '아이디어 발굴': '💡',
  '빌드': '🔨',
  'PMF 검증': '📊',
  '페르소나 하이라이트': '👤',
  'ITERATE 이력': '🔄',
  '시장 확장': '🚀',
  'KILL 이유': '💀',
  '구조적 교훈': '🧠',
}

function SectionBlock({ title, items, highlight }: { title: string; items: string[]; highlight?: boolean }) {
  if (items.length === 0) return null
  const icon = SECTION_ICONS[title] ?? '📋'
  return (
    <div className={`rounded-lg p-3 space-y-2 ${highlight ? 'bg-gray-800/80 border border-gray-700/50' : 'bg-gray-900/50'}`}>
      <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
        <span>{icon}</span>
        {title}
      </h4>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-gray-300 leading-relaxed">
            {item.startsWith('- ') ? (
              <span className="flex gap-2">
                <span className="text-gray-600 shrink-0">•</span>
                <span>{item.slice(2)}</span>
              </span>
            ) : item.startsWith('> ') ? (
              <blockquote className="border-l-2 border-purple-500/50 pl-3 italic text-gray-400 text-sm">
                {item.slice(2)}
              </blockquote>
            ) : item.match(/^\d+\./) ? (
              <span className="flex gap-2">
                <span className="text-gray-500 shrink-0 font-mono text-xs mt-0.5">{item.match(/^\d+/)?.[0]}.</span>
                <span>{item.replace(/^\d+\.\s*/, '').replace(/\*\*/g, '')}</span>
              </span>
            ) : (
              <span>{item.replace(/\*\*/g, '')}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

const VERDICT_STYLES: Record<string, { border: string; bg: string; badge: string; badgeText: string }> = {
  GRADUATE: {
    border: 'border-green-700/60',
    bg: 'bg-gradient-to-br from-green-950/40 to-gray-950',
    badge: 'bg-green-500',
    badgeText: 'text-white',
  },
  ITERATE: {
    border: 'border-yellow-700/60',
    bg: 'bg-gradient-to-br from-yellow-950/30 to-gray-950',
    badge: 'bg-yellow-500',
    badgeText: 'text-black',
  },
  KILL: {
    border: 'border-red-700/60',
    bg: 'bg-gradient-to-br from-red-950/30 to-gray-950',
    badge: 'bg-red-500',
    badgeText: 'text-white',
  },
}

const DEFAULT_STYLE = {
  border: 'border-gray-700/60',
  bg: 'bg-gray-950',
  badge: 'bg-gray-600',
  badgeText: 'text-white',
}

function CycleCard({ section }: { section: DiscoverySection }) {
  const verdict = section.verdict?.trim().split(' ')[0] ?? ''
  const style = VERDICT_STYLES[verdict] ?? DEFAULT_STYLE

  return (
    <div className={`border ${style.border} ${style.bg} rounded-xl p-5 space-y-4`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {section.cycle != null && (
            <span className="text-lg font-bold text-gray-400">#{section.cycle}</span>
          )}
          <span className="font-semibold text-white text-lg">{section.product_name}</span>
        </div>
        {section.verdict && (
          <span className={`${style.badge} ${style.badgeText} text-xs font-bold px-3 py-1 rounded-full`}>
            {section.verdict.trim()}
          </span>
        )}
      </div>

      {/* KILL reason + structural lesson — prominent if present */}
      {(section.kill_reason.length > 0 || section.structural_lesson.length > 0) && (
        <div className="grid grid-cols-1 gap-3">
          <SectionBlock title="KILL 이유" items={section.kill_reason} highlight />
          <SectionBlock title="구조적 교훈" items={section.structural_lesson} highlight />
        </div>
      )}

      {/* Content grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <SectionBlock title="아이디어 발굴" items={section.idea_section} />
        <SectionBlock title="빌드" items={section.build_section} />
        <SectionBlock title="PMF 검증" items={section.pmf_section} />
        <SectionBlock title="페르소나 하이라이트" items={section.persona_section} />
        <SectionBlock title="ITERATE 이력" items={section.iterate_section} />
        <SectionBlock title="시장 확장" items={section.market_section} />
      </div>
    </div>
  )
}

export function DiscoveryReport({ productId }: { productId: string }) {
  const { data, error, isLoading } = usePolling<DiscoveryData>(
    `/api/discovery-log/${productId}`,
    30000
  )

  if (isLoading) {
    return (
      <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6 animate-pulse">
        <div className="h-4 bg-gray-800 rounded w-48 mb-3" />
        <div className="h-20 bg-gray-800/50 rounded" />
      </div>
    )
  }

  if (error || !data?.found) {
    return (
      <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-2">
          Discovery Report
        </h3>
        <p className="text-gray-600 text-sm">No discovery log found for this product.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h3 className="text-base font-bold text-white">Discovery Report</h3>
        <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">
          {data.sections.length} cycle{data.sections.length !== 1 ? 's' : ''}
        </span>
      </div>
      {data.sections.map((section, i) => (
        <CycleCard key={i} section={section} />
      ))}
    </div>
  )
}
