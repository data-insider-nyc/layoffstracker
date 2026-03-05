import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface LayoffYoYChartProps {
  data: Array<{ date: Date; laidOff: number }>;
  isDarkMode?: boolean;
}

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Categorical palette — each year gets a distinct, readable color
const YEAR_COLORS: Record<number, string> = {
  2020: "#6b7280", // gray-500
  2021: "#0891b2", // cyan-600
  2022: "#059669", // emerald-600
  2023: "#f59e0b", // amber-500
  2024: "#3b82f6", // blue-500
  2025: "#8b5cf6", // violet-500
  2026: "#ef4444", // red-500 — current year, most prominent
};

const LayoffYoYChart: React.FC<LayoffYoYChartProps> = ({ data, isDarkMode = false }) => {
  const { chartData, years } = React.useMemo(() => {
    // Build map: month (0-11) → { [year]: total }
    const monthYearMap: Record<number, Record<number, number>> = {};
    const yearSet = new Set<number>();

    data.forEach(({ date, laidOff }) => {
      const year = date.getFullYear();
      const month = date.getMonth(); // 0-based
      yearSet.add(year);
      if (!monthYearMap[month]) monthYearMap[month] = {};
      monthYearMap[month][year] = (monthYearMap[month][year] || 0) + laidOff;
    });

    const years = Array.from(yearSet).sort((a, b) => a - b);

    const chartData = MONTH_LABELS.map((label, i) => {
      const row: Record<string, string | number> = { month: label };
      years.forEach((y) => {
        row[y] = monthYearMap[i]?.[y] ?? 0;
      });
      return row;
    });

    return { chartData, years };
  }, [data]);

  if (!years.length) {
    return <div className="text-gray-900 dark:text-white">Loading chart...</div>;
  }

  return (
    <div style={{ width: "100%", height: 380 }}>
      <h2 className="text-center text-xl mb-4 text-gray-900 dark:text-white">
        Year-over-Year Monthly Layoffs
      </h2>
      <ResponsiveContainer>
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
          barCategoryGap="20%"
          barGap={2}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#4B5563" : "#E5E7EB"} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: isDarkMode ? "#E5E7EB" : "#374151" }}
            axisLine={{ stroke: isDarkMode ? "#6B7280" : "#D1D5DB" }}
            tickLine={{ stroke: isDarkMode ? "#6B7280" : "#D1D5DB" }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: isDarkMode ? "#E5E7EB" : "#374151" }}
            axisLine={{ stroke: isDarkMode ? "#6B7280" : "#D1D5DB" }}
            tickLine={{ stroke: isDarkMode ? "#6B7280" : "#D1D5DB" }}
            tickFormatter={(v) => v.toLocaleString()}
          />
          <Tooltip
            contentStyle={{
              fontSize: 11,
              backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
              border: `1px solid ${isDarkMode ? "#374151" : "#E5E7EB"}`,
              borderRadius: "6px",
              color: isDarkMode ? "#E5E7EB" : "#374151",
            }}
            formatter={(value: number, name: string) => [value.toLocaleString(), name]}
          />
          <Legend
            wrapperStyle={{
              fontSize: 13,
              paddingTop: 8,
              color: isDarkMode ? "#E5E7EB" : "#374151",
            }}
          />
          {years.map((year) => (
            <Bar
              key={year}
              dataKey={year}
              name={String(year)}
              fill={YEAR_COLORS[year] ?? "#94a3b8"}
              radius={[3, 3, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LayoffYoYChart;
