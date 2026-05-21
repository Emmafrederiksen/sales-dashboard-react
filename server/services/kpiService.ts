import { supabase } from '../lib/supabase'

export async function getKpiData() {

  const now = new Date()

  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  ).toISOString()

  const startOfLastMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1
  ).toISOString()

  const endOfLastMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    0
  ).toISOString()

  // Nuværende måned
  const { data: currentOrders } = await supabase
    .from('orders')
    .select('amount, customer_id')
    .gte('created_at', startOfMonth)

  // Sidste måned
  const { data: lastOrders } = await supabase
    .from('orders')
    .select('amount, customer_id')
    .gte('created_at', startOfLastMonth)
    .lte('created_at', endOfLastMonth)

  // Beregninger
  const totalRevenue =
    currentOrders?.reduce((sum, order) => sum + order.amount, 0) || 0

  const totalOrders =
    currentOrders?.length || 0

  const uniqueCustomers =
    new Set(currentOrders?.map(order => order.customer_id)).size

  const avgOrderValue =
    totalOrders > 0
      ? totalRevenue / totalOrders
      : 0

  // Sidste måned
  const lastRevenue =
    lastOrders?.reduce((sum, order) => sum + order.amount, 0) || 0

  const lastTotalOrders =
    lastOrders?.length || 0

  const lastCustomers =
    new Set(lastOrders?.map(order => order.customer_id)).size

  const lastAvg =
    lastTotalOrders > 0
      ? lastRevenue / lastTotalOrders
      : 0

  // Hjælpefunktion
  const calcChange = (current: number, last: number) => {
    if (last === 0) return '+0%'

    const change = ((current - last) / last) * 100

    return `${change >= 0 ? '+' : ''}${Math.round(change)}%`
  }

  const isPositive = (current: number, last: number) => {
    return current >= last
  }

  return {
    totalRevenue,
    totalOrders,
    uniqueCustomers,
    avgOrderValue,

    changes: {
      revenue: {
        value: calcChange(totalRevenue, lastRevenue),
        positive: isPositive(totalRevenue, lastRevenue),
      },

      orders: {
        value: calcChange(totalOrders, lastTotalOrders),
        positive: isPositive(totalOrders, lastTotalOrders),
      },

      customers: {
        value: calcChange(uniqueCustomers, lastCustomers),
        positive: isPositive(uniqueCustomers, lastCustomers),
      },

      avgOrder: {
        value: calcChange(avgOrderValue, lastAvg),
        positive: isPositive(avgOrderValue, lastAvg),
      },
    },
  }
}