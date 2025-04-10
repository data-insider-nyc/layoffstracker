import React, { Suspense } from 'react'
import LayoffTable from './components/LayoffTable'
import { useLayoffData } from './hooks/useLayoffData'

// Lazy load components
const LayoffTop10Chart = React.lazy(() => import('./components/LayoffTop10Chart'))
const LayoffMonthlyTimeSeries = React.lazy(() => import('./components/LayoffMonthlyTimeSeries'))

function App() {
  const data = useLayoffData() // Fetch the data

  if (data.length === 0) {
    return <div>Loading...</div> // Handle loading state
  }

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      {/* Navbar */}
      <nav style={{
        backgroundColor: '#333',
        color: '#fff',
        padding: '1rem',
        textAlign: 'center',
        fontSize: '1.5rem'
      }}>
        Trendboard
      </nav>

      {/* Main Content */}
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        {/* Layoff Table with 100% width */}
        <div style={{ width: '80%' }}>
          <LayoffTable />
        </div>

        {/* Grid layout for BarChart and LineChart */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '2rem' }}>
          {/* First grid item for LayoffTop10Chart */}
          <div style={{ gridColumn: '1 / 2' }}>
            <Suspense fallback={<div>Loading Bar Chart...</div>}>
              <LayoffTop10Chart data={data} />
            </Suspense>
          </div>

          {/* Second grid item for LayoffMonthlyTimeSeries */}
          <div style={{ gridColumn: '2 / 4' }}>
            <Suspense fallback={<div>Loading Time Series...</div>}>
              <LayoffMonthlyTimeSeries rawData={data} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
