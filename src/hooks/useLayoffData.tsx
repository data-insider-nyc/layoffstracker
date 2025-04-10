import { useEffect, useState } from 'react'
import Papa from 'papaparse'

export interface LayoffData {
  company: string
  laidOff: number
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
        }>

        const cleaned: LayoffData[] = parsed
          .filter(row => row.Company && row.layoffs) // Ensure required fields exist
          .map(row => {
            const company = String(row.Company).trim()
            const layoffs = parseInt(String(row.layoffs).trim(), 10)

            return {
              company,
              laidOff: isNaN(layoffs) ? 0 : layoffs, // Handle invalid numbers
            }
          })
          .filter(row => row.laidOff > 0) // Final validation

        setData(cleaned)
      })
      .catch((error) => {
        console.error('Failed to load CSV:', error)
      })
  }, [])

  console.log('Layoff data:', data)

  return data
}
