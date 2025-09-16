import { transactions } from '@/data/client/db-schema'
import { db } from '@/system/powersync/system'
import { toCompilableQuery } from '@powersync/drizzle-driver'
import { useQuery } from '@powersync/react-native'
import { and, desc, eq, gte, lte, or } from 'drizzle-orm'

interface UseGetTransactionsParams {
  userId: string
  accountId: string
  dateFrom?: Date
  dateTo?: Date
  limit?: number
}

export function useGetAccountTransactions({
  userId,
  accountId,
  dateFrom,
  dateTo,
  limit
}: UseGetTransactionsParams) {
  // Build where conditions
  const whereConditions = [
    eq(transactions.userId, userId),
    or(
      eq(transactions.accountId, accountId),
      eq(transactions.counterAccountId, accountId)
    )
  ]

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

  const result = useQuery(toCompilableQuery(query))

  return result
}

export type UseGetAccountTransactionsResult = ReturnType<
  typeof useGetAccountTransactions
>
export type AccountTransactionsItem =
  UseGetAccountTransactionsResult['data'][number]
