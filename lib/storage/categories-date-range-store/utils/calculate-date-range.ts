import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear
} from 'date-fns'
import type { PeriodDateRange } from '../types'

// More descriptive function name
export const createPeriodDateRange = (
  mode: PeriodDateRange['mode'],
  referenceDate: Date
): PeriodDateRange => {
  // Create a new date to avoid mutating the input
  const date = new Date(referenceDate)

  switch (mode) {
    case 'day':
      return {
        mode,
        start: startOfDay(date),
        end: endOfDay(date)
      }

    case 'week':
      return {
        mode,
        start: startOfWeek(date, { weekStartsOn: 1 }),
        end: endOfWeek(date, { weekStartsOn: 1 })
      }

    case 'month':
      return {
        mode,
        start: startOfMonth(date),
        end: endOfMonth(date)
      }

    case 'year':
      return {
        mode,
        start: startOfYear(date),
        end: endOfYear(date)
      }

    default: {
      const _exhaustiveCheck: never = mode
      throw new Error(`Unhandled date range mode: ${String(_exhaustiveCheck)}`)
    }
  }
}

// Legacy function name for backward compatibility
export const calculateDateRange = createPeriodDateRange
