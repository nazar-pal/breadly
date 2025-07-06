import { format } from 'date-fns'
import type { DateRange } from '../types'

export const formatDateRange = (dateRange: DateRange): string => {
  if (dateRange.mode === 'alltime' || !dateRange.start) {
    return 'All Time'
  }

  if (dateRange.mode === 'day') {
    return format(dateRange.start, 'MMM d, yyyy')
  }

  if (dateRange.start.getFullYear() === dateRange.end.getFullYear()) {
    if (dateRange.start.getMonth() === dateRange.end.getMonth()) {
      return `${format(dateRange.start, 'MMM d')} - ${format(dateRange.end, 'd, yyyy')}`
    }
    return `${format(dateRange.start, 'MMM d')} - ${format(dateRange.end, 'MMM d, yyyy')}`
  }

  return `${format(dateRange.start, 'MMM d, yyyy')} - ${format(dateRange.end, 'MMM d, yyyy')}`
}
