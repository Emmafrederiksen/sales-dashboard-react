import express from 'express'
import { getCategories } from '../services/categoryService'

const router = express.Router()

router.get('/', async (req, res) => {
    const categories = await getCategories()

    res.json(categories)
})

export default router