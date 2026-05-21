import express from 'express'
import { getOrders } from '../services/orderService'

const router = express.Router()

router.get('/', async (req, res) => {
    const orders = await getOrders()

    res.json(orders)
})

export default router