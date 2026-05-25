export interface Order {
  id: number
  amount: number
  status: string
  created_at: string

  customers: {
    name: string
  }[] | null

  products: {
    name: string
  }[] | null
}