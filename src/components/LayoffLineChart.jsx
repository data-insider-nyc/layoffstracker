// src/components/LayoffLineChart.jsx
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useLayoffData } from '../hooks/useLayoffData'

const LayoffLineChart = () => {
  const data = useLayoffData()

  // Filter data by date and aggregate layoffs per date
  const aggregateData = data.reduce((acc, row) => {
    const date = row.date
    if (!acc[date]) {
      acc[date] = { date, laidOff: 0 }
    }
    acc[date].laidOff += row.laidOff
    return acc
  }, {})

  // Convert aggregated data into an array for rendering
  const aggregatedData = Object.values(aggregateData)

  if (aggregatedData.length === 0) return <div>Loading chart...</div>  // Display loading message if data is empty

  return (
    <div style={{ width: '100%', height: 400 }}>
      <h2 style={{ marginBottom: '1rem' }}>Layoffs Over Time</h2>
      <ResponsiveContainer>
        <LineChart data={aggregatedData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="laidOff" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default LayoffLineChart
