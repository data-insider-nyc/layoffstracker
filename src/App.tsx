import React, { Suspense, useState } from "react";
import LayoffTable from "./components/LayoffTable";
import { useLayoffData } from "./hooks/useLayoffData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import About from "./components/About";
import KpiCard from "./components/KpiCard";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import LayoffTop10PieChart from "./components/LayoffTop10PieChart";

const LayoffTop10Chart = React.lazy(
  () => import("./components/LayoffTop10Chart")
);
const LayoffMonthlyTimeSeries = React.lazy(
  () => import("./components/LayoffMonthlyTimeSeries")
);

function App() {
  const data = useLayoffData();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [dateFilter, setDateFilter] = useState("YTD");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  if (data.length === 0) {
    return <div>Loading...</div>;
  }

  const filteredData = data.filter((item) => {
    const matchesKeyword = item.company
      .toLowerCase()
      .includes(searchKeyword.toLowerCase());

    const matchesDate = (() => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= endDate;
    })();

    return matchesKeyword && matchesDate;
  });

  const totalLayoffs = filteredData.reduce((sum, item) => sum + item.laidOff, 0);
  const totalCompanies = filteredData.length;
  const averageLayoffsPerCompany = Math.round(
    totalLayoffs / (totalCompanies || 1)
  );
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
                    <h2 className="text-2xl mb-2">US Layoff Data Overview (2020 - Present)</h2>
                    <p className="text-gray-600 mb-6">Data from 2020 to the present showing the number of layoffs across various companies.</p>

                    <div className="flex justify-center mb-6">
                      <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="border border-gray-300 rounded-md px-4 py-2"
                      >
                        <option value="YTD">Year to Date (YTD)</option>
                        <option value="2023">2023</option>
                        <option value="2024">2024</option>
                        <option value="All">All Years</option>
                      </select>
                    </div>

                    <div className="flex justify-center mb-6">
                      <ReactDatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        className="border border-gray-300 rounded-md px-4 py-2"
                      />
                      <ReactDatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        className="border border-gray-300 rounded-md px-4 py-2 ml-4"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                      <KpiCard title="Total Laid Off" value={totalLayoffs} />
                      <KpiCard title="Total Companies with Layoffs" value={totalCompanies} />
                      <KpiCard title="Average Layoffs per Company" value={averageLayoffsPerCompany} />
                      <KpiCard
                        title="Largest Layoff Event"
                        value={largestLayoffEvent.laidOff}
                        note={`${largestLayoffEvent.company} on ${new Date(largestLayoffEvent.date).toLocaleDateString()}`}
                      />
                    </div>

                    <div className="w-5/5 mx-auto">
                      <LayoffTable data={filteredData} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                      <div className="col-span-3 mt-8">
                        <Suspense fallback={<div>Loading Bar Chart...</div>}>
                          <LayoffTop10PieChart data={filteredData} />
                        </Suspense>
                      </div>
                      <div className="col-span-3">
                        <Suspense fallback={<div>Loading Time Series...</div>}>
                          <LayoffMonthlyTimeSeries rawData={filteredData} />
                        </Suspense>
                      </div>
                    </div>
                  </div>
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
