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
        start: startOfDay(currentDate),
        end: endOfDay(currentDate)
      }

    case 'week':
      return {
        start: startOfWeek(currentDate, { weekStartsOn: 1 }),
        end: endOfWeek(currentDate, { weekStartsOn: 1 })
      }

    case 'month':
      return {
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate)
      }

    case 'year':
      return {
        start: startOfYear(currentDate),
        end: endOfYear(currentDate)
      }

    // TODO: Review this
    case 'alltime':
      return {
        start: new Date(2020, 0, 1), // Arbitrary start date
        end: new Date()
      }

    default:
      return {
        start: startOfWeek(currentDate, { weekStartsOn: 1 }),
        end: endOfWeek(currentDate, { weekStartsOn: 1 })
      }
  }
}
