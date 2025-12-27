import { toDateString } from '@/lib/utils'
import { addDays, isToday, isYesterday, startOfToday, subDays } from 'date-fns'
import type { DateGroup, Transaction } from './types'

export function getDateRanges() {
  return {
    today: startOfToday(),
    tomorrow: addDays(startOfToday(), 1),
    yesterday: subDays(startOfToday(), 1)
  }
}

function formatDateKey(date: Date): string {
  // Use toDateString to safely convert to 'YYYY-MM-DD' without timezone shifts
  return toDateString(date)
}

function formatDateLabel(date: Date): string {
  if (isToday(date)) {
    return 'Today'
  }

  if (isYesterday(date)) {
    return 'Yesterday'
  }

  // Check if it's this year
  const today = startOfToday()
  const isThisYear = date.getFullYear() === today.getFullYear()

  if (isThisYear) {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

export function groupTransactionsByDate(
  transactions: Transaction[]
): DateGroup[] {
  const groups = new Map<string, DateGroup>()

  for (const tx of transactions) {
    const key = formatDateKey(tx.txDate)

    if (!groups.has(key)) {
      groups.set(key, {
        key,
        label: formatDateLabel(tx.txDate),
        transactions: []
      })
    }

    groups.get(key)!.transactions.push(tx)
  }

  // Convert to array and sort by date (newest first)
  return Array.from(groups.values()).sort((a, b) => b.key.localeCompare(a.key))
}
