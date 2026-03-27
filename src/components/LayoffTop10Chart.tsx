import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell } from "recharts";
import { Link } from "react-router-dom";

type Props = {
  data: Array<{ company: string; laidOff: number; date: Date }>;
  isDarkMode?: boolean;
};

const PALETTE_LIGHT = ["#0057FF","#0071E3","#0284C7","#0369A1","#0C4A6E","#1E3A5F","#164E63","#134E4A","#14532D","#1A2E05"];
const PALETTE_DARK  = ["#818cf8","#60a5fa","#38bdf8","#2dd4bf","#4ade80","#a3e635","#fbbf24","#fb923c","#f87171","#f472b6"];

const TOP_N = 10;

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: { company: string } }>;
  isDarkMode?: boolean;
}

const CustomTooltip = ({ active, payload, isDarkMode }: TooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: isDarkMode ? "#1c1c1a" : "#fff",
      border: `1px solid ${isDarkMode ? "#2a2a26" : "#e2e0da"}`,
      borderRadius: 10, padding: "10px 14px",
      boxShadow: "0 8px 24px rgba(0,0,0,.12)", fontFamily: "var(--font-body)",
    }}>
      <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: isDarkMode ? "#9e9c96" : "#6b6860", marginBottom: 4 }}>
        {payload[0].payload.company}
      </p>
      <p style={{ fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 600, color: isDarkMode ? "#f87171" : "#E8340A" }}>
        {Number(payload[0].value).toLocaleString()} laid off
      </p>
    </div>
  );
};

interface TickProps {
  x?: number;
  y?: number;
  payload?: { value: string };
  isDarkMode?: boolean;
}

// Clickable company name as Y-axis tick
const CompanyTick = ({ x, y, payload, isDarkMode }: TickProps) => {
  const slug = encodeURIComponent((payload.value as string).toLowerCase());
  return (
    <foreignObject x={x - 148} y={y - 10} width={145} height={22}>
      <div style={{ display: "flex", alignItems: "center", height: "100%", justifyContent: "flex-end" }}>
        <Link
          to={`/company/${slug}`}
          style={{
            fontSize: 11,
            fontFamily: "var(--font-mono)",
            color: isDarkMode ? "#818cf8" : "#0057FF",
            textDecoration: "none",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "100%",
          }}
        >
          {payload.value}
        </Link>
      </div>
    </foreignObject>
  );
};

const LayoffTop10Chart: React.FC<Props> = ({ data, isDarkMode = false }) => {
  const aggregatedData = React.useMemo(() => {
    const map: Record<string, number> = {};
    data.forEach(({ company, laidOff }) => { map[company] = (map[company] || 0) + laidOff; });
    return Object.entries(map)
      .map(([company, laidOff]) => ({ company, laidOff }))
      .sort((a, b) => b.laidOff - a.laidOff)
      .slice(0, TOP_N);
  }, [data]);

  if (aggregatedData.length === 0) return null;

  const colors = isDarkMode ? PALETTE_DARK : PALETTE_LIGHT;
  const axis = { fill: isDarkMode ? "#5a5955" : "#9e9c96", fontSize: 11, fontFamily: "var(--font-mono)" };
  const grid = isDarkMode ? "#2a2a26" : "#e2e0da";

  return (
    <div style={{ width: "100%", height: 440 }} role="img" aria-label={`Bar chart showing top ${TOP_N} companies by total layoffs`}>
      <div style={{ paddingLeft: 4, marginBottom: 6 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 400, color: isDarkMode ? "#f0efe9" : "#1a1916", marginBottom: 2 }}>
          Top {TOP_N} Companies
        </h2>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: isDarkMode ? "#5a5955" : "#9e9c96", letterSpacing: ".03em" }}>
          Click name for full timeline
        </p>
      </div>
      <ResponsiveContainer width="100%" height={380}>
        <BarChart data={aggregatedData} layout="vertical" margin={{ top: 4, right: 64, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="2 4" stroke={grid} horizontal={false} />
          <XAxis type="number" tick={axis} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
          <YAxis
            type="category"
            dataKey="company"
            tick={(props) => <CompanyTick {...props} isDarkMode={isDarkMode} />}
            axisLine={false}
            tickLine={false}
            width={152}
          />
          <Tooltip content={<CustomTooltip isDarkMode={isDarkMode} />} cursor={{ fill: isDarkMode ? "rgba(255,255,255,.02)" : "rgba(0,0,0,.02)" }} />
          <Bar dataKey="laidOff" radius={[0, 6, 6, 0]} maxBarSize={22}>
            {aggregatedData.map((_, i) => (
              <Cell key={i} fill={colors[i % colors.length]} />
            ))}
            <LabelList
              dataKey="laidOff"
              position="right"
              formatter={(v: number) => v.toLocaleString()}
              style={{ fontSize: 10, fontFamily: "var(--font-mono)", fill: isDarkMode ? "#5a5955" : "#9e9c96" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LayoffTop10Chart;
