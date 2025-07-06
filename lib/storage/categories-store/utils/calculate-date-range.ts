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
import type { DateRange } from '../types'

type AllowedDateRange = Exclude<
  DateRange,
  { mode: 'custom' } | { mode: 'alltime' }
>
type AllowedDateRangeMode = AllowedDateRange['mode']

// Helper function to calculate date range based on mode and current date
export const calculateDateRange = (
  mode: AllowedDateRangeMode,
  currentDate: Date
): AllowedDateRange => {
  switch (mode) {
    case 'day':
      return {
        mode,
        start: startOfDay(currentDate),
        end: endOfDay(currentDate)
      }

    case 'week':
      return {
        mode,
        start: startOfWeek(currentDate, { weekStartsOn: 1 }),
        end: endOfWeek(currentDate, { weekStartsOn: 1 })
      }

    case 'month':
      return {
        mode,
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate)
      }

    case 'year':
      return {
        mode,
        start: startOfYear(currentDate),
        end: endOfYear(currentDate)
      }

    /* istanbul ignore next */
    default: {
      throw new Error(`Unhandled date range mode: ${String(mode)}`)
    }
  }
}
