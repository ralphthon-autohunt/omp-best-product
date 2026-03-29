'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import type { ValidationResult } from '@/lib/types'

interface Q1ChartProps {
  validationResult?: ValidationResult | null
}

const Q1_COLORS = {
  very_disappointed: '#22c55e',
  somewhat_disappointed: '#f59e0b',
  not_disappointed: '#ef4444',
  not_applicable: '#6b7280',
}

const Q1_LABELS = {
  very_disappointed: 'Very Disappointed',
  somewhat_disappointed: 'Somewhat Disappointed',
  not_disappointed: 'Not Disappointed',
  not_applicable: 'Not Applicable',
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ value: number; name: string }>
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-gray-400">{label}</p>
      <p className="text-white font-medium">{payload[0].value}% of respondents</p>
    </div>
  )
}

export function Q1Chart({ validationResult }: Q1ChartProps) {
  if (!validationResult) {
    return (
      <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
          Q1: How disappointed if product went away?
        </h2>
        <div className="py-10 text-center">
          <p className="text-gray-600 text-sm">No validation data available</p>
        </div>
      </div>
    )
  }

  const dist = validationResult.q1_distribution
  const total = dist.very_disappointed + dist.somewhat_disappointed + dist.not_disappointed + dist.not_applicable

  const chartData = Object.entries(dist).map(([key, count]) => ({
    name: Q1_LABELS[key as keyof typeof Q1_LABELS] ?? key,
    value: total > 0 ? Math.round((count / total) * 100) : 0,
    count,
    color: Q1_COLORS[key as keyof typeof Q1_COLORS] ?? '#6b7280',
  }))

  const veryDisappointedPct = total > 0 ? Math.round((dist.very_disappointed / (total - dist.not_applicable)) * 100) : 0

  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
          Q1: Disappointment Test
        </h2>
        <div className="text-right">
          <span className="text-2xl font-bold text-green-400">{veryDisappointedPct}%</span>
          <p className="text-xs text-gray-500">very disappointed</p>
        </div>
      </div>

      <p className="text-xs text-gray-500 italic">
        &ldquo;How would you feel if you could no longer use this product?&rdquo;
      </p>

      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 4, right: 8, left: -12, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: '#6b7280', fontSize: 9 }}
              axisLine={false}
              tickLine={false}
              interval={0}
              tickFormatter={(v: string) => v.split(' ')[0]}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: '#6b7280', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `${v}%`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar dataKey="value" radius={[3, 3, 0, 0]}>
              {chartData.map((entry, idx) => (
                <Cell key={idx} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-gray-600">
        n={total} respondents | Sean Ellis benchmark: 40%+ very disappointed = PMF signal
      </p>
    </div>
  )
}
