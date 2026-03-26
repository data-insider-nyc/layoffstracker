import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell } from "recharts";

type Props = {
  data: Array<{ company: string; headquarter?: string; laidOff: number; date: Date }>;
  isDarkMode?: boolean;
};

const cityToStateMap: Record<string, string> = {
  "San Francisco": "SF Bay Area", "Palo Alto": "SF Bay Area", "Menlo Park": "SF Bay Area",
  "Sunnyvale": "SF Bay Area", "Mountain View": "SF Bay Area", "Redwood City": "SF Bay Area",
  "Santa Clara": "SF Bay Area", "San Jose": "SF Bay Area", "Oakland": "SF Bay Area",
  "Los Angeles": "California (Other)", "San Diego": "California (Other)",
  "Seattle": "Washington", "Bellevue": "Washington", "Redmond": "Washington",
  "New York City": "New York", "New York": "New York",
  "Atlanta": "Georgia", "Austin": "Texas", "Dallas": "Texas", "Houston": "Texas",
  "Chicago": "Illinois", "Denver": "Colorado", "Boston": "Massachusetts",
  "Cambridge": "Massachusetts", "Washington D.C.": "Washington D.C.",
  "Detroit": "Michigan", "Portland": "Oregon",
};

const extractState = (hq: string | undefined): string => {
  if (!hq) return "Unknown";
  for (const [city, state] of Object.entries(cityToStateMap)) {
    if (hq.toLowerCase().includes(city.toLowerCase())) return state;
  }
  return hq.trim();
};

// Graduated red scale — most layoffs = darkest
const getBarColor = (index: number, total: number, isDarkMode: boolean): string => {
  const t = 1 - index / Math.max(total - 1, 1);
  if (isDarkMode) {
    const r = Math.round(120 + t * 135);
    const g = Math.round(20 + t * 10);
    const b = Math.round(20 + t * 10);
    return `rgb(${r},${g},${b})`;
  } else {
    const r = Math.round(180 + t * 55);
    const g = Math.round(40 + t * 40);
    const b = Math.round(30 + t * 10);
    return `rgb(${r},${g},${b})`;
  }
};

interface TooltipPayload {
  state: string;
  laidOff: number;
  companies: number;
  percentage: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ payload: TooltipPayload }>;
  isDarkMode?: boolean;
}

const CustomTooltip = ({ active, payload, isDarkMode }: TooltipProps) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{
      background: isDarkMode ? "#1c1c1a" : "#fff",
      border: `1px solid ${isDarkMode ? "#2a2a26" : "#e2e0da"}`,
      borderRadius: 10, padding: "10px 14px",
      boxShadow: "0 8px 24px rgba(0,0,0,.12)", fontFamily: "var(--font-body)",
    }}>
      <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: isDarkMode ? "#9e9c96" : "#6b6860", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".04em" }}>{d.state}</p>
      <p style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 500, color: isDarkMode ? "#f87171" : "#E8340A" }}>{d.laidOff.toLocaleString()} laid off</p>
      <p style={{ fontSize: 11, color: isDarkMode ? "#5a5955" : "#9e9c96", marginTop: 4 }}>{d.companies} companies · {d.percentage} share</p>
    </div>
  );
};

const LayoffTopLocation: React.FC<Props> = ({ data, isDarkMode = false }) => {
  const aggregatedData = React.useMemo(() => {
    const stateData: Record<string, { laidOff: number; companies: Set<string> }> = {};
    data.forEach(({ company, headquarter, laidOff }) => {
      const state = extractState(headquarter);
      if (!stateData[state]) stateData[state] = { laidOff: 0, companies: new Set() };
      stateData[state].laidOff += laidOff;
      stateData[state].companies.add(company);
    });
    const total = Object.values(stateData).reduce((s, d) => s + d.laidOff, 0);
    return Object.entries(stateData)
      .map(([state, d]) => ({ state, laidOff: d.laidOff, companies: d.companies.size, percentage: `${((d.laidOff / total) * 100).toFixed(1)}%` }))
      .sort((a, b) => b.laidOff - a.laidOff)
      .slice(0, 12);
  }, [data]);

  if (aggregatedData.length === 0) return null;

  const axis = { fill: isDarkMode ? "#5a5955" : "#9e9c96", fontSize: 11, fontFamily: "var(--font-mono)" };
  const grid = isDarkMode ? "#2a2a26" : "#e2e0da";

  return (
    <div style={{ width: "100%", height: 440 }}>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 400, color: isDarkMode ? "#f0efe9" : "#1a1916", marginBottom: 20, paddingLeft: 4 }}>
        Top States by Layoffs
      </h2>
      <ResponsiveContainer width="100%" height={370}>
        <BarChart data={aggregatedData} layout="vertical" margin={{ top: 4, right: 72, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="2 4" stroke={grid} horizontal={false} />
          <XAxis type="number" tick={axis} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
          <YAxis type="category" dataKey="state" tick={axis} axisLine={false} tickLine={false} width={130} />
          <Tooltip content={<CustomTooltip isDarkMode={isDarkMode} />} cursor={{ fill: isDarkMode ? "rgba(255,255,255,.02)" : "rgba(0,0,0,.02)" }} />
          <Bar dataKey="laidOff" radius={[0, 6, 6, 0]} maxBarSize={20}>
            {aggregatedData.map((_, i) => (
              <Cell key={i} fill={getBarColor(i, aggregatedData.length, isDarkMode)} />
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

export default LayoffTopLocation;
