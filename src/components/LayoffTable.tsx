import { Header } from "@/types/table";
import { getTableData, generateFile } from "@/lib/table";
import { LayoffData, useLayoffData } from "../hooks/useLayoffData";
import { Download, Search } from "lucide-react"; // Import the search icon
import { Button } from "./ui/button";
import Table from "./ui/table";

const LayoffTable = () => {
  const data = useLayoffData(); // Fetch the CSV data using the custom hook

  if (data.length === 0) {
    return <div>Loading...</div>; // Loading state while the data is being fetched
  }

  const headers: Header<LayoffData>[] = [
    {
      name: "Company",
      accessor: "company",
    },
    {
      name: "City",
      accessor: "headquarters",
    },
    {
      name: "Laid Off",
      accessor: "laidOff",
    },
    {
      name: "Date",
      accessor: "date",
    },
    {
      name: "Google",
      accessor: "company",
      render: (_, row) => (
        <a
          href={`https://www.google.com/search?q=${encodeURIComponent(
            `${row.company} ${row.headquarters} layoffs`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 flex items-center justify-center"
        >
          <Search className="w-5 h-5" />
        </a>
      ),
      csv: (row) =>
        `https://www.google.com/search?q=${encodeURIComponent(
          `${row.company} ${row.headquarters} layoffs`
        )}`,
    },
  ];

  return (
    <>
      <div className="w-full flex justify-end">
        <Button
          type="button"
          onClick={() => generateFile(getTableData(data, headers), "Trendboard", "csv")}
        >
          <Download className="w-5 h-5 stroke-primary-foreground" /> CSV
        </Button>
        <Button
          type="button"
          onClick={() => generateFile(getTableData(data, headers), "Trendboard", "excel")}
        >
          <Download className="w-5 h-5 stroke-primary-foreground" /> Excel
        </Button>
      </div>
      <div className="table-container my-4">
        <div
          className="overflow-x-auto"
          style={{ maxHeight: "300px", overflowY: "auto" }}
        >
          <Table data={data} headers={headers} />
        </div>
      </div>
    </>
  );
};

export default LayoffTable;
