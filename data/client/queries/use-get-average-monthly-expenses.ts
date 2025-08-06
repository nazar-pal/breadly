import { toCompilableQuery } from '@powersync/drizzle-driver'
import { useQuery } from '@powersync/react-native'
import { endOfYear, getMonth, startOfYear } from 'date-fns'
import { and, eq, gte, lte } from 'drizzle-orm'
import { transactions } from '../db-schema'
import { db } from '../powersync/system'

/**
 * Hook to calculate the average monthly expense amount for the current year
 *
 * @param userId - The user ID to filter transactions
 * @returns Object containing averageMonthlyExpense, isLoading state, and other query metadata
 */
export function useGetAverageMonthlyExpenses({ userId }: { userId: string }) {
  // Get current year boundaries
  const now = new Date()
  const yearStart = startOfYear(now)
  const yearEnd = endOfYear(now)

  // Query for all expense transactions in the current year
  const query = db.query.transactions.findMany({
    where: and(
      eq(transactions.userId, userId),
      eq(transactions.type, 'expense'),
      gte(transactions.txDate, yearStart),
      lte(transactions.txDate, yearEnd)
    ),
    columns: {
      amount: true,
      txDate: true
    }
  })

  const result = useQuery(toCompilableQuery(query))

  // Process the data to calculate monthly totals and averages
  let averageMonthlyExpense = 0
  let currentYearTotal = 0
  const monthlyTotals = Array(12).fill(0)

  if (!result.isLoading && result.data) {
    // Group transactions by month and sum amounts
    result.data.forEach(transaction => {
      const transactionDate = new Date(transaction.txDate)
      const month = getMonth(transactionDate) // 0-based month index
      const amount = Number(transaction.amount)

      monthlyTotals[month] += amount
      currentYearTotal += amount
    })

    // Determine how many months have elapsed in the current year (including the current month)
    const currentMonth = getMonth(now)
    const monthsElapsed = currentMonth + 1 // getMonth is 0-based, so add 1

    // Calculate average, avoiding division by zero
    averageMonthlyExpense =
      monthsElapsed > 0 ? currentYearTotal / monthsElapsed : 0
  }

  return {
    ...result,
    averageMonthlyExpense,
    currentYearTotal,
    monthlyTotals
  }
}
