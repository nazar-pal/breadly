import { transactions } from '@/data/client/db-schema'
import { db } from '@/system/powersync/system'
import { toCompilableQuery } from '@powersync/drizzle-driver'
import { useQuery } from '@powersync/react-native'
import { and, count, eq, or } from 'drizzle-orm'

export function useCheckAccountDependencies({
  userId,
  accountId
}: {
  userId: string
  accountId: string
}) {
  const txCountQuery = db
    .select({ count: count() })
    .from(transactions)
    .where(
      and(
        eq(transactions.userId, userId),
        or(
          eq(transactions.accountId, accountId),
          eq(transactions.counterAccountId, accountId)
        )
      )
    )

  const txCountResult = useQuery(toCompilableQuery(txCountQuery))

  const isLoading = txCountResult.isLoading
  const transactionCount = txCountResult.data?.[0]?.count || 0
  const hasTransactions = !isLoading && transactionCount > 0
  const canDelete = !isLoading && !hasTransactions

  return {
    isLoading,
    hasTransactions,
    canDelete,
    transactionCount
  }
}
