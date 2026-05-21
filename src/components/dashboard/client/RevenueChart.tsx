import React from 'react'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,} from 'recharts'

import type { RevenueData }
from '../../../../server/types/revenue'

interface RevenueChartProps {
  revenueData: RevenueData[]
}

export default function RevenueChart({ revenueData }: RevenueChartProps) {

  return (

    <div className="bg-white rounded-xl border border-gray-100 p-4 h-full">

      {/* Header */}
      <div className="mb-4">

        <h2 className="text-card-title text-gray-900">
          Omsætning over tid
        </h2>

        <p className="text-xs text-gray-400 mt-0.5">
          Månedlig omsætning
        </p>

      </div>

      {/* Graf */}
      <ResponsiveContainer width="100%" height={200}>

        <BarChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0, }} >

          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />

          <XAxis
            dataKey="month"
            tick={{
              fontSize: 10,
              fill: '#9CA3AF',
            }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{
              fontSize: 10,
              fill: '#9CA3AF',
            }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) =>
              `${(value / 1000).toFixed(0)}k`
            }
          />

          <Tooltip
            formatter={(value) => [
              `${Number(value).toLocaleString('da-DK')} kr`,
              'Omsætning',
            ]}

            contentStyle={{
              fontSize: '12px',
              borderRadius: '8px',
              border: '1px solid #F3F4F6',
              boxShadow:
                '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          />

          <Bar
            dataKey="revenue"
            fill="#26215C"
            radius={[4, 4, 0, 0]}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>
  )
}