import { useEffect, useState } from 'react'
import Papa from 'papaparse'

export interface LayoffData {
  company: string
  headquarters?: string
  laidOff: number
  date: Date // Updated to use Date type
}

export const useLayoffData = (): LayoffData[] => {
  const [data, setData] = useState<LayoffData[]>([])

  useEffect(() => {
    fetch('/trendboard/data/layoffs-cleaned.csv')
      .then((res) => res.text())
      .then((csv) => {
        const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true }).data as Array<{
          Company?: string
          HQ?: string
          layoffs?: string
          Date?: string // Corrected to match the CSV column name
        }>

        const cleaned: LayoffData[] = parsed
          .filter(row => row.Company && row.layoffs && row.Date) // Ensure required fields exist
          .map(row => {
            const company = String(row.Company).trim()
            const headquarters = row.HQ ? String(row.HQ).trim() : undefined
            const layoffs = parseInt(String(row.layoffs).trim(), 10)
            const date = new Date(String(row.Date).trim()) // Corrected to use "Date" from the CSV

            return {
              company,
              headquarters,
              laidOff: isNaN(layoffs) ? 0 : layoffs, // Handle invalid numbers
              date,
            }
          })
          .filter(row => 
            row.laidOff > 0 && 
            !isNaN(row.date.getTime()) && 
            (!row.headquarters || !row.headquarters.includes("Non-U.S")) // Exclude "Non-U.S" headquarters
          ) // Final validation

        setData(cleaned)
      })
      .catch((error) => {
        console.error('Failed to load CSV:', error)
      })
  }, [])

  console.log('Layoff data:', data)

  return data
}