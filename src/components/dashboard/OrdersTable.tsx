import React from 'react'
import { useEffect, useState } from 'react'
import OrdersSearch from './OrdersSearch'
import type { Order } from '../../../server/types/order'

export default function OrdersTable() {

  const [orders, setOrders] = useState<Order[]>([])

  const [loading, setLoading] = useState(true)

  useEffect(() => {

    async function fetchOrders() {

      const response = await fetch('/api/orders')
      const result = await response.json()

      console.log(result)

      setOrders(result)

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