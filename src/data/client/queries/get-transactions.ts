import { db } from '@/system/powersync/system'
import { and, desc, eq, gte, lte } from 'drizzle-orm'
import { transactions } from '../db-schema'

interface GetTransactionsParams {
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
}: GetTransactionsParams) {
  // Build where conditions
  const whereConditions = [eq(transactions.userId, userId)]

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
    ...(limit && { limit }),
    ...(offset && { offset })
  })
}

export type GetTransactionsResult = Awaited<ReturnType<typeof getTransactions>>
export type GetTransactionsResultItem = GetTransactionsResult[number]
