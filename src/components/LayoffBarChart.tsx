// src/components/LayoffBarChart.jsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useLayoffData } from '../hooks/useLayoffData'

const LayoffBarChart = () => {
  const data = useLayoffData()

  // Filter top 10 companies by layoffs
  const top10 = [...data]
    .sort((a, b) => b.laidOff - a.laidOff)  // Sort by 'laidOff' in descending order
    .slice(0, 10)  // Take the top 10 companies

  if (top10.length === 0) return <div>Loading chart...</div>  // Display loading message if data is empty

  return (
    <div style={{ width: 700, height: 400 }}>
      <h2 style={{ marginBottom: '1rem' }}>Top 10 Companies by Layoffs</h2>
      <ResponsiveContainer>
        <BarChart data={top10} layout="vertical" margin={{ top: 10, right: 30, left: 80, bottom: 10 }}>
          <XAxis type="number" />
          <YAxis type="category" dataKey="company" />
          <Tooltip />
          <Bar dataKey="laidOff" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default LayoffBarChart
