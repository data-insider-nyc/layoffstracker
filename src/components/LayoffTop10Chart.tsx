import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

type LayoffTop10ChartProps = {
  data: Array<{
    company: string;
    headquarters?: string;
    laidOff: number;
    date: Date;
  }>;
};

const LayoffTop10Chart: React.FC<LayoffTop10ChartProps> = ({ data }) => {
  // Aggregate data by company
  const aggregatedData = React.useMemo(() => {
    const companyData: { [key: string]: number } = {};

    data.forEach(({ company, laidOff }) => {
      companyData[company] = (companyData[company] || 0) + laidOff;
    });

    // Convert the aggregated object into an array and sort by layoffs (descending)
    return Object.entries(companyData)
      .map(([company, laidOff]) => ({ company, laidOff }))
      .sort((a, b) => b.laidOff - a.laidOff)
      .slice(0, 15); // Take the top 10 companies
  }, [data]);

  if (aggregatedData.length === 0) {
    return <div>Loading chart...</div>;
  }

  return (
    <div style={{ width: "100%", height: 500 }}>
      <h2 className="text-center text-xl mb-4">Top Companies by Layoffs</h2>
      <ResponsiveContainer>
        <BarChart
          data={aggregatedData}
          layout="vertical"
          margin={{ top: 20, right: 50, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" tick={{ fontSize: 11 }} 
            tickFormatter={(value) => value.toLocaleString()}
          />
          <YAxis type="category" tick={{ fontSize: 11 }}
            width={150}
          
          dataKey="company" />
          <Tooltip />
          <Bar dataKey="laidOff" fill="#8884d8">
            <LabelList
              dataKey="laidOff"
              position="right" // Position the label outside the bar to avoid cutting off
              formatter={(value: number) => value.toLocaleString()} // Ensure 'value' is a number
              style={{ fontSize: 11, fill: "#333" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LayoffTop10Chart;
