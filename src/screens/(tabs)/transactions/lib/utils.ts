import type { DateGroup, Transaction } from './types'

export function getDateRanges() {
  const now = new Date()

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  return { today, tomorrow, yesterday }
}

function formatDateKey(date: Date): string {
  return date.toISOString().split('T')[0] // YYYY-MM-DD
}

function formatDateLabel(date: Date): string {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const txDate = new Date(date)
  txDate.setHours(0, 0, 0, 0)

  if (txDate.getTime() === today.getTime()) {
    return 'Today'
  }

  if (txDate.getTime() === yesterday.getTime()) {
    return 'Yesterday'
  }

  // Check if it's this year
  const isThisYear = txDate.getFullYear() === today.getFullYear()

  if (isThisYear) {
    return txDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  return txDate.toLocaleDateString('en-US', {
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
