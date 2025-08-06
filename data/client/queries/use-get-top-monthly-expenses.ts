import { toCompilableQuery } from '@powersync/drizzle-driver'
import { useQuery } from '@powersync/react-native'
import { endOfMonth, startOfMonth } from 'date-fns'
import { and, desc, eq, gte, lte } from 'drizzle-orm'
import { transactions } from '../db-schema'
import { db } from '../powersync/system'

interface UseGetTopMonthlyExpensesParams {
  userId: string
  month?: Date
  limit?: number
}

/**
 * Hook to get the top expense transactions for a specific month
 *
 * @param userId - The user ID to filter transactions
 * @param month - The month to get expenses for (defaults to current month)
 * @param limit - Maximum number of transactions to return (defaults to 5)
 * @returns Object containing the top expenses data and loading state
 */
export function useGetTopMonthlyExpenses({
  userId,
  month,
  limit = 5
}: UseGetTopMonthlyExpensesParams) {
  // Get month boundaries
  const targetMonth = month || new Date()
  const monthStart = startOfMonth(targetMonth)
  const monthEnd = endOfMonth(targetMonth)

  const query = db.query.transactions.findMany({
    where: and(
      eq(transactions.userId, userId),
      eq(transactions.type, 'expense'),
      gte(transactions.txDate, monthStart),
      lte(transactions.txDate, monthEnd)
    ),
    with: {
      category: {
        with: {
          parent: true // Include parent category information
        }
      },
      account: true,
      currency: true
    },
    orderBy: [desc(transactions.amount)], // Order by amount descending
    limit
  })

  const result = useQuery(toCompilableQuery(query))

  return result
}
