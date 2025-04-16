import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type LayoffTop10PieChartProps = {
  data: Array<{
    company: string;
    laidOff: number;
  }>;
};

const COLORS = [
  "#4e79a7",
  "#f28e2b",
  "#e15759",
  "#76b7b2",
  "#59a14f",
  "#edc948",
  "#af7aa1",
  "#ff9da7",
  "#9c755f",
  "#bab0ab",
];

const LayoffTop10PieChart: React.FC<LayoffTop10PieChartProps> = ({ data }) => {
  // Aggregate data by company and sort by layoffs (descending)
  const aggregatedData = React.useMemo(() => {
    const companyData: { [key: string]: number } = {};

    data.forEach(({ company, laidOff }) => {
      companyData[company] = (companyData[company] || 0) + laidOff;
    });

    // Convert the aggregated object into an array and sort by layoffs (descending)
    return Object.entries(companyData)
      .map(([company, laidOff]) => ({ company, laidOff }))
      .sort((a, b) => b.laidOff - a.laidOff) // Sort by layoffs in descending order
      .slice(0, 5); // Take the top 10 companies
  }, [data]);

  if (aggregatedData.length === 0) {
    return <div>Loading chart...</div>;
  }

  return (
    <div style={{ width: "100%", height: 350 }}>
      <h2 className="text-center text-xl mb-4">Top Companies by Layoffs</h2>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={aggregatedData}
            dataKey="laidOff"
            nameKey="company"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            startAngle={90} // Start at 12 o'clock
            endAngle={-270} // Proceed clockwise
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
          >
            {aggregatedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => value.toLocaleString()} />
          <Legend verticalAlign="top" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LayoffTop10PieChart;