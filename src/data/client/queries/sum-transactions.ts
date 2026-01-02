import { CATEGORY_TYPE, transactions } from '@/data/client/db-schema'
import { db } from '@/system-v2'
import { and, eq, gte, lte, sum } from 'drizzle-orm'

interface Params {
  userId: string
  categoryId?: string
  type: (typeof CATEGORY_TYPE)[number]
  transactionsFrom?: Date
  transactionsTo?: Date
}

export function sumTransactions({
  userId,
  categoryId,
  type,
  transactionsFrom,
  transactionsTo
}: Params) {
  return db
    .select({
      totalAmount: sum(transactions.amount),
      currencyId: transactions.currencyId
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.userId, userId),
        eq(transactions.type, type),
        ...(categoryId ? [eq(transactions.categoryId, categoryId)] : []),
        ...(transactionsFrom
          ? [gte(transactions.txDate, transactionsFrom)]
          : []),
        ...(transactionsTo ? [lte(transactions.txDate, transactionsTo)] : [])
      )
    )
    .groupBy(transactions.currencyId)
}

export type SumTransactionsResult = Awaited<ReturnType<typeof sumTransactions>>
export type SumTransactionsResultItem = SumTransactionsResult[number]
