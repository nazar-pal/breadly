import type { DateRangeMode } from '../types'

const modeNames: Record<DateRangeMode, string> = {
  day: 'Day',
  week: 'Week',
  month: 'Month',
  year: 'Year',
  alltime: 'All Time',
  custom: 'Custom Range'
}

export function getModeDisplayName(mode: DateRangeMode) {
  return modeNames[mode]
}
