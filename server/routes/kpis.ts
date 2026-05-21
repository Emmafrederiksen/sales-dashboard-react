import express from 'express'
import { getKpiData } from '../services/kpiService'
import type { Period } from '../types/period'

const router = express.Router()

router.get('/', async (req, res) => {
  const period = (req.query.period as Period) || 'month'
  const data = await getKpiData(period)
  res.json(data)
})

export default router