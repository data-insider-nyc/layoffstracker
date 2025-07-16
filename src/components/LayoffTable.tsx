import React, { useState } from "react";

interface LayoffTableProps {
  data: Array<Record<string, any>>; // Define the type for the data prop
  isDarkMode?: boolean;
}

const LayoffTable: React.FC<LayoffTableProps> = ({ data, isDarkMode = false }) => {
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const rowsPerPage = 10; // Number of rows per page

  if (data.length === 0) {
    return <div className="text-gray-900 dark:text-white">Loading...</div>; // Loading state while the data is being fetched
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
            className="text-blue-600 dark:text-blue-400 flex items-center justify-center hover:text-blue-800 dark:hover:text-blue-300"
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
        <table className="table-auto w-full text-left border-collapse bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
          <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0">
            <tr>
                {headers.map((header) => (
                <th
                key={header}
                className={`border border-gray-300 dark:border-gray-600 px-4 py-2 font-semibold text-gray-900 dark:text-white ${header === "googleSearch" ? "w-12" : ""}`}
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
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                {headers.map((header) => (
                  <td key={header} className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-gray-100">
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
          className={`px-4 py-2 border rounded transition-colors duration-150 ${
            currentPage === 1 
              ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed border-gray-300 dark:border-gray-600" 
              : "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600"
          }`}
        >
          Previous
        </button>
        <span className="text-sm text-gray-900 dark:text-white">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 border rounded transition-colors duration-150 ${
            currentPage === totalPages 
              ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed border-gray-300 dark:border-gray-600" 
              : "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default LayoffTable;
