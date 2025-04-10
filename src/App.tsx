import React, { Suspense } from 'react'
import LayoffTable from './components/LayoffTable'
import { useLayoffData } from './hooks/useLayoffData'

// Lazy load components
const Top10LayoffsBarChart = React.lazy(() => import('./components/Top10LayoffsBarChart'))
const MonthlyTimeSeries = React.lazy(() => import('./components/MonthlyTimeSeries'))

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
          {/* First grid item for Top10LayoffsBarChart */}
          <div style={{ gridColumn: '1 / 2' }}>
            <Suspense fallback={<div>Loading Bar Chart...</div>}>
              <Top10LayoffsBarChart data={data} />
            </Suspense>
          </div>

          {/* Second grid item for MonthlyTimeSeries */}
          <div style={{ gridColumn: '2 / 4' }}>
            <Suspense fallback={<div>Loading Time Series...</div>}>
              <MonthlyTimeSeries rawData={data} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
