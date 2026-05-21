import express from 'express'
import { getRevenueData } from '../services/revenueService'

const router = express.Router()

router.get('/', async (req, res) => {

    const revenueData = await getRevenueData()

    res.json(revenueData)
})

export default router