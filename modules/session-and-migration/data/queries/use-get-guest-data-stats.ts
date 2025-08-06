import { categories } from '@/lib/powersync/schema/table_4_categories'
import { budgets } from '@/lib/powersync/schema/table_5_budgets'
import { accounts } from '@/lib/powersync/schema/table_6_accounts'
import { transactions } from '@/lib/powersync/schema/table_7_transactions'
import { attachments } from '@/lib/powersync/schema/table_8_attachments'
import { db } from '@/lib/powersync/system'
import { toCompilableQuery } from '@powersync/drizzle-driver'
import { useQuery } from '@powersync/react-native'
import { count, eq } from 'drizzle-orm'

export type GuestDataStats = {
  categories: number
  accounts: number
  transactions: number
  budgets: number
  attachments: number
  total: number
  hasData: boolean
}

/**
 * Hook to get guest data statistics
 * Returns counts for all data types and computed values for easy UI usage
 *
 * @param userId - The user ID to check for data
 * @returns Object containing counts, loading state, and other query metadata
 */
export function useGetGuestDataStats({ userId }: { userId: string }) {
  // Query for categories count
  const categoriesQuery = db
    .select({
      count: count()
    })
    .from(categories)
    .where(eq(categories.userId, userId))

  // Query for accounts count
  const accountsQuery = db
    .select({
      count: count()
    })
    .from(accounts)
    .where(eq(accounts.userId, userId))

  // Query for transactions count
  const transactionsQuery = db
    .select({
      count: count()
    })
    .from(transactions)
    .where(eq(transactions.userId, userId))

  // Query for budgets count
  const budgetsQuery = db
    .select({
      count: count()
    })
    .from(budgets)
    .where(eq(budgets.userId, userId))

  // Query for attachments count
  const attachmentsQuery = db
    .select({
      count: count()
    })
    .from(attachments)
    .where(eq(attachments.userId, userId))

  const categoriesResult = useQuery(toCompilableQuery(categoriesQuery))
  const accountsResult = useQuery(toCompilableQuery(accountsQuery))
  const transactionsResult = useQuery(toCompilableQuery(transactionsQuery))
  const budgetsResult = useQuery(toCompilableQuery(budgetsQuery))
  const attachmentsResult = useQuery(toCompilableQuery(attachmentsQuery))

  const isLoading =
    categoriesResult.isLoading ||
    accountsResult.isLoading ||
    transactionsResult.isLoading ||
    budgetsResult.isLoading ||
    attachmentsResult.isLoading

  // Process the data to calculate stats
  let stats: GuestDataStats = {
    categories: 0,
    accounts: 0,
    transactions: 0,
    budgets: 0,
    attachments: 0,
    total: 0,
    hasData: false
  }

  if (!isLoading) {
    const categoriesCount = categoriesResult.data?.[0]?.count || 0
    const accountsCount = accountsResult.data?.[0]?.count || 0
    const transactionsCount = transactionsResult.data?.[0]?.count || 0
    const budgetsCount = budgetsResult.data?.[0]?.count || 0
    const attachmentsCount = attachmentsResult.data?.[0]?.count || 0

    const total =
      categoriesCount +
      accountsCount +
      transactionsCount +
      budgetsCount +
      attachmentsCount

    stats = {
      categories: categoriesCount,
      accounts: accountsCount,
      transactions: transactionsCount,
      budgets: budgetsCount,
      attachments: attachmentsCount,
      total,
      hasData: total > 0
    }
  }

  return {
    ...categoriesResult,
    data: stats,
    isLoading
  }
}
