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
import { useLayoffData } from "../hooks/useLayoffData";

type AggregatedData = {
  month: string; // Format: YYYY-MM
  totalLayoffs: number;
};

type LayoffMonthlyTimeSeriesPros = {
  data: Array<{
    company: string;
    headquarters?: string;
    laidOff: number;
    date: Date;
  }>;
};

const LayoffMonthlyTimeSeries: React.FC<LayoffMonthlyTimeSeriesPros> = ({
  data,
}) => {
  // Function to group data by month
  const aggregatedData: AggregatedData[] = React.useMemo(() => {
    const monthlyData: { [key: string]: number } = {};

    data.forEach(({ date, laidOff }) => {
      const month = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`; // Format: YYYY-MM
      const year = date.getFullYear();
      monthlyData[month] = (monthlyData[month] || 0) + laidOff;
    });

    // Convert the aggregated object into an array and sort by month (oldest to newest)
    const now = new Date();
    const twoYearsAgo = new Date(now.getFullYear() - 2, now.getMonth() + 1);

    return Object.entries(monthlyData)
      .map(([month, totalLayoffs]) => ({ month, totalLayoffs }))
      .filter(({ month }) => new Date(month) >= twoYearsAgo)
      .sort(
      (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()
      );
  }, [data]);

  if (aggregatedData.length === 0) {
    return <div>Loading chart...</div>;
  }

  return (
    <div style={{ width: "100%", height: 400 }}>
      <h2 className="text-center text-xl mb-4">Monthly Layoffs</h2>
      <ResponsiveContainer>
        <BarChart
          data={aggregatedData}
          margin={{ top: 10, right: 50, left: 50, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip />
          <Bar dataKey="totalLayoffs" fill="#8884d8">
            <LabelList
              dataKey="totalLayoffs"
              position="top"
              formatter={(value: number) => value.toLocaleString()} // Format numbers with commas
              style={{ fontSize: 10, fill: "#333" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const LayoffMonthlyTimeSeriesChart = () => {
  const data = useLayoffData();

  return <LayoffMonthlyTimeSeries data={data} />;
};

export default LayoffMonthlyTimeSeriesChart;
