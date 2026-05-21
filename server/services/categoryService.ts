import { supabase } from '../lib/supabase'

import type { Category }
from '../types/category'

export async function getCategories(): Promise<Category[]> {

  const { data, error } = await supabase
    .from('orders')
    .select(`
      amount,

      products (
        categories (
          name
        )
      )
    `)

  if (error) { 
    console.error('Fejl ved hentning af kategorier:', error)

    return []
  }

  // Grupper totals pr kategori
  const totals: Record<string, number> = {}

  data.forEach((order: any) => {

    const category =
      order.products?.categories?.name

    if (category) {

      totals[category] =
        (totals[category] || 0) + order.amount
    }
  })

  // Total omsætning
  const grandTotal =
    Object.values(totals).reduce(
      (sum, value) => sum + value,
      0
    )

  // Konverter til array
  const result: Category[] = Object
    .entries(totals)

    .map(([name, total]) => ({

      name,
      total,

      percentage: Math.round(
        (total / grandTotal) * 100
      ),
    }))

    .sort((a, b) => b.total - a.total)

  return result
}