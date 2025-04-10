import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useLayoffData } from "../hooks/useLayoffData";

type AggregatedData = {
  month: string; // Format: YYYY-MM
  totalLayoffs: number;
};

const LayoffLineChart = () => {
  const rawData = useLayoffData();

  // Aggregate data by month
  const aggregatedData: AggregatedData[] = React.useMemo(() => {
    const monthlyData: { [key: string]: number } = {};

    rawData.forEach(({ date, laidOff }) => {
      const month = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`; // Format: YYYY-MM
      monthlyData[month] = (monthlyData[month] || 0) + laidOff;
    });

    // Convert the aggregated object into an array and sort by month (oldest to newest)
    return Object.entries(monthlyData)
      .map(([month, totalLayoffs]) => ({ month, totalLayoffs }))
      .sort(
        (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()
      );
  }, [rawData]);

  if (aggregatedData.length === 0) {
    return <div>Loading chart...</div>;
  }

  return (
    <div style={{ width: "100%", height: 500 }}>
      <h2 style={{ marginBottom: "1rem" }}>Monthly Layoffs</h2>
      <p>
        Data from 2020 to the present showing the total number of layoffs
        grouped by month.
      </p>
      <ResponsiveContainer width="100%">
        <BarChart data={aggregatedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            type="monotone"
            dataKey="totalLayoffs"
            fill="#8884d8"
            activeDot={{ r: 8 }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LayoffLineChart;
