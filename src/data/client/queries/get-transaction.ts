import { db } from '@/system/powersync/system'
import { and, eq } from 'drizzle-orm'
import { transactions } from '../db-schema'

interface Params {
  userId: string
  transactionId: string
}

export function getTransaction({ userId, transactionId }: Params) {
  return db.query.transactions.findMany({
    where: and(
      eq(transactions.userId, userId),
      eq(transactions.id, transactionId)
    ),
    with: {
      category: { with: { parent: true } },
      account: true,
      counterAccount: true,
      currency: true,
      transactionAttachments: { with: { attachment: true } }
    },
    limit: 1
  })
}

export type GetTransactionResult = Awaited<ReturnType<typeof getTransaction>>
export type GetTransactionResultItem = GetTransactionResult[number]
