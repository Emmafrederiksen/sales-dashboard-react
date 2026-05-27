import React from 'react'
import express from 'express'
import { renderToString } from 'react-dom/server'
import path from 'path'
import fs from 'fs'
import AppSSR from '../src/AppSSR'
import ordersRouter from './routes/orders'
import kpisRouter from './routes/kpis'
import categoriesRouter from './routes/categories'
import revenoueRouter from './routes/revenue'

// Services
import { getOrders } from './services/orderService'
import { getKpiData } from './services/kpiService'
import { getCategories } from './services/categoryService'
import { getRevenueData } from './services/revenueService'

const app = express()
const PORT = 3000

// API routes
app.use('/api/orders', ordersRouter)
app.use('/api/kpis', kpisRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/revenue', revenoueRouter)

app.get('/', async (req, res) => {

  // Hent data via services
  const orders = await getOrders()
  const kpiData = await getKpiData()
  const categories = await getCategories()
  const revenueData = await getRevenueData()

  // SSR render
  const html = renderToString(
    <AppSSR
      orders={orders}
      kpiData={kpiData}
      categories={categories}
      revenueData={revenueData}
    />
  )

  // HTML template
  const template = fs.readFileSync(
    path.resolve('./dist/client/index.html'),
    'utf8'
  )

  // Inject React HTML og initial data
  const result = template.replace(
    '<div id="root"></div>',
    `<div id="root">${html}</div>
    <script>
      window.__INITIAL_DATA__ = ${JSON.stringify({
        orders,
        kpiData,
        categories,
        revenueData
      })}
    </script>`
  )
  res.send(result)
})

// Static files
app.use(express.static( path.resolve('./dist/client')))

app.listen(PORT, () => {
  console.log(
    `SSR server kører på http://localhost:${PORT}`
  )
})