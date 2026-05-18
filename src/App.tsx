import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'

import Sidebar from './components/server/Sidebar'
import MobileHeader from './components/client/MobileHeader'
import KPICards from './components/client/KPICards'
import FilterBar, { type Period } from './components/client/FilterBar'
import RevenueChart from './components/client/RevenueChart'
import CategoryList from './components/client/CategoryList'
import OrdersTable from './components/client/OrdersTable'


// Placeholder sider
function Dashboard() {
  const [period, setPeriod] = useState<Period>('month')

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-medium text-gray-900">
            Dashboard
          </h1>

          <p className="text-sm text-gray-400">
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
      <MobileHeader />
      <div className='flex min-h-screen'>
        <Sidebar />
        <main className='flex-1 p-4 lg:p-6'>
          <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App