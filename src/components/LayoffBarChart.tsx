import { useLayoffData } from '../hooks/useLayoffData'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts'

const LayoffBarChart = () => {
  const data = useLayoffData()

  // Define the type of the data for better type safety
  type LayoffData = {
    company: string;
    laidOff: number;
  }

  // Step 1: Aggregate layoffs by company name
  const aggregatedData = data.reduce<{ [key: string]: LayoffData }>((acc, row) => {
    const company = row.company;
    const layoffs = Number(row.laidOff); // Ensure 'laidOff' is treated as a number

    // If the company is already in the accumulator, add the layoffs to the existing value
    if (acc[company]) {
      acc[company].laidOff += layoffs;
    } else {
      // If the company is not in the accumulator, add it with the initial layoffs
      acc[company] = { company, laidOff: layoffs };
    }
    return acc;
  }, {})

  // Step 2: Convert the aggregated data back to an array
  const aggregatedArray = Object.values(aggregatedData);

  // Step 3: Sort by layoffs and get top 10
  const top10 = [...aggregatedArray]
    .sort((a, b) => b.laidOff - a.laidOff)  // Sort by 'laidOff' in descending order
    .slice(0, 10);  // Take the top 10 companies

  if (top10.length === 0) return <div>Loading chart...</div>  // Display loading message if data is empty

  return (
    <div style={{ width: '100%', height: 500 }}>
      <h2 style={{ marginBottom: '1rem' }}>Top 10 Companies by Layoffs (2020 - Present)</h2>
      <p>Data from 2020 to the present showing the number of layoffs across various companies.</p>
      <ResponsiveContainer>
        <BarChart data={top10} layout="vertical" margin={{ top: 10, right: 50, left: 80, bottom: 10 }}>
          <XAxis type="number" />
          <YAxis type="category" dataKey="company" />
          <Tooltip />
          <Bar dataKey="laidOff" fill="#8884d8">
            {/* LabelList to display number with comma formatting */}
            <LabelList
              dataKey="laidOff"
              position="right" // Position the label outside the bar to avoid cutting off
              formatter={(value: number) => value.toLocaleString()}  // Ensure 'value' is a number
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default LayoffBarChart
