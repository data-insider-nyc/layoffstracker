import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";

interface Props {
  data: Array<{ date: Date; laidOff: number }>;
}

const MONTH_LABELS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const YEAR_COLORS: Record<number, string> = {
  2020: "#94a3b8",
  2021: "#38bdf8",
  2022: "#34d399",
  2023: "#fbbf24",
  2024: "#818cf8",
  2025: "#fb923c",
  2026: "#f87171",
};

interface YoYPayloadEntry {
  dataKey: string;
  fill?: string;
  name?: string;
  value: number;
}

interface YoYTooltipProps {
  active?: boolean;
  payload?: YoYPayloadEntry[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: YoYTooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--bg-card)",
      border: `1px solid var(--border)`,
      borderRadius: 10,
      padding: "10px 14px",
      boxShadow: "0 8px 24px rgba(0,0,0,.12)",
      fontFamily: "var(--font-body)",
      minWidth: 160,
    }}>
      <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#6b6860", marginBottom: 8, letterSpacing: ".04em", textTransform: "uppercase" }}>
        {label}
      </p>
      {payload.map((p: YoYPayloadEntry) => (
        <div key={p.dataKey} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 3 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: p.fill }} />
            <span style={{ fontSize: 12, color: "#6b6860" }}>{p.name}</span>
          </div>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 500, color: "#1a1916" }}>
            {Number(p.value).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

const LayoffYoYChart: React.FC<Props> = ({ data }) => {
  const { chartData, years } = React.useMemo(() => {
    const monthYearMap: Record<number, Record<number, number>> = {};
    const yearSet = new Set<number>();
    data.forEach(({ date, laidOff }) => {
      const year = date.getFullYear(), month = date.getMonth();
      yearSet.add(year);
      if (!monthYearMap[month]) monthYearMap[month] = {};
      monthYearMap[month][year] = (monthYearMap[month][year] || 0) + laidOff;
    });
    const years = Array.from(yearSet).sort((a, b) => a - b);
    const chartData = MONTH_LABELS.map((label, i) => {
      const row: Record<string, string | number> = { month: label };
      years.forEach((y) => { row[y] = monthYearMap[i]?.[y] ?? 0; });
      return row;
    });
    return { chartData, years };
  }, [data]);

  if (!years.length) return null;

  const axis = { fill: "#9e9c96", fontSize: 11, fontFamily: "var(--font-mono)" };
  const grid = "var(--border)";

  return (
    <div style={{ width: "100%", height: 380 }} role="img" aria-label="Bar chart comparing year-over-year monthly layoff counts">
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 20, paddingLeft: 4 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 400, color: "#1a1916" }}>
          Year-over-Year Monthly Layoffs
        </h2>
      </div>
      <ResponsiveContainer width="100%" height={310}>
        <BarChart data={chartData} margin={{ top: 4, right: 8, left: -8, bottom: 4 }} barCategoryGap="24%" barGap={1}>
          <CartesianGrid strokeDasharray="2 4" stroke={grid} vertical={false} />
          <XAxis dataKey="month" tick={axis} axisLine={false} tickLine={false} />
          <YAxis tick={axis} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,.03)" }} />
          <Legend
            wrapperStyle={{ fontFamily: "var(--font-mono)", fontSize: 11, paddingTop: 12, color: "#9e9c96" }}
            iconType="square" iconSize={8}
          />
          {years.map((year) => (
            <Bar key={year} dataKey={year} name={String(year)} fill={YEAR_COLORS[year] ?? "#94a3b8"} radius={[3, 3, 0, 0]} maxBarSize={14} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LayoffYoYChart;
