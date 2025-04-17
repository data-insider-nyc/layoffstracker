import { useEffect, useState } from 'react'
import Papa from 'papaparse'
import { Rows } from 'lucide-react'
import { log } from 'console'

export interface LayoffData {
  company: string
  headquarter?: string
  laidOff: number
  date: Date // Updated to use Date type
}

export const useLayoffData = (): LayoffData[] => {
  const [data, setData] = useState<LayoffData[]>([])

  useEffect(() => {
    fetch('/trendboard/data/layoffs.csv')
      .then((res) => res.text())
      .then((csv) => {
        const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true }).data as Array<{
          Company?: string
          headquarter?: string
          layoff?: string
          Date?: string // Corrected to match the CSV column name
        }>

        const cleaned: LayoffData[] = parsed
          .filter(row => row.Company && row.layoff && row.Date) // Ensure required fields exist
          .map(row => {
            const company = String(row.Company).trim()
            const headquarter = row.headquarter ? String(row.headquarter).trim() : undefined
            const layoff = parseInt(String(row.layoff).trim(), 10)
            const date = new Date(String(row.Date).trim()) // Corrected to use "Date" from the CSV

            return {
              company,
              headquarter,
              laidOff: isNaN(layoff) ? 0 : layoff, // Handle invalid numbers
              date,
            }
          })
          .filter(row => 
            row.laidOff > 0 && 
            !isNaN(row.date.getTime()) && 
            (!row.headquarter || !row.headquarter.includes("Non-U.S")) // Exclude "Non-U.S" headquarter
          ) // Final validation
          // .filter(row => !row.company.toLowerCase().includes("department")) // Exclude companies with "department"
          .sort((a, b) => b.date.getTime() - a.date.getTime()) // Sort by date descending

        setData(cleaned)
      })
      .catch((error) => {
        console.error('Failed to load CSV:', error)
      })
  }, [])

  console.log('Layoff data loaded:', data)

  return data
}