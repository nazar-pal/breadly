import { toCompilableQuery } from '@powersync/drizzle-driver'
import { useQuery } from '@powersync/react-native'
import { and, asc, eq, gte, lte } from 'drizzle-orm'
import { categories, CATEGORY_TYPE } from '../../schema/table_4_categories'
import { transactions } from '../../schema/table_7_transactions'
import { db } from '../../system'

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
    },
    orderBy: [asc(categories.createdAt)]
  })

  const result = useQuery(toCompilableQuery(query))

  return result
}
