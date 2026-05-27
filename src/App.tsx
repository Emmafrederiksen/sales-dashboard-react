import React, { useState, useEffect } from 'react'

import Sidebar from './components/layout/server/Sidebar'
import MobileHeader from './components/layout/client/MobileHeader'
import KPICards from './components/dashboard/server/KPICards'
import FilterBar from './components/dashboard/client/FilterBar'
import RevenueChart from './components/dashboard/client/RevenueChart'
import CategoryList from './components/dashboard/server/CategoryList'
import OrdersTable from './components/dashboard/server/OrdersTable'

import type { Period } from '../server/types/period'
import type { Order } from '../server/types/order'
import type { KPIData } from '../server/types/kpi'
import type { Category } from '../server/types/category'
import type { RevenueData } from '../server/types/revenue'

interface AppProps {
  orders?: Order[]
  kpiData?: KPIData
  categories?: Category[]
  revenueData?: RevenueData[]
}

export default function App({
  orders = [],
  kpiData,
  categories = [],
  revenueData = [],
}: AppProps) {

  const [period, setPeriod] = useState<Period>('month')
  const [currentKpiData, setCurrentKpiData] = useState(kpiData)

  useEffect(() => {
  async function fetchKpis() {
    const response = await fetch(`/api/kpis?period=${period}`)
    const result = await response.json()
    setCurrentKpiData(result)
  }

  fetchKpis()
}, [period])

  return (
    <div className='flex min-h-screen'>
      <Sidebar />

      <div className='flex-1 flex flex-col min-w-0'>
        <MobileHeader />

        <main className='flex-1 p-4 lg:p-6'>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
            <div>
              <h1 className="text-xl font-medium text-gray-900">
                Dashboard
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Opdateret i dag
              </p>
            </div>
            <FilterBar period={period} setPeriod={setPeriod} />
          </div>

          {/* KPI kort – SSR initial data, CSR ved filterændring */}
          <KPICards kpiData={currentKpiData} />

          {/* Graf og kategori – CSR */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            <div className="lg:col-span-2">
              <RevenueChart revenueData={revenueData} />
            </div>
            <div>
              <CategoryList categories={categories || []} />
            </div>
          </div>

          {/* Ordretabel – SSR */}
          <OrdersTable orders={orders} />

        </main>
      </div>
    </div>
  )
}