// src/components/LayoffLineChart.tsx
import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Sample props type for the data
type LayoffData = {
  date: string
  numberoflaidoffs: number
}

type LayoffLineChartProps = {
  data: LayoffData[]
}

const LayoffLineChart = ({ data }: LayoffLineChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="numberoflaidoffs" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default LayoffLineChart
