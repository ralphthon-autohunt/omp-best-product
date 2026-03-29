'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'
import type { ValidatorOverview } from '@/lib/validator-types'

interface ValidatorScoreChartProps {
  overview: ValidatorOverview
}

const PRODUCT_COLORS: Record<string, string> = {
  'prod-001': '#8b5cf6', // violet
  'prod-002': '#3b82f6', // blue
  'prod-003': '#06b6d4', // cyan
  'prod-004': '#10b981', // emerald
  'prod-005': '#f59e0b', // amber
}

const PRODUCT_NAMES: Record<string, string> = {
  'prod-001': 'FocusLens',
  'prod-002': 'LetterDrop',
  'prod-003': 'PulseLog',
  'prod-004': 'MoodLoop',
  'prod-005': 'PetRoute',
}

export function ValidatorScoreChart({ overview }: ValidatorScoreChartProps) {
  const productIds = Object.keys(overview.matrix)
  if (productIds.length === 0) {
    return (
      <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
          VD Ratio Progression
        </h2>
        <div className="py-12 text-center">
          <p className="text-gray-600 text-sm">아직 데이터가 없습니다</p>
        </div>
      </div>
    )
  }

  // Build chart data: one point per step
  const steps = ['v1', ...Array.from({ length: overview.current_step }, (_, i) => `step-${i + 1}`)]
  const stepLabels: Record<string, string> = {
    v1: 'v1 (현재)',
    'step-1': '1. VD=북극성',
    'step-2': '2. HXC 정의',
    'step-3': '3. SD 분리',
    'step-4': '4. 2-Track',
  }

  const chartData = steps.map(step => {
    const point: Record<string, any> = { step: stepLabels[step] || step }
    for (const prodId of productIds) {
      const val = overview.matrix[prodId]?.[step]
      if (val !== undefined) point[prodId] = val
    }
    return point
  })

  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
          VD Ratio Progression
        </h2>
        <span className="text-xs text-gray-600">
          Sean Ellis Q1 — Very Disappointed %
        </span>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis
            dataKey="step"
            tick={{ fill: '#6b7280', fontSize: 11 }}
            axisLine={{ stroke: '#374151' }}
          />
          <YAxis
            domain={[30, 80]}
            tick={{ fill: '#6b7280', fontSize: 11 }}
            axisLine={{ stroke: '#374151' }}
            tickFormatter={(v: number) => `${v}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#111827',
              border: '1px solid #374151',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            formatter={(value: number, name: string) => [
              `${value}%`,
              PRODUCT_NAMES[name] || name,
            ]}
          />
          <Legend
            formatter={(value: string) => PRODUCT_NAMES[value] || value}
            wrapperStyle={{ fontSize: '12px' }}
          />
          <ReferenceLine
            y={40}
            stroke="#22c55e"
            strokeDasharray="6 4"
            label={{ value: '40% PMF', fill: '#22c55e', fontSize: 10, position: 'right' }}
          />
          <ReferenceLine
            y={55}
            stroke="#6b7280"
            strokeDasharray="3 3"
            label={{ value: '55% v1', fill: '#4b5563', fontSize: 10, position: 'right' }}
          />
          {productIds.map(prodId => (
            <Line
              key={prodId}
              type="monotone"
              dataKey={prodId}
              stroke={PRODUCT_COLORS[prodId] || '#8b5cf6'}
              strokeWidth={2}
              dot={{ r: 4, fill: PRODUCT_COLORS[prodId] || '#8b5cf6' }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      <p className="text-xs text-gray-600">
        초록 점선 = Sean Ellis 원본 PMF 기준 (40%). 회색 점선 = SEPE v1 기준 (55%, deprecated).
      </p>
    </div>
  )
}
