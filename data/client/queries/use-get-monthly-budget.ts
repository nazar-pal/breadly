import { toCompilableQuery } from '@powersync/drizzle-driver'
import { useQuery } from '@powersync/react-native'
import { endOfMonth, startOfMonth } from 'date-fns'
import { and, eq, sum } from 'drizzle-orm'
import { budgets } from '../db-schema'
import { db } from '../powersync/system'

/**
 * Hook to get monthly budget data for the current month
 *
 * @param userId - The user ID to filter budgets
 * @returns Object containing data array with total budget, isLoading state, and other query metadata
 */
export function useGetMonthlyBudget({
  userId,
  startDate = new Date()
}: {
  userId: string
  startDate?: Date
}) {
  // Get current month boundaries
  const monthStart = startOfMonth(startDate)
  const monthEnd = endOfMonth(startDate)

  // Query for total monthly budget amount
  const query = db
    .select({
      totalAmount: sum(budgets.amount)
    })
    .from(budgets)
    .where(
      and(
        eq(budgets.userId, userId),
        eq(budgets.startDate, monthStart),
        eq(budgets.endDate, monthEnd)
      )
    )

  const result = useQuery(toCompilableQuery(query))

  // Extract the total monthly budget from the result
  const totalMonthlyBudget =
    result.data?.[0]?.totalAmount && !result.isLoading
      ? Number(result.data[0].totalAmount)
      : 0

  return {
    ...result,
    totalMonthlyBudget
  }
}
