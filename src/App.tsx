import React, { Suspense } from "react";
import LayoffTable from "./components/LayoffTable";
import { useLayoffData } from "./hooks/useLayoffData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import About from "./components/About";
import KpiCard from "./components/KpiCard";

const LayoffTop10Chart = React.lazy(
  () => import("./components/LayoffTop10Chart")
);
const LayoffMonthlyTimeSeries = React.lazy(
  () => import("./components/LayoffMonthlyTimeSeries")
);

function App() {
  const data = useLayoffData();

  if (data.length === 0) {
    return <div>Loading...</div>;
  }

  // Calculate KPIs
  const totalLayoffs = data.reduce((sum, item) => sum + item.laidOff, 0);
  const totalCompanies = data.length;
  const averageLayoffsPerCompany = Math.round(totalLayoffs / totalCompanies);
  const largestLayoff = Math.max(...data.map((item) => item.laidOff));
  const topIndustry = data.reduce((acc, item) => {
    acc[item.industry] = (acc[item.industry] || 0) + item.laidOff;
    return acc;
  }, {});
  const topIndustryName = Object.keys(topIndustry).reduce((a, b) =>
    topIndustry[a] > topIndustry[b] ? a : b
  );
  const retainedEmployees = data.reduce(
    (sum, item) => sum + (item.totalEmployees - item.laidOff),
    0
  );

  return (
    <Router basename="/trendboard">
      <div className="font-sans">
        <nav className="w-full bg-white shadow-md py-4 px-6 sticky top-0 z-10 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-wide">📊 Trendboard</h2>
          <ul className="flex space-x-6 text-sm">
            <li className="hover:text-blue-600 cursor-pointer">
              <Link to="/">Home</Link>
            </li>
            <li className="hover:text-blue-600 cursor-pointer">
              <Link to="/about">About</Link>
            </li>
            <li>
              <a
                href="https://github.com/data-insider-nyc/trendboard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-blue-600 cursor-pointer"
              >
                Contribute
              </a>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/about" element={<About />} />
          <Route
            path="/"
            element={
              <Tabs defaultValue="layoff" className="">
                <TabsList>
                  <TabsTrigger value="layoff">Layoffs Tracker</TabsTrigger>
                </TabsList>
                <TabsContent value="layoff">
                  <div className="p-8 text-center">
                    {/* Title for KPI Section */}
                    <h2 className="text-2xl font-bold mb-2">US Layoff Data Overview (2020 - Present)</h2>
                    <p className="text-gray-600 mb-6">Data from 2020 to the present showing the number of layoffs across various companies.</p>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                      <KpiCard title="Total Laid Off" value={totalLayoffs} />
                      <KpiCard
                        title="Total Companies with Layoffs"
                        value={totalCompanies}
                      />
                      <KpiCard
                        title="Average Layoffs per Company"
                        value={averageLayoffsPerCompany}
                      />
                      <KpiCard
                        title="Largest Layoff Event"
                        value={largestLayoff}
                      />
                    </div>

                    <div className="w-5/5 mx-auto">
                      <LayoffTable />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                      <div className="col-span-2">
                        <Suspense fallback={<div>Loading Time Series...</div>}>
                          <LayoffMonthlyTimeSeries rawData={data} />
                        </Suspense>
                      </div>

                      <div>
                        <Suspense fallback={<div>Loading Bar Chart...</div>}>
                          <LayoffTop10Chart data={data} />
                        </Suspense>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="password">
                  Change your password here.
                </TabsContent>
              </Tabs>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
