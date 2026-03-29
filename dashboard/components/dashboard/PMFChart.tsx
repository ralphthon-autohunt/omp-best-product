'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import type { DashboardData } from '@/lib/types'

interface PMFChartProps {
  dashboard?: DashboardData | null
}

interface ChartDataPoint {
  name: string
  score: number
  verdict: string
  fill: string
}

function getVerdictColor(score: number): string {
  if (score >= 55) return '#22c55e'   // green-500 — GRADUATE
  if (score >= 25) return '#3b82f6'   // blue-500 — ITERATE
  return '#ef4444'                     // red-500 — KILL
}

function getVerdict(score: number): string {
  if (score >= 55) return 'GRADUATE'
  if (score >= 25) return 'ITERATE'
  return 'KILL'
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ payload: ChartDataPoint }>
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="font-medium text-white truncate max-w-40">{d.name}</p>
      <p className="text-gray-400 mt-0.5">
        PMF Score: <span className="font-bold" style={{ color: d.fill }}>{d.score}%</span>
      </p>
      <p className="text-gray-400">
        Verdict: <span className="font-medium" style={{ color: d.fill }}>{d.verdict}</span>
      </p>
    </div>
  )
}

export function PMFChart({ dashboard }: PMFChartProps) {
  // Collect scored products from top_graduates + recent_kills for the chart
  const chartData: ChartDataPoint[] = []

  if (dashboard?.top_graduates) {
    for (const g of dashboard.top_graduates) {
      chartData.push({
        name: g.product_name,
        score: g.pmf_score,
        verdict: getVerdict(g.pmf_score),
        fill: getVerdictColor(g.pmf_score),
      })
    }
  }

  if (dashboard?.recent_kills) {
    for (const k of dashboard.recent_kills) {
      if (k.pmf_score !== null) {
        chartData.push({
          name: k.product_name,
          score: k.pmf_score,
          verdict: 'KILL',
          fill: '#ef4444',
        })
      }
    }
  }

  // Sort by score descending, cap at 10 for readability
  const displayData = chartData
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)

  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
          PMF Score Distribution
        </h2>
        <span className="text-xs text-gray-600">Sean Ellis Q1 — Very Disappointed %</span>
      </div>

      {displayData.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-gray-600 text-sm">No scored products yet</p>
          <p className="text-gray-700 text-xs mt-1">Scores appear after validation cycles complete</p>
        </div>
      ) : (
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={displayData}
              margin={{ top: 4, right: 8, left: -12, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: '#6b7280', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                interval={0}
                tickFormatter={(v: string) => v.length > 10 ? v.slice(0, 10) + '…' : v}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: '#6b7280', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `${v}%`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              {/* SEPE GRADUATE threshold — 55% */}
              <ReferenceLine
                y={55}
                stroke="#22c55e"
                strokeDasharray="4 4"
                label={{ value: 'GRADUATE 55%', fill: '#22c55e', fontSize: 10, position: 'insideTopRight' }}
              />
              {/* ITERATE threshold — 40% (Sean Ellis original) */}
              <ReferenceLine
                y={40}
                stroke="#3b82f6"
                strokeDasharray="4 4"
                label={{ value: 'Sean Ellis 40%', fill: '#3b82f6', fontSize: 10, position: 'insideTopRight' }}
              />
              <Bar dataKey="score" radius={[3, 3, 0, 0]}>
                {displayData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <p className="text-xs text-gray-600">
        Blue dashed line = Sean Ellis original benchmark (40%). Green dashed = SEPE GRADUATE threshold (55%).
      </p>
    </div>
  )
}
