import { toCompilableQuery } from '@powersync/drizzle-driver'
import { useQuery } from '@powersync/react-native'
import { and, desc, eq, gte, lte } from 'drizzle-orm'
import { transactions } from '../db-schema'
import { db } from '../powersync/system'

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
      category: true,
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

  const result = useQuery(toCompilableQuery(query))

  return result
}
