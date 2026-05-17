import './App.css'
import Sidebar from './components/server/Sidebar'

function App() {
  return (
    <div className='flex min-h-screen'>
      <Sidebar />

      <main className='flex-1 p-4 lg:p-6'>
        <h1 className='text-xl font-medium text-gray-900'>Sales Dashboard</h1>
      </main>
    </div>
  )
}

export default App