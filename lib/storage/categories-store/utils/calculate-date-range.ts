import { DateRange, DateRangeMode } from '@/lib/storage/categories-store'
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

// Helper function to calculate date range based on mode and current date
export const calculateDateRange = (
  mode: Exclude<DateRangeMode, 'custom'>,
  currentDate: Date
): DateRange => {
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

    case 'alltime':
      return {
        mode,
        start: null,
        end: new Date()
      }

    default:
      return {
        mode,
        start: startOfWeek(currentDate, { weekStartsOn: 1 }),
        end: endOfWeek(currentDate, { weekStartsOn: 1 })
      }
  }
}
