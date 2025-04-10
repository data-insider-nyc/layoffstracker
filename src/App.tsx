import LayoffTable from './components/LayoffTable'
import Top10LayoffsBarChart from './components/Top10LayoffsBarChart'
import MonthlyTimeSeries from './components/MonthlyTimeSeries'
import { useLayoffData } from './hooks/useLayoffData'

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
            <Top10LayoffsBarChart />
          </div>

          {/* Second grid item for MonthlyTimeSeries */}
          <div style={{ gridColumn: '2 / 4' }}>
            <MonthlyTimeSeries rawData={data} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
