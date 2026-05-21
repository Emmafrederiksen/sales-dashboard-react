import React from 'react'

import type { KPIData }
from '../../../../server/types/kpi'

interface KPICardProps {
  kpiData?: KPIData
}

export default function KPICards({
  kpiData,
}: KPICardProps) {

  if (!kpiData) return null

  const accentColors = [
    'bg-primary-light',
    'bg-kpi-green',
    'bg-kpi-amber',
    'bg-kpi-blue',
  ]

  const cards = [

    {
      label: 'Omsætning',

      value:
        `${kpiData.totalRevenue.toLocaleString('da-DK')} kr`,

      change:
        kpiData.changes.revenue.value,

      positive:
        kpiData.changes.revenue.positive,

      featured: true,
    },

    {
      label: 'Ordrer',

      value:
        kpiData.totalOrders.toString(),

      change:
        kpiData.changes.orders.value,

      positive:
        kpiData.changes.orders.positive,

      featured: false,
    },

    {
      label: 'Kunder',

      value:
        kpiData.uniqueCustomers.toString(),

      change:
        kpiData.changes.customers.value,

      positive:
        kpiData.changes.customers.positive,

      featured: false,
    },

    {
      label: 'Gns. ordreværdi',

      value:
        `${Math.round(kpiData.avgOrderValue).toLocaleString('da-DK')} kr`,

      change:
        kpiData.changes.avgOrder.value,

      positive:
        kpiData.changes.avgOrder.positive,

      featured: false,
    },
  ]

  return (

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">

      {cards.map((card, index) => (

        <div
          key={card.label}
          className={`rounded-xl border p-4 relative overflow-hidden ${
            card.featured
              ? 'bg-sidebar border-sidebar'
              : 'bg-white border-gray-100'
          }`}
        >

          <div
            className={`absolute top-0 left-0 right-0 h-0.5 ${accentColors[index]}`}
          />

          <p className="text-kpi-label uppercase tracking-wider mb-2 text-gray-400">
            {card.label}
          </p>

          <p
            className={`text-kpi-value font-medium ${
              card.featured
                ? 'text-white'
                : 'text-gray-900'
            }`}
          >
            {card.value}
          </p>

          <p
            className={`text-xs mt-1 ${
              card.positive
                ? 'text-kpi-green'
                : 'text-kpi-red'
            }`}
          >
            {card.change} vs. sidste periode
          </p>

        </div>

      ))}

    </div>
  )
}