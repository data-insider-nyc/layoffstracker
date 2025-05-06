import React, { useState, Suspense } from "react";
import LayoffTable from "./components/LayoffTable";
import { useLayoffData } from "./hooks/useLayoffData";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import About from "./components/About";
import KpiCard from "./components/KpiCard";
import LayoffTop10PieChart from "./components/LayoffTop10PieChart";

const LayoffTop10Chart = React.lazy(() => import("./components/LayoffTop10Chart"));
const LayoffMonthlyTimeSeries = React.lazy(() => import("./components/LayoffMonthlyTimeSeries"));
const LayoffTopLocation = React.lazy(() => import("./components/LayoffTopLocation"));

function App() {
  const data = useLayoffData();
  const [selectedYear, setSelectedYear] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  if (data.length === 0) {
    return <div>Loading...</div>;
  }

  // Filter data based on the selected year
  const yearFilteredData =
    selectedYear === "ALL"
      ? data
      : data.filter(
          (item) => new Date(item.date).getFullYear() === parseInt(selectedYear)
        );

  // Filter data based on the selected category
  const filteredData =
    selectedCategory === "ALL"
      ? yearFilteredData
      : yearFilteredData.filter((item) =>
          selectedCategory === "DOGE"
            ? item.company.includes("Department")
            : !item.company.includes("Department")
        );

  // Calculate KPIs
  const totalLayoffs = filteredData.reduce((sum, item) => sum + item.laidOff, 0);
  const totalCompanies = filteredData.length;
  const averageLayoffsPerCompany = Math.round(totalLayoffs / totalCompanies);
  const largestLayoffEvent = filteredData.reduce(
    (max, item) => (item.laidOff > max.laidOff ? item : max),
    { company: "", laidOff: 0, date: "" }
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
            <li>
              <a
                href="https://github.com/data-insider-nyc/trendboard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-blue-600 cursor-pointer"
              >
                GitHub
              </a>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route
            path="/"
            element={
              <div className="p-4 text-center">
                {/* Filters */}
                <div className="mb-6 flex space-x-8 justify-start">
                  {/* Year Filter */}
                  <div>
                    <label htmlFor="yearFilter" className="mr-4 font-semibold">
                      Year:
                    </label>
                    <select
                      id="yearFilter"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="border border-gray-300 rounded px-4 py-2"
                    >
                      <option value="ALL">ALL</option>
                      {Array.from(
                        new Set(data.map((item) => new Date(item.date).getFullYear()))
                      )
                        .sort((a, b) => b - a)
                        .map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label htmlFor="categoryFilter" className="mr-4 font-semibold">
                      Category:
                    </label>
                    <select
                      id="categoryFilter"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="border border-gray-300 rounded px-4 py-2"
                    >
                      <option value="ALL">ALL</option>
                      <option value="General">General</option>
                      <option value="DOGE">DOGE</option>
                    </select>
                  </div>
                </div>

                {/* Title for KPI Section */}
                <h2 className="text-2xl mb-2">US Layoff Data Overview (2020 - Present)</h2>
                <p className="text-gray-600 mb-6">
                  Data from 2020 to the present showing the number of layoffs across various companies.
                </p>

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
                    value={largestLayoffEvent.laidOff}
                    note={`${largestLayoffEvent.company} on ${new Date(
                      largestLayoffEvent.date
                    ).toLocaleDateString()}`}
                  />
                </div>

                <div className="w-5/5 mx-auto">
                  <LayoffTable data={filteredData} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                  <div className="col-span-3">
                    <Suspense fallback={<div>Loading Time Series...</div>}>
                      <LayoffMonthlyTimeSeries data={filteredData} />
                    </Suspense>
                  </div>

                  <div className="col-span-3 mt-8">
                    <Suspense fallback={<div>Loading Bar Chart...</div>}>
                      <LayoffTop10Chart data={filteredData} />
                    </Suspense>
                  </div>
                  
                  {/* <div className="col-span-3 mt-8">
                    <Suspense fallback={<div>Loading Bar Chart...</div>}>
                      <LayoffTopLocation data={filteredData} />
                    </Suspense>
                  </div> */}
                </div>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
