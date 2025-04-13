import { TableProps } from "@/types/table";
import { JSX } from "react";

const Table = <T,>({ data, headers }: TableProps<T>): JSX.Element => {
  return (
    <table className="table-auto w-full text-left border-collapse">
      <thead className="bg-gray-100 sticky top-0">
        <tr>
          {headers.map((header) => (
            <th
              key={String(header.accessor)}
              className="border px-4 py-2 font-semibold"
            >
              {header.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex} className="hover:bg-gray-50">
            {headers.map((header) => {
              const cellValue = row[header.accessor];
              return (
                <td key={String(header.accessor)} className="border px-4 py-2">
                  {header.render
                    ? header.render(cellValue, row)
                    : header.accessor === "date" && cellValue instanceof Date
                    ? new Date(cellValue).toLocaleDateString()
                    : String(cellValue)}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
