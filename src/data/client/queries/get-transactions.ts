import { transactions } from '@/data/client/db-schema'
import { db } from '@/system-v2'
import { and, desc, eq, gte, lte } from 'drizzle-orm'

interface Params {
  userId: string
  dateFrom?: Date
  dateTo?: Date
  limit?: number
  offset?: number
}

export function getTransactions({
  userId,
  dateFrom,
  dateTo,
  limit,
  offset
}: Params) {
  return db.query.transactions.findMany({
    where: and(
      eq(transactions.userId, userId),
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

export type GetTransactionsResult = Awaited<ReturnType<typeof getTransactions>>
export type GetTransactionsResultItem = GetTransactionsResult[number]
