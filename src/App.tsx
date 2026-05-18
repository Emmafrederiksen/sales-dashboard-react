import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'

import Sidebar from './components/layout/Sidebar'
import MobileHeader from './components/layout/MobileHeader'
import KPICards from './components/dashboard/KPICards'
import FilterBar, { type Period } from './components/dashboard/FilterBar'
import RevenueChart from './components/dashboard/RevenueChart'
import CategoryList from './components/dashboard/CategoryList'
import OrdersTable from './components/dashboard/OrdersTable'


// Placeholder sider
function Dashboard() {
  const [period, setPeriod] = useState<Period>('month')

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
        <div>
          <h1 className="text-xl font-medium text-gray-900">
            Dashboard
          </h1>

          <p className="text-xs text-gray-400 mt-0.5">
            Opdateret i dag
          </p>
        </div>

        <FilterBar
          period={period}
          setPeriod={setPeriod}
        />
      </div>

      <KPICards period={period} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div>
          <CategoryList />
        </div>
      </div>
      <OrdersTable />
    </div>
  )
}

function NotFound() {
  return <h1 className='text-xl font-medium text-gray-400'>Siden findes ikke endnu</h1>
}

function App() {
  return (
    <BrowserRouter>
      <div className='flex min-h-screen'>
        <Sidebar />

        <div className='flex-1 flex flex-col min-w-0'>
          <MobileHeader />

          <main className='flex-1 p-4 lg:p-6'>
            <Routes>
              <Route path='/' element={<Dashboard />} />
              <Route path='*' element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App