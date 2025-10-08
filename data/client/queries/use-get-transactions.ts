import { useDrizzleQuery } from '@/lib/hooks'
import { db } from '@/system/powersync/system'
import { and, desc, eq, gte, lte } from 'drizzle-orm'
import { transactions } from '../db-schema'

interface UseGetTransactionsParams {
  userId: string
  dateFrom?: Date
  dateTo?: Date
  limit?: number
}

export function useGetTransactions({
  userId,
  dateFrom,
  dateTo,
  limit
}: UseGetTransactionsParams) {
  // Build where conditions
  const whereConditions = [eq(transactions.userId, userId)]

  if (dateFrom) {
    whereConditions.push(gte(transactions.txDate, dateFrom))
  }

  if (dateTo) {
    whereConditions.push(lte(transactions.txDate, dateTo))
  }

  const query = db.query.transactions.findMany({
    where: and(...whereConditions),
    with: {
      category: {
        with: {
          parent: true
        }
      },
      account: true,
      counterAccount: true,
      currency: true,
      transactionAttachments: {
        with: {
          attachment: true
        }
      }
    },
    orderBy: [desc(transactions.txDate)],
    ...(limit && { limit })
  })

  const result = useDrizzleQuery(query)

  return result
}
