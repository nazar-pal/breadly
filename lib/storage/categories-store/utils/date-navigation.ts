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
import type { DateRangeMode } from '../types'

export const navigateDateByMode = (
  currentDate: Date,
  mode: Exclude<DateRangeMode, 'custom' | 'alltime'>,
  direction: 'previous' | 'next'
): Date => {
  const isNext = direction === 'next'

  switch (mode) {
    case 'day':
      return isNext ? addDays(currentDate, 1) : subDays(currentDate, 1)
    case 'week':
      return isNext ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1)
    case 'month':
      return isNext ? addMonths(currentDate, 1) : subMonths(currentDate, 1)
    case 'year':
      return isNext ? addYears(currentDate, 1) : subYears(currentDate, 1)
    /* istanbul ignore next */
    default: {
      throw new Error(`Unhandled date range mode: ${String(mode)}`)
    }
  }
}
