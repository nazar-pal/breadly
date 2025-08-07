import { useSumTransactions } from '@/data/client/queries'
import { useUserSession } from '@/modules/session-and-migration'

/**
 * Hook to get spending data for a category
 * @param categoryId - Category ID to get spending for
 * @returns Spending amount
 */
export function useCategorySpending(categoryId: string) {
  const { userId } = useUserSession()

  const { data: spent } = useSumTransactions({
    userId,
    type: 'expense',
    categoryId
  })

  const spentAmount = spent ? Number(spent[0]?.totalAmount) : 0

  return { spentAmount }
}
