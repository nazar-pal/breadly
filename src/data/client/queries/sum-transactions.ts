import { db } from '@/system/powersync/system'
import { and, eq, gte, lte, sum } from 'drizzle-orm'
import { CATEGORY_TYPE, transactions } from '../db-schema'

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
        categoryId ? eq(transactions.categoryId, categoryId) : undefined,
        eq(transactions.type, type),
        transactionsFrom
          ? gte(transactions.txDate, transactionsFrom)
          : undefined,
        transactionsTo ? lte(transactions.txDate, transactionsTo) : undefined
      )
    )
    .groupBy(transactions.currencyId)
}

export type SumTransactionsResult = Awaited<ReturnType<typeof sumTransactions>>
export type SumTransactionsResultItem = SumTransactionsResult[number]
