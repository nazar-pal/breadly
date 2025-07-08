import { toCompilableQuery } from '@powersync/drizzle-driver'
import { useQuery } from '@powersync/react-native'
import { and, eq, gte, lte, sum } from 'drizzle-orm'
import { CATEGORY_TYPE } from '../../schema/table_4_categories'
import { transactions } from '../../schema/table_7_transactions'
import { db } from '../../system'

export function useSumTransactions({
  userId,
  categoryId,
  type,
  transactionsFrom,
  transactionsTo
}: {
  userId: string
  categoryId?: string
  type: (typeof CATEGORY_TYPE)[number]
  transactionsFrom?: Date
  transactionsTo?: Date
}) {
  const query = db
    .select({
      totalAmount: sum(transactions.amount)
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.userId, userId),
        categoryId ? eq(transactions.categoryId, categoryId) : undefined,
        eq(transactions.type, type),
        transactionsFrom
          ? gte(transactions.txDate, transactionsFrom)
          : undefined,
        transactionsTo ? lte(transactions.txDate, transactionsTo) : undefined
      )
    )

  const result = useQuery(toCompilableQuery(query))

  return result
}
