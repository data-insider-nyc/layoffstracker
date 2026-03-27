import React from "react";
import {
  ComposedChart, Bar, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, LabelList,
} from "recharts";

interface Props {
  data: Array<{ date: Date; laidOff: number }>;
}

interface PayloadEntry {
  dataKey: string;
  fill?: string;
  stroke?: string;
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: PayloadEntry[];
  label?: string;
  isDaily?: boolean;
}

const CustomTooltip = ({ active, payload, label, isDaily }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--bg-card)",
      border: `1px solid var(--border)`,
      borderRadius: 10, padding: "10px 14px",
      boxShadow: "0 8px 24px rgba(0,0,0,.12)",
      fontFamily: "var(--font-body)",
    }}>
      <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#6b6860", marginBottom: 8, letterSpacing: ".04em" }}>{label}</p>
      {payload.map((p: PayloadEntry) => (
        <div key={p.dataKey} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 3 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: p.fill || p.stroke }} />
            <span style={{ fontSize: 12, color: "#6b6860" }}>
              {p.dataKey === "rollingAvg" ? `3-${isDaily ? "day" : "month"} avg` : "Layoffs"}
            </span>
          </div>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 500, color: "#1a1916" }}>
            {Number(p.value).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

const LayoffMonthlyTimeSeries: React.FC<Props> = ({ data }) => {
  const aggregatedData = React.useMemo(() => {
    const isDaily = data.length <= 30;
    const periodData: Record<string, number> = {};
    data.forEach(({ date, laidOff }) => {
      const period = isDaily
        ? `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`
        : `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}`;
      periodData[period] = (periodData[period] || 0) + laidOff;
    });
    const sorted = Object.entries(periodData)
      .map(([period, totalLayoffs]) => ({ period, totalLayoffs }))
      .sort((a, b) => new Date(a.period).getTime() - new Date(b.period).getTime());
    return sorted.map((item, i) => {
      const window = sorted.slice(Math.max(0, i - 2), i + 1);
      const avg = Math.round(window.reduce((s, d) => s + d.totalLayoffs, 0) / window.length);
      return { ...item, rollingAvg: avg };
    });
  }, [data]);

  const isDaily = data.length <= 30;
  if (aggregatedData.length === 0) return null;

  const axis = { fill: "#9e9c96", fontSize: 11, fontFamily: "var(--font-mono)" };
  const grid = "var(--border)";
  const barColor = "#4f46e5";
  const lineColor = "#E8340A";

  // Top 5 values to label
  const top5 = [...aggregatedData].sort((a, b) => b.totalLayoffs - a.totalLayoffs).slice(0, 5).map(d => d.totalLayoffs);

  return (
    <div style={{ width: "100%", height: 350 }} role="img" aria-label={`Chart showing ${isDaily ? "daily" : "monthly"} layoffs over time with rolling average trend line`}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 20, paddingLeft: 4 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 400, color: "#1a1916" }}>
          {isDaily ? "Daily Layoffs" : "Monthly Layoffs"}
        </h2>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#9e9c96" }}>
          3-{isDaily ? "day" : "month"} rolling avg
        </span>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={aggregatedData} margin={{ top: 16, right: 8, left: -8, bottom: 4 }}>
          <CartesianGrid strokeDasharray="2 4" stroke={grid} vertical={false} />
          <XAxis dataKey="period" tick={axis} axisLine={false} tickLine={false} interval="preserveStartEnd" />
          <YAxis tick={axis} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
          <Tooltip content={<CustomTooltip isDaily={isDaily} />} cursor={{ fill: "rgba(0,0,0,.03)" }} />
          <Bar dataKey="totalLayoffs" fill={barColor} radius={[3, 3, 0, 0]} maxBarSize={28}>
            <LabelList
              dataKey="totalLayoffs"
              position="top"
              formatter={(v: number) => top5.includes(v) ? v.toLocaleString() : ""}
              style={{ fontSize: 9, fontFamily: "var(--font-mono)", fill: "#9e9c96" }}
            />
          </Bar>
          <Line type="monotone" dataKey="rollingAvg" stroke={lineColor} strokeWidth={2} dot={false} strokeDasharray="4 2" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LayoffMonthlyTimeSeries;
