// useLayoffData.ts (or useLayoffData.tsx)
import { useState, useEffect } from 'react';
import Papa from 'papaparse';

// Define types for the data
interface LayoffData {
  company: string;
  laidOff: number;
}

export const useLayoffData = (): LayoffData[] => {
  const [data, setData] = useState<LayoffData[]>([]);

  useEffect(() => {
    fetch('/trendboard/data/layoffs.csv')
      .then(res => res.text())
      .then(csv => {
        const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true }).data;
        const cleaned = parsed
          .filter((row: any) => row['Company'] && row['# Laid Off'])
          .map((row: any) => ({
            company: row['Company'],
            laidOff: Number(row['# Laid Off'].replace(/,/g, '')) || 0
          }));
        setData(cleaned);
      });
  }, []);

  console.log('Layoff data:', data); // Log the data to the console for debugging

  return data;
};
