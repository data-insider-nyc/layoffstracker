import React from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Legend,
} from "recharts";

type AggregatedData = {
  period: string;
  totalLayoffs: number;
  rollingAvg?: number;
};

interface LayoffMonthlyTimeSeriesProps {
  data: Array<{ date: Date; laidOff: number }>;
  isDarkMode?: boolean;
}

const LayoffMonthlyTimeSeries: React.FC<LayoffMonthlyTimeSeriesProps> = ({
  data,
  isDarkMode = false,
}) => {
  const aggregatedData: AggregatedData[] = React.useMemo(() => {
    const isDaily = data.length <= 30;
    const periodData: { [key: string]: number } = {};

    data.forEach(({ date, laidOff }) => {
      const period = isDaily
        ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
            date.getDate()
          ).padStart(2, "0")}`
        : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      periodData[period] = (periodData[period] || 0) + laidOff;
    });

    const sorted = Object.entries(periodData)
      .map(([period, totalLayoffs]) => ({ period, totalLayoffs }))
      .sort((a, b) => new Date(a.period).getTime() - new Date(b.period).getTime());

    // Compute 3-period rolling average
    return sorted.map((item, i) => {
      const window = sorted.slice(Math.max(0, i - 2), i + 1);
      const avg = Math.round(window.reduce((s, d) => s + d.totalLayoffs, 0) / window.length);
      return { ...item, rollingAvg: avg };
    });
  }, [data]);

  const isDaily = data.length <= 30;

  if (aggregatedData.length === 0) {
    return <div className="text-gray-900 dark:text-white">Loading chart...</div>;
  }

  return (
    <div style={{ width: "100%", height: 350 }}>
      <h2 className="text-center text-xl mb-4 text-gray-900 dark:text-white">
        {isDaily ? "Daily Layoffs" : "Monthly Layoffs"}
      </h2>
      <ResponsiveContainer>
        <ComposedChart
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
            tick={{ fontSize: 11, fill: isDarkMode ? "#E5E7EB" : "#374151" }}
            axisLine={{ stroke: isDarkMode ? "#6B7280" : "#D1D5DB" }}
            tickLine={{ stroke: isDarkMode ? "#6B7280" : "#D1D5DB" }}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip
            contentStyle={{
              fontSize: 11,
              backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
              border: `1px solid ${isDarkMode ? "#374151" : "#E5E7EB"}`,
              borderRadius: "6px",
              color: isDarkMode ? "#E5E7EB" : "#374151",
            }}
            labelStyle={{ fontSize: 11, color: isDarkMode ? "#E5E7EB" : "#374151" }}
            formatter={(value: number, name: string) => [
              value.toLocaleString(),
              name === "rollingAvg" ? `3-${isDaily ? "day" : "month"} avg` : "Layoffs",
            ]}
          />
          <Legend
            formatter={(value) =>
              value === "rollingAvg" ? `3-${isDaily ? "day" : "month"} avg` : "Layoffs"
            }
            wrapperStyle={{ fontSize: 12, color: isDarkMode ? "#E5E7EB" : "#374151" }}
          />
          <Bar
            dataKey="totalLayoffs"
            name="totalLayoffs"
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
                  .slice(0, 5);
                return topValues.includes(value) ? value.toLocaleString() : "";
              }}
              style={{ fontSize: 10, fill: isDarkMode ? "#E5E7EB" : "#333" }}
            />
          </Bar>
          <Line
            type="monotone"
            dataKey="rollingAvg"
            name="rollingAvg"
            stroke={isDarkMode ? "#F87171" : "#ef4444"}
            strokeWidth={2}
            dot={false}
            strokeDasharray="5 3"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LayoffMonthlyTimeSeries;
