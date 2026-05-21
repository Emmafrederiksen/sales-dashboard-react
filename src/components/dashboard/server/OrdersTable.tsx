import React from 'react'
import OrdersSearch from '../client/OrdersSearch'

import type { Order }
from '../../../../server/types/order'

interface OrdersTableProps {
  orders?: Order[]
}

export default function OrdersTable({
  orders = [],
}: OrdersTableProps) {

  return (

    <OrdersSearch
      orders={orders}
    />

  )
}