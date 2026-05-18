import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

import OrdersSearch from './OrdersSearch'

interface Order {
  id: number
  amount: number
  status: string
  created_at: string
  customers: { name: string } | null
  products: { name: string } | null
}

export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          amount,
          status,
          created_at,
          customers (name),
          products (name)
        `)
        .order('id', { ascending: false })

      if (!error && data) {
        setOrders(data as unknown as Order[])
      }

      setLoading(false)
    }

    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-100 rounded w-1/3" />
          <div className="h-32 bg-gray-100 rounded" />
        </div>
      </div>
    )
  }

  return <OrdersSearch orders={orders} />
}