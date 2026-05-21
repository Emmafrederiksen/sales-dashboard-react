import React from 'react'
import App from './App'
import type { Order } from '../server/types/order'
import type { KPIData } from '../server/types/kpi'
import type { Category } from '../server/types/category'
import type { RevenueData } from '../server/types/revenue'

interface AppSSRProps {
  orders: Order[]
  kpiData: KPIData
  categories: Category[]
  revenueData: RevenueData[]
}

export default function AppSSR({ 
  orders, 
  kpiData,
  categories,
  revenueData,
  }: AppSSRProps) {

  return (
    <App 
    orders={orders} 
    kpiData={kpiData} 
    categories={categories}    
    revenueData={revenueData}
    />
  )

}