/* eslint-disable @typescript-eslint/no-explicit-any */
import { Header } from "@/types/table";

/**
 * @desc Get table data as JSON.
 * Utility function to convert an array of data objects into a format suitable for CSV or table rendering.
 * It returns an array of objects where keys are column names and values are strings.
 *
 * @template T - The type of each item in the input data array.
 * @param {T[]} data - Array of data records to transform.
 * @param {Header<T>[]} headers - Array of header definitions. Each header includes a name, an accessor, and an optional CSV formatter function.
 * @returns {Record<string, string>[]} Array of objects formatted for CSV/table output.
 */
export const getTableData = <T>(data: T[], headers: Header<T>[]) => {
  return data.map((record) => {
    // Initialize an empty object to hold the formatted row
    const obj: Record<string, string> = {};

    // Loop through each header configuration
    headers.forEach(({ name, accessor, csv }) => {
      if (csv) {
        // If a custom CSV function is provided, use it to get the value
        obj[name] = csv(record);
      } else {
        // Otherwise, get the value using the accessor and convert it to a string
        const value = record[accessor];
        obj[name] = String(value ?? ""); // Fallback to empty string if value is null/undefined
      }
    });

    // Return the transformed row
    return obj;
  });
};

/**
 * @desc Generate and download a CSV or Excel file from the given data.
 * @param {Record<string, any>[]} rows - Array of row objects (key-value pairs representing table rows)
 * @param {string} filename - The name for the downloaded file
 * @param {"csv" | "excel"} format - File format: "csv" or "excel"
 */
export const generateFile = async (
  rows: Record<string, any>[],
  filename: string,
  format: "csv" | "excel"
) => {
  // Exit early if no data is provided
  if (!rows || rows.length === 0) return;

  const separator = ";";
  const keys = Object.keys(rows[0]); // Use the first row to determine column headers

  const csvContent = `${keys.join(separator)}\n${rows
    .map((row) =>
      keys
        .map((k) => {
          let cell = row[k] ?? "";

          cell =
            cell instanceof Date
              ? cell.toLocaleString()
              : cell.toString().replace(/"/g, '""');

          // Wrap the cell in double quotes if it contains special characters
          return /("|;|\n)/.test(cell) ? `"${cell}"` : cell;
        })
        .join(separator)
    )
    .join("\n")}`; // Join all rows with newline characters

  const type =
    format === "csv" ? "text/csv;charset=utf-8;" : "application/vnd.ms-excel";

  const blob = new Blob([csvContent], { type: type });

  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
