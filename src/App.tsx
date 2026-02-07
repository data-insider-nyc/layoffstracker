import React, { useState, Suspense, useEffect } from "react";
import LayoffTable from "./components/LayoffTable";
import { useLayoffData } from "./hooks/useLayoffData";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
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
  
  // Initialize dark mode from localStorage or system preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      return JSON.parse(savedMode);
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply dark mode class on mount and when it changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

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
  const largestLayoffEvent = filteredData.length > 0 
    ? filteredData.reduce((max, item) => (item.laidOff > max.laidOff ? item : max))
    : { company: "", laidOff: 0, date: new Date() };

  return (
    <Router basename="/layoffstracker">
      <div className={`font-sans min-h-screen transition-colors duration-200 ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        <nav className="w-full bg-white dark:bg-gray-800 shadow-md py-4 px-6 sticky top-0 z-10 flex items-center justify-between transition-colors duration-200">
          <h2 className="text-lg font-bold tracking-wide text-gray-900 dark:text-white">📊 Layoffs Tracker</h2>
          <ul className="flex space-x-6 text-sm items-center">
            <li className="hover:text-blue-600 cursor-pointer">
              <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Home</Link>
            </li>
            <li>
              <a
                href="https://github.com/data-insider-nyc/layoffstracker"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
              >
                GitHub
              </a>
            </li>
            <li>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? (
                  <Sun className="h-4 w-4 text-yellow-500" />
                ) : (
                  <Moon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                )}
              </button>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route
            path="/"
            element={
              <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 py-4">
                  {/* Filters */}
                  <div className="mb-6 flex flex-col sm:flex-row sm:space-x-8 space-y-4 sm:space-y-0 justify-start">
                    {/* Year Filter */}
                    <div>
                      <label htmlFor="yearFilter" className="mr-4 font-semibold text-gray-900 dark:text-white">
                        Year:
                      </label>
                      <select
                        id="yearFilter"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="border border-gray-300 dark:border-gray-600 rounded px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
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
                      <label htmlFor="categoryFilter" className="mr-4 font-semibold text-gray-900 dark:text-white">
                        Category:
                      </label>
                      <select
                        id="categoryFilter"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="border border-gray-300 dark:border-gray-600 rounded px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        <option value="ALL">ALL</option>
                        <option value="General">General</option>
                        <option value="DOGE">DOGE</option>
                      </select>
                    </div>
                  </div>

                  {/* Title for KPI Section */}
                  <div className="text-center mb-6">
                    <h2 className="text-2xl mb-2 text-gray-900 dark:text-white">US Layoff Data Overview (2020 - Present)</h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      Data from 2020 to the present showing the number of layoffs across various companies.
                    </p>
                  </div>

                  {/* KPI Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <KpiCard title="Total Laid Off" value={totalLayoffs} note="" />
                    <KpiCard
                      title="Total Companies with Layoffs"
                      value={totalCompanies}
                      note=""
                    />
                    <KpiCard
                      title="Average Layoffs per Company"
                      value={averageLayoffsPerCompany}
                      note=""
                    />
                    <KpiCard
                      title="Largest Layoff Event"
                      value={largestLayoffEvent.laidOff}
                      note={`${largestLayoffEvent.company} on ${new Date(
                        largestLayoffEvent.date
                      ).toLocaleDateString()}`}
                    />
                  </div>

                  <div className="w-full mx-auto">
                    <LayoffTable data={filteredData} isDarkMode={isDarkMode} />
                  </div>

                  <div className="grid grid-cols-1 gap-8 mt-8">
                    <div className="w-full">
                      <Suspense fallback={<div className="text-gray-900 dark:text-white">Loading Time Series...</div>}>
                        <LayoffMonthlyTimeSeries data={filteredData} isDarkMode={isDarkMode} />
                      </Suspense>
                    </div>

                    <div className="w-full mt-8">
                      <Suspense fallback={<div className="text-gray-900 dark:text-white">Loading Bar Chart...</div>}>
                        <LayoffTop10Chart data={filteredData} isDarkMode={isDarkMode} />
                      </Suspense>
                    </div>
                    
                    <div className="w-full mt-8">
                      <Suspense fallback={<div className="text-gray-900 dark:text-white">Loading Location Chart...</div>}>
                        <LayoffTopLocation data={filteredData} isDarkMode={isDarkMode} />
                      </Suspense>
                    </div>
                  </div>
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
