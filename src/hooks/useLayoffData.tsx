import { useEffect, useState } from 'react'
import Papa from 'papaparse'

export interface LayoffData {
  company: string
  headquarter?: string
  laidOff: number
  date: Date
}

// Normalize company name variants to a canonical name
const COMPANY_NAME_MAP: Record<string, string> = {
  'Amazon.com': 'Amazon',
  'Meta Platforms': 'Meta',
  'HP Inc.': 'HP',
  'Paypal': 'PayPal',
  'Booking.com': 'Booking Holdings',
  'Uber Freight': 'Uber',
  'Wayfair ': 'Wayfair',
  'Twitter': 'X (Twitter)',
}

const normalizeCompany = (name: string): string =>
  COMPANY_NAME_MAP[name.trim()] ?? name.trim()

export const useLayoffData = (): LayoffData[] => {
  const [data, setData] = useState<LayoffData[]>([])

  useEffect(() => {
    fetch('/layoffstracker/data/layoffs.csv')
      .then((res) => res.text())
      .then((csv) => {
        const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true }).data as Array<{
          Company?: string
          headquarter?: string
          layoff?: string
          Date?: string
        }>

        const cleaned: LayoffData[] = parsed
          .filter(row => row.Company && row.layoff && row.Date)
          .map(row => {
            const company = normalizeCompany(String(row.Company))
            const headquarter = row.headquarter ? String(row.headquarter).trim() : undefined
            const layoff = parseInt(String(row.layoff).trim(), 10)
            const date = new Date(String(row.Date).trim())

            return {
              company,
              headquarter,
              laidOff: isNaN(layoff) ? 0 : layoff,
              date,
            }
          })
          .filter(row =>
            row.laidOff > 0 &&
            !isNaN(row.date.getTime()) &&
            (!row.headquarter || !row.headquarter.includes("Non-U.S"))
          )
          .sort((a, b) => b.date.getTime() - a.date.getTime())

        setData(cleaned)
      })
      .catch((error) => {
        console.error('Failed to load CSV:', error)
      })
  }, [])

  return data
}