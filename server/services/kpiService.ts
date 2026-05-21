import { supabase } from '../lib/supabase'
import type { Period } from '../types/period'

function getDateRange(period: Period) {
  const now = new Date()

  switch (period) {
    case 'week':
      return {
        current: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).toISOString(),
        previous: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 14).toISOString(),
        previousEnd: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).toISOString(),
      }
    case 'month':
      return {
        current: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
        previous: new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString(),
        previousEnd: new Date(now.getFullYear(), now.getMonth(), 0).toISOString(),
      }
    case 'quarter':
      return {
        current: new Date(now.getFullYear(), now.getMonth() - 3, 1).toISOString(),
        previous: new Date(now.getFullYear(), now.getMonth() - 6, 1).toISOString(),
        previousEnd: new Date(now.getFullYear(), now.getMonth() - 3, 0).toISOString(),
      }
    case 'year':
      return {
        current: new Date(now.getFullYear(), 0, 1).toISOString(),
        previous: new Date(now.getFullYear() - 1, 0, 1).toISOString(),
        previousEnd: new Date(now.getFullYear(), 0, 0).toISOString(),
      }
  }
}

export async function getKpiData(period: Period = 'month') {
  const range = getDateRange(period)

  const { data: currentOrders } = await supabase
    .from('orders')
    .select('amount, customer_id')
    .gte('created_at', range.current)

  const { data: lastOrders } = await supabase
    .from('orders')
    .select('amount, customer_id')
    .gte('created_at', range.previous)
    .lte('created_at', range.previousEnd)

  const totalRevenue = currentOrders?.reduce((sum, o) => sum + o.amount, 0) || 0
  const totalOrders = currentOrders?.length || 0
  const uniqueCustomers = new Set(currentOrders?.map(o => o.customer_id)).size
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  const lastRevenue = lastOrders?.reduce((sum, o) => sum + o.amount, 0) || 0
  const lastTotalOrders = lastOrders?.length || 0
  const lastCustomers = new Set(lastOrders?.map(o => o.customer_id)).size
  const lastAvg = lastTotalOrders > 0 ? lastRevenue / lastTotalOrders : 0

  const calcChange = (current: number, last: number) => {
    if (last === 0) return '+0%'
    const change = ((current - last) / last) * 100
    return `${change >= 0 ? '+' : ''}${Math.round(change)}%`
  }

  const isPositive = (current: number, last: number) => current >= last

  return {
    totalRevenue,
    totalOrders,
    uniqueCustomers,
    avgOrderValue,
    changes: {
      revenue: { value: calcChange(totalRevenue, lastRevenue), positive: isPositive(totalRevenue, lastRevenue) },
      orders: { value: calcChange(totalOrders, lastTotalOrders), positive: isPositive(totalOrders, lastTotalOrders) },
      customers: { value: calcChange(uniqueCustomers, lastCustomers), positive: isPositive(uniqueCustomers, lastCustomers) },
      avgOrder: { value: calcChange(avgOrderValue, lastAvg), positive: isPositive(avgOrderValue, lastAvg) },
    }
  }
}