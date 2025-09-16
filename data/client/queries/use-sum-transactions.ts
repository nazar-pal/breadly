import { db } from '@/system/powersync/system'
import { toCompilableQuery } from '@powersync/drizzle-driver'
import { useQuery } from '@powersync/react-native'
import { and, eq, gte, lte, sum } from 'drizzle-orm'
import { CATEGORY_TYPE, transactions } from '../db-schema'

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
      totalAmount: sum(transactions.amount),
      currencyId: transactions.currencyId
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
    .groupBy(transactions.currencyId)

  const result = useQuery(toCompilableQuery(query))

  return result
}
