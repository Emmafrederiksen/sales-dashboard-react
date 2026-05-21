import React from 'react'
import { useEffect, useState } from 'react'

import type { KPIData } from '../../../server/types/kpi'
import type { Period } from '../../../server/types/period'

interface KPICardProps {
  period: Period
}

export default function KPICards({
  period,
}: KPICardProps) {

  const [data, setData] = useState<KPIData | null>(null)

  const [loading, setLoading] = useState(true)

  useEffect(() => {

    async function fetchKpis() {

      setLoading(true)

      const response = await fetch(
        `/api/kpis?period=${period}`
      )

      const result = await response.json()

      setData(result)

      setLoading(false)
    }

    fetchKpis()

  }, [period])

  // Loading skeleton
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">

        {[...Array(4)].map((_, i) => (

          <div key={i} className="rounded-xl border border-gray-100 p-4 bg-white animate-pulse">

            <div className="h-3 bg-gray-100 rounded w-1/2 mb-3" />

            <div className="h-6 bg-gray-100 rounded w-3/4 mb-2" />

            <div className="h-3 bg-gray-100 rounded w-1/3" />

          </div>
        ))}

      </div>
    )
  }

  if (!data) return null

  const accentColors = [
    'bg-primary-light',
    'bg-kpi-green',
    'bg-kpi-amber',
    'bg-kpi-blue',
  ]

  const cards = [

    {
      label: 'Omsætning',
      value: `${data.totalRevenue.toLocaleString('da-DK')} kr`,
      change: data.changes.revenue.value,
      positive: data.changes.revenue.positive,
      featured: true,
    },

    {
      label: 'Ordrer',
      value: data.totalOrders.toString(),
      change: data.changes.orders.value,
      positive: data.changes.orders.positive,
      featured: false,
    },

    {
      label: 'Kunder',
      value: data.uniqueCustomers.toString(),
      change: data.changes.customers.value,
      positive: data.changes.customers.positive,
      featured: false,
    },

    {
      label: 'Gns. ordreværdi',
      value: `${Math.round(data.avgOrderValue).toLocaleString('da-DK')} kr`,
      change: data.changes.avgOrder.value,
      positive: data.changes.avgOrder.positive,
      featured: false,
    },
  ]

  return (

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">

      {cards.map((card, index) => (

        <div key={card.label} className={`rounded-xl border p-4 relative overflow-hidden ${card.featured ? 'bg-sidebar border-sidebar' : 'bg-white border-gray-100'}`}>

          {/* Accent line */}
          <div className={`absolute top-0 left-0 right-0 h-0.5 ${accentColors[index]}`} />

          {/* Label */}
          <p className="text-kpi-label uppercase tracking-wider mb-2 text-gray-400">{card.label} </p>

          {/* Value */}
          <p className={`text-kpi-value font-medium ${card.featured ? 'text-white' : 'text-gray-900'}`}>
            {card.value}
          </p>

          {/* Change */}
          <p className={`text-xs mt-1 ${card.positive ? 'text-kpi-green' : 'text-kpi-red'}`}>
            {card.change} vs. sidste periode
          </p>

        </div>
      ))}

    </div>
  )
}