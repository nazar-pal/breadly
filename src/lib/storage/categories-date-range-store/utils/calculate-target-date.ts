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

export const calculateTargetDate = (
  currentDate: Date,
  mode: PeriodDateRange['mode'],
  direction: NavigationDirection
): Date => {
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
    default:
      throw new Error(`Unsupported mode: ${mode}`)
  }
}
