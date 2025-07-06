import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  subDays,
  subMonths,
  subWeeks,
  subYears
} from 'date-fns'
import type { PeriodDateRange } from '../types'

export type NavigationDirection = 'previous' | 'next'

export const navigateDate = (
  currentDate: Date,
  mode: PeriodDateRange['mode'],
  direction: NavigationDirection
): Date => {
  // Create a new date to avoid mutating the input
  const date = new Date(currentDate)
  const isNext = direction === 'next'

  switch (mode) {
    case 'day':
      return isNext ? addDays(date, 1) : subDays(date, 1)
    case 'week':
      return isNext ? addWeeks(date, 1) : subWeeks(date, 1)
    case 'month':
      return isNext ? addMonths(date, 1) : subMonths(date, 1)
    case 'year':
      return isNext ? addYears(date, 1) : subYears(date, 1)
    default: {
      const _exhaustiveCheck: never = mode
      throw new Error(`Unhandled date range mode: ${String(_exhaustiveCheck)}`)
    }
  }
}

// Legacy function name for backward compatibility
export const navigateDateByMode = navigateDate
