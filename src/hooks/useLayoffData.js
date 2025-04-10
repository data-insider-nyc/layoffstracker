import { useEffect, useState } from "react";
import Papa from "papaparse";

export const useLayoffData = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/trendboard/data/layoffs.csv")
      .then((res) => res.text())
      .then((csv) => {
        const parsed = Papa.parse(csv, {
          header: true,
          skipEmptyLines: true,
        }).data;
        const cleaned = parsed
          .map((row) => ({
            ...row,
            company: row["Company"],
            date: row["Date"],
            laidOff: Number(row["# Laid Off"]?.replace(/,/g, "")) || 0,
            industry: row["Industry"],
            country: row["Country"],
          }))
          .filter((row) => row.date && row.laidOff > 0);

        setData(cleaned);
      });
  }, []);

  console.log("Layoff data loaded:", data); // Log the loaded data

  return data;
};
