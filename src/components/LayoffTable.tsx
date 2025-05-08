import React, { useState } from "react";
import { Search } from "lucide-react"; // Import the search icon
import { companyLogos } from "../data/companyLogos";

interface LayoffTableProps {
  data: Array<Record<string, any>>; // Define the type for the data prop
}

const LayoffTable: React.FC<LayoffTableProps> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const rowsPerPage = 10; // Number of rows per page

  if (data.length === 0) {
    return <div>Loading...</div>; // Loading state while the data is being fetched
  }

  // Get the headers dynamically from the first row of CSV and add a new "Google Search" column
  const headers = ["date", ...Object.keys(data[0]).filter((key) => key !== "date"), "googleSearch"];

  // Utility function to convert strings to camel case
  const toCamelCase = (str: string) => {
    return str
      .replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace("-", "").replace("_", ""))
      .replace(/^[a-z]/, (group) => group.toUpperCase());
  };

  // Function to render table cell content based on the header
  const renderCellContent = (header: string, row: Record<string, any>) => {
    switch (header) {
      case "company":
        return (
          <div className="flex items-center">
            <img
              src={
                row.company.includes("Department")
                  ? "https://logo.clearbit.com/doge.gov"
                  : row.company === "MITRE"
                  ? "https://logo.clearbit.com/mitre.org"
                  : `https://logo.clearbit.com/${row.company.toLowerCase().replace(/\s+/g, "")}.com`
              }
              alt={`${row.company} logo`}
              className="w-6 h-6 mr-2"
              onError={(e) => (e.currentTarget.style.display = "none")} // Hide image if not found
            />
            {row.company}
          </div>
        );
      case "date":
        return new Date(row[header]).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      case "googleSearch":
        return (
          <a
            href={`https://www.google.com/search?q=${encodeURIComponent(
              `${row.company} ${row.headquarters || "US"} layoffs`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 3h7m0 0v7m0-7L10 14m-4 7h11a2 2 0 002-2V10m-7 11H5a2 2 0 01-2-2V7a2 2 0 012-2h7"
              />
            </svg>
          </a>
        );
      case "laidOff":
        return row[header]?.toLocaleString() || "N/A";
      case "headquarter": // Handle missing location data
        return row[header] || "US";
      default:
        return row[header];
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const paginatedData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="table-container my-4">
      <div
        className="overflow-x-auto"
      >
        <table className="table-auto w-full text-left border-collapse">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
                {headers.map((header) => (
                <th
                key={header}
                className={`border px-4 py-2 font-semibold ${header === "googleSearch" ? "w-12" : ""}`}
                style={
                  header === "googleSearch"
                  ? { width: "50px" }
                  : header === "date"
                  ? { width: "160px" }
                  : undefined
                }
                >
                {header === "googleSearch"
                ? "Link"
                : header === "headquarter" // Rename "headquarters" to "City"
                ? "Location"
                : toCamelCase(header)}
                </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {headers.map((header) => (
                  <td key={header} className="border px-4 py-2">
                    {renderCellContent(header, row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 border rounded ${
            currentPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white text-blue-600"
          }`}
        >
          Previous
        </button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 border rounded ${
            currentPage === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white text-blue-600"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default LayoffTable;
