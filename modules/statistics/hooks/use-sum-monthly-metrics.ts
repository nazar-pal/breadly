import { CATEGORY_TYPE } from '@/data/client/db-schema'
import { useSumTransactions } from '@/data/client/queries'
import { endOfMonth, startOfMonth, subMonths } from 'date-fns'

/**
 * Hook to calculate monthly transaction totals for income or expense
 *
 * @param userId - The user ID to filter transactions
 * @param type - Transaction type ('income' or 'expense')
 * @param period - Time period to calculate ('thisMonth' or 'lastMonth')
 * @returns Object containing total amount and loading state
 */
export function useSumMonthlyMetrics({
  userId,
  type,
  period = 'thisMonth'
}: {
  userId: string
  type: (typeof CATEGORY_TYPE)[number]
  period?: 'thisMonth' | 'lastMonth'
}) {
  const now = new Date()
  const isLastMonth = period === 'lastMonth'
  const targetDate = isLastMonth ? subMonths(now, 1) : now

  const { data, isLoading } = useSumTransactions({
    userId,
    type,
    transactionsFrom: startOfMonth(targetDate),
    transactionsTo: isLastMonth ? endOfMonth(targetDate) : now
  })

  const total = data?.[0]?.totalAmount ? Number(data[0].totalAmount) : 0

  return {
    total,
    isLoading
  }
}
