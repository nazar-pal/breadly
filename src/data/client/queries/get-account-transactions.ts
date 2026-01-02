import { transactions } from '@/data/client/db-schema'
import { db } from '@/system-v2'
import { and, desc, eq, gte, lte, or } from 'drizzle-orm'

interface Params {
  userId: string
  accountId: string
  dateFrom?: Date
  dateTo?: Date
  limit?: number
  offset?: number
}

export function getAccountTransactions({
  userId,
  accountId,
  dateFrom,
  dateTo,
  limit,
  offset
}: Params) {
  return db.query.transactions.findMany({
    where: and(
      eq(transactions.userId, userId),
      or(
        eq(transactions.accountId, accountId),
        eq(transactions.counterAccountId, accountId)
      ),
      ...(dateFrom ? [gte(transactions.txDate, dateFrom)] : []),
      ...(dateTo ? [lte(transactions.txDate, dateTo)] : [])
    ),
    with: {
      category: { with: { parent: true } },
      account: true,
      counterAccount: true,
      currency: true,
      transactionAttachments: { with: { attachment: true } }
    },
    orderBy: [desc(transactions.txDate)],
    limit,
    offset
  })
}

export type GetAccountTransactionsResult = Awaited<
  ReturnType<typeof getAccountTransactions>
>
export type GetAccountTransactionsResultItem =
  GetAccountTransactionsResult[number]
