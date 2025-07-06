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

export const createPeriodDateRange = (
  mode: PeriodDateRange['mode'],
  date: Date
): PeriodDateRange => {
  switch (mode) {
    case 'day':
      return { mode, start: startOfDay(date), end: endOfDay(date) }
    case 'week':
      return {
        mode,
        start: startOfWeek(date, { weekStartsOn: 1 }),
        end: endOfWeek(date, { weekStartsOn: 1 })
      }
    case 'month':
      return { mode, start: startOfMonth(date), end: endOfMonth(date) }
    case 'year':
      return { mode, start: startOfYear(date), end: endOfYear(date) }
    default:
      throw new Error(`Unsupported mode: ${mode}`)
  }
}
