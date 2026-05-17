import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/server/Sidebar'


// Placeholder sider
function Dashboard() {
  return <h1 className='text-xl font-medium text-gray-900'>Dashboard</h1>
}

function NotFound() {
  return <h1 className='text-xl font-medium text-gray-400'>Siden findes ikke endnu</h1>
}

function App() {
  return (
    <BrowserRouter>
      <div className='flex min-h-screen'>
        <Sidebar />
        <main className='flex-1 p-4 lg:p-6'>
          <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App