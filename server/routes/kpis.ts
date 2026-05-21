import express from 'express'
import { getKpiData } from '../services/kpiService'

const router = express.Router()

router.get('/', async (req, res) => {
    const data = await getKpiData()

    res.json(data)
})

export default router