import React from 'react'
import express from 'express'
import { renderToString } from 'react-dom/server'
import { supabase } from './lib/supabase'
import path from 'path'
import fs from 'fs'
import { StaticRouter } from 'react-router-dom'

import AppSSR from '../src/AppSSR'

import type { Order } from './types/order'

import ordersRouter from './routes/orders'
import kpisRouter from './routes/kpis'
import categoriesRouter from './routes/categories' 
import revenoueRouter from './routes/revenue'

const app = express()
const PORT = 3000

// API route for orders
app.use('/api/orders', ordersRouter)
app.use('/api/kpis', kpisRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/revenue', revenoueRouter)


app.get('/', async (req, res) => {
  
  // Hent ordrer på serveren
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      id,
      amount,
      status,
      created_at,
      customers (name),
      products (name)
    `)
    .order('id', { ascending: false })
    .limit(20)

  // Hent KPI data på serveren
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).toISOString()

  const { data: currentOrders } = await supabase
    .from('orders')
    .select('amount, customer_id')
    .gte('created_at', startOfMonth)

  const { data: lastOrders } = await supabase
    .from('orders')
    .select('amount, customer_id')
    .gte('created_at', startOfLastMonth)
    .lte('created_at', endOfLastMonth)

  const totalRevenue = currentOrders?.reduce((sum, o) => sum + o.amount, 0) || 0
  const totalOrders = currentOrders?.length || 0
  const uniqueCustomers = new Set(currentOrders?.map(o => o.customer_id)).size
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  const lastRevenue = lastOrders?.reduce((sum, o) => sum + o.amount, 0) || 0
  const lastTotalOrders = lastOrders?.length || 0
  const lastCustomers = new Set(lastOrders?.map(o => o.customer_id)).size
  const lastAvg = lastTotalOrders > 0 ? lastRevenue / lastTotalOrders : 0

  const calcChange = (current: number, last: number) => {
    if (last === 0) return '+0%'
    const change = ((current - last) / last) * 100
    return `${change >= 0 ? '+' : ''}${Math.round(change)}%`
  }

  const isPositive = (current: number, last: number) => current >= last

  const kpiData = {
    totalRevenue,
    totalOrders,
    uniqueCustomers,
    avgOrderValue,
    changes: {
      revenue: { value: calcChange(totalRevenue, lastRevenue), positive: isPositive(totalRevenue, lastRevenue) },
      orders: { value: calcChange(totalOrders, lastTotalOrders), positive: isPositive(totalOrders, lastTotalOrders) },
      customers: { value: calcChange(uniqueCustomers, lastCustomers), positive: isPositive(uniqueCustomers, lastCustomers) },
      avgOrder: { value: calcChange(avgOrderValue, lastAvg), positive: isPositive(avgOrderValue, lastAvg) },
    }
  }

  // Renderer React til HTML på serveren
  console.log('Renderer AppSSR...')
  const html = renderToString(
    <StaticRouter location={req.url}>
      <AppSSR 
        orders={(orders as Order[]) || []}
        kpiData={kpiData}
      />
    </StaticRouter>
  )

console.log('HTML genereret, længde:', html.length)



  console.log('AppSSR HTML:', html.substring(0, 500))

  // Læs den byggede index.html fra dist/client
  const template = fs.readFileSync(
    path.resolve('./dist/client/index.html'),
    'utf8'
  )

  // Indsæt React HTML i templaten
  const result = template.replace(
    '<div id="root"></div>',
    `<div id="root">${html}</div>`
  )

  res.send(result)
})

// Server statiske filer fra dist/client
app.use(express.static(path.resolve('./dist/client')))

app.listen(PORT, () => {
  console.log(`SSR server kører på http://localhost:${PORT}`)
})