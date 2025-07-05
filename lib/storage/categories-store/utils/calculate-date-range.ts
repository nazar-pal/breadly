import { DateRange, DateRangeMode } from '@/lib/storage/categories-store'
import {
  addDays,
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
  mode: DateRangeMode,
  currentDate: Date,
  customRange?: DateRange | null
): DateRange => {
  switch (mode) {
    case 'day':
      return {
        start: startOfDay(currentDate),
        end: endOfDay(currentDate)
      }

    case '7days':
      return {
        start: startOfDay(currentDate),
        end: endOfDay(addDays(currentDate, 6))
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

    case '30days':
      return {
        start: startOfDay(currentDate),
        end: endOfDay(addDays(currentDate, 29))
      }

    case '365days':
      return {
        start: startOfDay(currentDate),
        end: endOfDay(addDays(currentDate, 364))
      }

    case 'year':
      return {
        start: startOfYear(currentDate),
        end: endOfYear(currentDate)
      }

    case 'alltime':
      return {
        start: new Date(2020, 0, 1), // Arbitrary start date
        end: new Date()
      }

    case 'custom':
      return (
        customRange || {
          start: startOfWeek(currentDate, { weekStartsOn: 1 }),
          end: endOfWeek(currentDate, { weekStartsOn: 1 })
        }
      )

    default:
      return {
        start: startOfWeek(currentDate, { weekStartsOn: 1 }),
        end: endOfWeek(currentDate, { weekStartsOn: 1 })
      }
  }
}
