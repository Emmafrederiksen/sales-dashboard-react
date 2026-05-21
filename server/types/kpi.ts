export interface KPIData {
  totalRevenue: number
  totalOrders: number
  uniqueCustomers: number
  avgOrderValue: number

  changes: {
    revenue: {
      value: string
      positive: boolean
    }

    orders: {
      value: string
      positive: boolean
    }

    customers: {
      value: string
      positive: boolean
    }

    avgOrder: {
      value: string
      positive: boolean
    }
  }
}