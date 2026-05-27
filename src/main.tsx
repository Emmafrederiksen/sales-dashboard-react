import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App'

const initialData = (window as any).__INITIAL_DATA__ || {}

hydrateRoot(
  document.getElementById('root')!,
  <StrictMode>
    <App 
      orders={initialData.orders}
      kpiData={initialData.kpiData}
      categories={initialData.categories}
      revenueData={initialData.revenueData}
    />
  </StrictMode>
) 