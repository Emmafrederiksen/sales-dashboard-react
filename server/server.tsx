import express from 'express'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { supabase } from './lib/supabase'
import App from '../src/App'
import path from 'path'
import fs from 'fs'
import * as dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = 3001

// Server statiske filer fra dist/client
app.use(express.static(path.resolve(__dirname, '../dist/client')))

app.get('/', async (req, res) => {
  // Hent data fra Supabase på serveren
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
    .limit(8)

  // Renderer React til HTML på serveren
  const html = renderToString(
    React.createElement(App, { orders: orders || [] })
  )

  // Læs index.html template
  const template = fs.readFileSync(
    path.resolve('./public/index.html'),
    'utf8'
  )

  // Indsæt React HTML i templaten
  const result = template.replace(
    '<div id="root"></div>',
    `<div id="root">${html}</div>`
  )

  res.send(result)
})

app.listen(PORT, () => {
  console.log(`SSR server kører på http://localhost:${PORT}`)
})