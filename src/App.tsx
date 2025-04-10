// src/App.jsx
import LayoffTable from './components/LayoffTable'
import LayoffBarChart from './components/LayoffBarChart'

function App() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>📊 Trendboard</h1>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '90%' }}>
          <LayoffTable />
          <LayoffBarChart />
        </div>
      </div>
    </div>
  )
}

export default App
