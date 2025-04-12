/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Header<T> {
  name: string;
  accessor: keyof T;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  csv?: (row: T) => string;
}

/**
 * @desc Get table data as JSON
 */
export const getTableData = <T>(data: T[], headers: Header<T>[]) => {
  return data.map((record) => {
    const obj: Record<string, string> = {};
    headers.forEach(({ name, accessor, csv }) => {
      if (csv) {
        obj[name] = csv(record);
      } else {
        const value = record[accessor];
        obj[name] = String(value ?? "");
      }
    });
    return obj;
  });
};

/**
 * @desc Generate CSV or Excel from given data
 */
export const generateFile = async (
  rows: Record<string, any>[],
  filename: string,
  format: "csv" | "excel"
) => {
  if (!rows || rows.length === 0) return;

  const separator = ";";
  const keys = Object.keys(rows[0]);

  const csvContent = `${keys.join(separator)}\n${rows
    .map((row) =>
      keys
        .map((k) => {
          let cell = row[k] ?? "";

          cell =
            cell instanceof Date
              ? cell.toLocaleString()
              : cell.toString().replace(/"/g, '""');

          return /("|;|\n)/.test(cell) ? `"${cell}"` : cell;
        })
        .join(separator)
    )
    .join("\n")}`;

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
