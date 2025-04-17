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

type LayoffTopLocationProps = {
  data: Array<{
    company: string;
    headquarter?: string;
    laidOff: number;
    date: Date;
  }>;
};

const LayoffTopLocation: React.FC<LayoffTopLocationProps> = ({ data }) => {
  // Aggregate data by company
  const aggregatedData = React.useMemo(() => {
    const headquarterData: { [key: string]: number } = {};

    data.forEach(({ company, headquarter }) => {
      headquarterData[headquarter] = (headquarterData[headquarter] || 0) + 1;
    });

    // Convert the aggregated object into an array and sort by layoffs (descending)
    return Object.entries(headquarterData)
      .map(([headquarter, laidOff]) => ({ headquarter, laidOff }))
      .sort((a, b) => b.laidOff - a.laidOff)
      .slice(0, 15); // Take the top 10 companies
  }, [data]);

  if (aggregatedData.length === 0) {
    return <div>Loading chart...</div>;
  }

  return (
    <div style={{ width: "100%", height: 500 }}>
      <h2 className="text-center text-xl mb-4">Top Companies by Location</h2>
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
          
          dataKey="headquarter" />
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

export default LayoffTopLocation;
