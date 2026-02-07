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
  Cell,
} from "recharts";

type LayoffTopLocationProps = {
  data: Array<{
    company: string;
    headquarter?: string;
    laidOff: number;
    date: Date;
  }>;
};

type LayoffTopLocationPropsWithTheme = LayoffTopLocationProps & {
  isDarkMode?: boolean;
};

// Mapping of cities to regions/states (Bay Area separated for better insights)
const cityToStateMap: { [key: string]: string } = {
  // SF Bay Area (separated for regional insights)
  "San Francisco": "SF Bay Area",
  "Palo Alto": "SF Bay Area",
  "Menlo Park": "SF Bay Area",
  "Sunnyvale": "SF Bay Area",
  "Mountain View": "SF Bay Area",
  "Redwood City": "SF Bay Area",
  "Santa Clara": "SF Bay Area",
  "San Jose": "SF Bay Area",
  "Oakland": "SF Bay Area",
  "Fremont": "SF Bay Area",
  
  // Other California
  "Los Angeles": "California (Other)",
  "San Diego": "California (Other)",
  
  // Washington
  "Seattle": "Washington",
  "Bellevue": "Washington",
  "Redmond": "Washington",
  
  // New York
  "New York City": "New York",
  "New York": "New York",
  
  // Other US
  "Atlanta": "Georgia",
  "Austin": "Texas",
  "Dallas": "Texas",
  "Houston": "Texas",
  "Chicago": "Illinois",
  "Denver": "Colorado",
  "Boston": "Massachusetts",
  "Cambridge": "Massachusetts",
  "Washington D.C.": "Washington D.C.",
  "Midland": "Michigan",
  "Detroit": "Michigan",
  "Portland": "Oregon",
};

// Extract state from headquarter string
const extractState = (headquarter: string | undefined): string => {
  if (!headquarter) return "Unknown";
  
  const trimmed = headquarter.trim();
  
  // Check if it's in our mapping
  for (const [city, state] of Object.entries(cityToStateMap)) {
    if (trimmed.toLowerCase().includes(city.toLowerCase())) {
      return state;
    }
  }
  
  // Return the original if it's not a US location
  return trimmed;
};

// Get color intensity based on value
const getColorByValue = (value: number, maxValue: number, isDarkMode?: boolean): string => {
  const percentage = value / maxValue;
  
  if (isDarkMode) {
    if (percentage > 0.8) return "#dc2626"; // Dark red
    if (percentage > 0.6) return "#f97316"; // Orange
    if (percentage > 0.4) return "#eab308"; // Yellow
    if (percentage > 0.2) return "#84cc16"; // Lime
    return "#22c55e"; // Green
  } else {
    if (percentage > 0.8) return "#ef4444"; // Red
    if (percentage > 0.6) return "#f97316"; // Orange
    if (percentage > 0.4) return "#fbbf24"; // Amber
    if (percentage > 0.2) return "#86efac"; // Light green
    return "#4ade80"; // Green
  }
};

type AggregatedStateData = {
  state: string;
  laidOff: number;
  companies: number;
  percentage: string;
};

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ payload: AggregatedStateData }>;
  isDarkMode?: boolean;
}

const CustomTooltip: React.FC<TooltipProps> = ({ active, payload, isDarkMode }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as AggregatedStateData;
    return (
      <div className={`p-2 rounded border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
        <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{data.state}</p>
        <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
          Layoffs: {data.laidOff.toLocaleString()}
        </p>
        <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
          Companies: {data.companies}
        </p>
        <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
          Share: {data.percentage}
        </p>
      </div>
    );
  }
  return null;
};

const LayoffTopLocation: React.FC<LayoffTopLocationPropsWithTheme> = ({ data, isDarkMode }) => {
  // Aggregate data by state with metrics
  const aggregatedData = React.useMemo(() => {
    const stateData: {
      [key: string]: { laidOff: number; companies: Set<string> };
    } = {};

    data.forEach(({ company, headquarter, laidOff }) => {
      const state = extractState(headquarter);
      
      if (!stateData[state]) {
        stateData[state] = { laidOff: 0, companies: new Set() };
      }
      
      stateData[state].laidOff += laidOff;
      stateData[state].companies.add(company);
    });

    const totalLayoffs = Object.values(stateData).reduce((sum, item) => sum + item.laidOff, 0);

    // Convert to array and calculate percentages
    const result: AggregatedStateData[] = Object.entries(stateData)
      .map(([state, item]) => ({
        state,
        laidOff: item.laidOff,
        companies: item.companies.size,
        percentage: ((item.laidOff / totalLayoffs) * 100).toFixed(1) + "%",
      }))
      .sort((a, b) => b.laidOff - a.laidOff)
      .slice(0, 15); // Top 15 states

    return result;
  }, [data]);

  const maxLayoffs = Math.max(...aggregatedData.map((item) => item.laidOff), 1);

  if (aggregatedData.length === 0) {
    return <div>Loading chart...</div>;
  }

  return (
    <div>
      <div style={{ width: "100%", height: 500 }}>
        <h2 className={`text-center text-xl mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Top States by Total Layoffs
        </h2>
        <ResponsiveContainer>
          <BarChart
            data={aggregatedData}
            layout="vertical"
            margin={{ top: 20, right: 80, left: 120, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              tick={{ fontSize: 11 }}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <YAxis
              type="category"
              tick={{ fontSize: 12 }}
              width={110}
              dataKey="state"
            />
            <Tooltip 
              content={<CustomTooltip isDarkMode={isDarkMode} />}
            />
            <Bar dataKey="laidOff" radius={[0, 8, 8, 0]}>
              {aggregatedData.map((item, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getColorByValue(item.laidOff, maxLayoffs, isDarkMode)} 
                />
              ))}
              <LabelList
                dataKey="laidOff"
                position="right"
                formatter={(value: number) => value.toLocaleString()}
                style={{ fontSize: 11, fill: isDarkMode ? "#e5e7eb" : "#333" }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Summary Stats */}
      <div className={`mt-6 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <h3 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Summary by State
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
          {aggregatedData.map((item) => (
            <div 
              key={item.state} 
              className={`p-2 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-white border border-gray-200'}`}
            >
              <div className="font-semibold">{item.state}</div>
              <div className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                {item.laidOff.toLocaleString()} people • {item.companies} companies
              </div>
              <div className={`text-xs font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                {item.percentage} of total
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LayoffTopLocation;
