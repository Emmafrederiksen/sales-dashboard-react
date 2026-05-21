import { supabase } from '../lib/supabase'

interface RevenueData {
  month: string
  revenue: number
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec']

export async function getRevenueData(): Promise<RevenueData[]> {

  const { data: orders, error } = await supabase
    .from('orders')
    .select('amount, created_at')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Fejl ved hentning af revenue:', error)
    return []
  }

  // Gruppér revenue pr måned
  const monthlyRevenue: Record<string, number> = {}

  orders.forEach((order) => {

    const date = new Date(order.created_at)

    const key = `${date.getFullYear()}-${date.getMonth()}`

    monthlyRevenue[key] =
      (monthlyRevenue[key] || 0) + order.amount
  })

  // Konverter object → chart array
  const result = Object.entries(monthlyRevenue).map(([key, total]) => {

    const [year, month] = key.split('-')

    return {
      month: `${MONTHS[parseInt(month)]} ${year.slice(2)}`,
      revenue: total,
    }
  })

  return result
}