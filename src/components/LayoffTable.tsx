import React, { useState, useEffect } from 'react'
import { useLayoffData } from '../hooks/useLayoffData'

const LayoffTable = () => {
  const data = useLayoffData() // Fetch the CSV data using the custom hook

  if (data.length === 0) {
    return <div>Loading...</div> // Loading state while the data is being fetched
  }

  // Get the headers dynamically from the first row of CSV
  const headers = Object.keys(data[0])

  return (
    <div className="table-container my-4">
      <h2 className="text-center text-xl mb-4">Layoff Data Overview</h2>
      <div className="overflow-x-auto" style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <table className="table-auto w-full text-left border-collapse">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              {headers.map((header) => (
                <th key={header} className="border px-4 py-2 font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {headers.map((header) => (
                  <td key={header} className="border px-4 py-2">
                    {header === 'date' && row[header] instanceof Date
                      ? row[header].toLocaleDateString() // Format Date object as a readable string
                      : row[header]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default LayoffTable
