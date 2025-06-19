import { toCompilableQuery } from '@powersync/drizzle-driver'
import { useQuery } from '@powersync/react-native'
import { and, eq, gte, lte, sum } from 'drizzle-orm'
import { transactions } from '../schema/table_7_transactions'
import { db } from '../system'
import { categories, CATEGORY_TYPE } from './../schema/table_4_categories'

export function useGetCategories({
  userId,
  type,
  transactionsFrom,
  transactionsTo
}: {
  userId: string
  type: (typeof CATEGORY_TYPE)[number]
  transactionsFrom?: Date
  transactionsTo?: Date
}) {
  const query = db.query.categories.findMany({
    where: and(eq(categories.userId, userId), eq(categories.type, type)),
    with: {
      budgets: true,
      transactions: {
        where: and(
          eq(transactions.userId, userId),
          eq(transactions.type, type),
          transactionsFrom
            ? gte(transactions.txDate, transactionsFrom)
            : undefined,
          transactionsTo ? lte(transactions.txDate, transactionsTo) : undefined
        )
      }
    }
  })

  const result = useQuery(toCompilableQuery(query))

  return result
}

export function useSumTransactions({
  userId,
  type,
  transactionsFrom,
  transactionsTo
}: {
  userId: string
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
