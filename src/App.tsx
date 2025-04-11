import React, { Suspense } from "react";
import LayoffTable from "./components/LayoffTable";
import { useLayoffData } from "./hooks/useLayoffData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


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

  return (
    <div className="font-sans">
      <nav className="w-full bg-white shadow-md py-4 px-6 sticky top-0 z-10 flex items-center justify-between">
        <h2 className="text-lg font-bold tracking-wide">📊 Trendboard</h2>
        <ul className="flex space-x-6 text-sm">
          <li className="hover:text-blue-600 cursor-pointer">Home</li>
          <li className="hover:text-blue-600 cursor-pointer">About</li>
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

      <Tabs defaultValue="layoff" className="">
        <TabsList>
          <TabsTrigger value="layoff">Layoffs Tracker</TabsTrigger>
        </TabsList>
        <TabsContent value="layoff">
          <div className="p-8 text-center">
            <div className="w-4/5 mx-auto">
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
        <TabsContent value="password">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
}

export default App;
