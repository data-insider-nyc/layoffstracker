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

type AggregatedData = {
  month: string; // Format: YYYY-MM
  totalLayoffs: number;
};

// type LayoffMonthlyTimeSeriesProps = {
//   data: Array<Record<string, any>>; // Define the type for the data prop
// };

interface LayoffMonthlyTimeSeriesProps {
  data: Array<Record<string, any>>; // Define the type for the data prop
}

const LayoffMonthlyTimeSeries: React.FC<LayoffMonthlyTimeSeriesProps> = ({
  data,
}) => {
  // Function to group data by month
  const aggregatedData: AggregatedData[] = React.useMemo(() => {
    const monthlyData: { [key: string]: number } = {};

    data.forEach(({ date, laidOff }) => {
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
  }, [data]);

  if (aggregatedData.length === 0) {
    return <div>Loading chart...</div>;
  }

  return (
    <div style={{ width: "100%", height: 350 }}>
      <h2 className="text-center text-xl mb-4">Monthly Layoffs</h2>
      <ResponsiveContainer>
        <BarChart
          data={aggregatedData}
          margin={{ top: 20, right: 0, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <Tooltip />
          <Bar dataKey="totalLayoffs" fill="#8884d8">
            <LabelList
              dataKey="totalLayoffs"
              position="top"
              formatter={(value: number) => value.toLocaleString()} // Format numbers with commas
              style={{ fontSize: 11, fill: "#333" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LayoffMonthlyTimeSeries;
