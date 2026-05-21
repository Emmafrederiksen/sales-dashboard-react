import React from 'react'
import Sidebar from './components/layout/shared/Sidebar'
import OrdersSearch from './components/dashboard/OrdersSearch'
import type { Order } from '../server/types/order'

interface KPIData {
  totalRevenue: number
  totalOrders: number
  uniqueCustomers: number
  avgOrderValue: number
  changes: {
    revenue: { value: string; positive: boolean }
    orders: { value: string; positive: boolean }
    customers: { value: string; positive: boolean }
    avgOrder: { value: string; positive: boolean }
  }
}

interface AppSSRProps {
  orders: Order[]
  kpiData: KPIData
}

const accentColors = [
  'bg-primary-light',
  'bg-kpi-green',
  'bg-kpi-amber',
  'bg-kpi-blue',
]

export default function AppSSR({ orders, kpiData }: AppSSRProps) {


  console.log('AppSSR renderer!')
  console.log('KPI data:', kpiData)


  const cards = [
    {
      label: 'Omsætning',
      value: `${kpiData.totalRevenue.toLocaleString('da-DK')} kr`,
      change: kpiData.changes.revenue.value,
      positive: kpiData.changes.revenue.positive,
      featured: true,
    },
    {
      label: 'Ordrer',
      value: kpiData.totalOrders.toString(),
      change: kpiData.changes.orders.value,
      positive: kpiData.changes.orders.positive,
      featured: false,
    },
    {
      label: 'Kunder',
      value: kpiData.uniqueCustomers.toString(),
      change: kpiData.changes.customers.value,
      positive: kpiData.changes.customers.positive,
      featured: false,
    },
    {
      label: 'Gns. ordreværdi',
      value: `${Math.round(kpiData.avgOrderValue).toLocaleString('da-DK')} kr`,
      change: kpiData.changes.avgOrder.value,
      positive: kpiData.changes.avgOrder.positive,
      featured: false,
    },
  ]

  return (
    <div className="flex min-h-screen">

      {/* Sidebar – SSR */}
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 lg:p-6">

          {/* Topbar */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-medium text-gray-900">Dashboard</h1>
              <p className="text-xs text-gray-400 mt-0.5">Opdateret i dag</p>
            </div>
          </div>

          {/* KPI Kort – SSR */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {cards.map((card, index) => (
              <div
                key={card.label}
                className={`rounded-xl border p-4 relative overflow-hidden ${
                  card.featured ? 'bg-sidebar border-sidebar' : 'bg-white border-gray-100'
                }`}
              >
                <div className={`absolute top-0 left-0 right-0 h-0.5 ${accentColors[index]}`} />
                <p className="text-kpi-label uppercase tracking-wider mb-2 text-gray-400">
                  {card.label}
                </p>
                <p className={`text-kpi-value font-medium ${card.featured ? 'text-white' : 'text-gray-900'}`}>
                  {card.value}
                </p>
                <p className={`text-xs mt-1 ${card.positive ? 'text-kpi-green' : 'text-kpi-red'}`}>
                  {card.change} vs. sidste periode
                </p>
              </div>
            ))}
          </div>

          {/* Ordretabel – SSR */}
          <OrdersSearch orders={orders} />

        </main>
      </div>
    </div>
  )
}