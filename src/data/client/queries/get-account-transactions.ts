import { transactions } from '@/data/client/db-schema'
import { db } from '@/system/powersync/system'
import { and, desc, eq, gte, lte, or } from 'drizzle-orm'

interface GetAccountTransactionsParams {
  userId: string
  accountId: string
  dateFrom?: Date
  dateTo?: Date
  limit?: number
}

export function getAccountTransactions({
  userId,
  accountId,
  dateFrom,
  dateTo,
  limit
}: GetAccountTransactionsParams) {
  const whereConditions = [
    eq(transactions.userId, userId),
    or(
      eq(transactions.accountId, accountId),
      eq(transactions.counterAccountId, accountId)
    )
  ]

  if (dateFrom) whereConditions.push(gte(transactions.txDate, dateFrom))

  if (dateTo) whereConditions.push(lte(transactions.txDate, dateTo))

  return db.query.transactions.findMany({
    where: and(...whereConditions),
    with: {
      category: { with: { parent: true } },
      account: true,
      counterAccount: true,
      currency: true,
      transactionAttachments: { with: { attachment: true } }
    },
    orderBy: [desc(transactions.txDate)],
    ...(limit && { limit })
  })
}

export type GetAccountTransactionsResult = Awaited<
  ReturnType<typeof getAccountTransactions>
>
export type GetAccountTransactionsItem = GetAccountTransactionsResult[number]
