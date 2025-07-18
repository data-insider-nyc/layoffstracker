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
  period: string; // Format: YYYY-MM or YYYY-MM-DD
  totalLayoffs: number;
};

interface LayoffMonthlyTimeSeriesProps {
  data: Array<{ date: Date; laidOff: number }>; // Define the type for the data prop
  isDarkMode?: boolean;
}

const LayoffMonthlyTimeSeries: React.FC<LayoffMonthlyTimeSeriesProps> = ({
  data,
  isDarkMode = false,
}) => {
  // Function to group data by period (daily or monthly)
  const aggregatedData: AggregatedData[] = React.useMemo(() => {
    const isDaily = data.length <= 30; // Use daily granularity if data length is small
    const periodData: { [key: string]: number } = {};

    data.forEach(({ date, laidOff }) => {
      const period = isDaily
        ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
            date.getDate()
          ).padStart(2, "0")}` // Format: YYYY-MM-DD
        : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`; // Format: YYYY-MM
      periodData[period] = (periodData[period] || 0) + laidOff;
    });

    // Convert the aggregated object into an array and sort by period (oldest to newest)
    return Object.entries(periodData)
      .map(([period, totalLayoffs]) => ({ period, totalLayoffs }))
      .sort(
        (a, b) => new Date(a.period).getTime() - new Date(b.period).getTime()
      );
  }, [data]);

  if (aggregatedData.length === 0) {
    return <div className="text-gray-900 dark:text-white">Loading chart...</div>;
  }

  return (
    <div style={{ width: "100%", height: 350 }}>
      <h2 className="text-center text-xl mb-4 text-gray-900 dark:text-white">
      {data.length <= 30 ? "Daily Layoffs" : "Monthly Layoffs"}
      </h2>
      <ResponsiveContainer>
      <BarChart
        data={aggregatedData}
        margin={{ top: 20, right: 0, left: 0, bottom: 20 }}
      >
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke={isDarkMode ? "#4B5563" : "#E5E7EB"} 
        />
        <XAxis 
          dataKey="period" 
          tick={{ fontSize: 11, fill: isDarkMode ? "#E5E7EB" : "#374151" }} 
          axisLine={{ stroke: isDarkMode ? "#6B7280" : "#D1D5DB" }}
          tickLine={{ stroke: isDarkMode ? "#6B7280" : "#D1D5DB" }}
        />
        <YAxis
        dataKey={"totalLayoffs"}
        tick={{ fontSize: 11, fill: isDarkMode ? "#E5E7EB" : "#374151" }}
        axisLine={{ stroke: isDarkMode ? "#6B7280" : "#D1D5DB" }}
        tickLine={{ stroke: isDarkMode ? "#6B7280" : "#D1D5DB" }}
        tickFormatter={(value) => value.toLocaleString()} // Format Y-axis labels
        />
        <Tooltip
        contentStyle={{ 
          fontSize: 11, 
          backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
          border: `1px solid ${isDarkMode ? "#374151" : "#E5E7EB"}`,
          borderRadius: "6px",
          color: isDarkMode ? "#E5E7EB" : "#374151"
        }}
        labelStyle={{ 
          fontSize: 11, 
          color: isDarkMode ? "#E5E7EB" : "#374151" 
        }}
        formatter={(value: number) => [`No. of Layoffs: ${value.toLocaleString()}`]} // Format tooltip values
        />
        <Bar
        dataKey="totalLayoffs"
        fill={isDarkMode ? "#60A5FA" : "#8884d8"}
        radius={[4, 4, 0, 0]}
        >
          <LabelList
            dataKey="totalLayoffs"
            position="top"
            formatter={(value: number) => {
              const topValues = aggregatedData
                .map((d) => d.totalLayoffs)
                .sort((a, b) => b - a)
                .slice(0, 5); // Get top 5 values
              if (topValues.includes(value)) {
                return value.toLocaleString();
              }
              return "";
            }}
            style={{ 
              fontSize: 10, 
              fill: isDarkMode ? "#E5E7EB" : "#333" 
            }}
          />
        </Bar>
      </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LayoffMonthlyTimeSeries;
