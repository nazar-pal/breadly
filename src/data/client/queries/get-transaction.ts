import { transactions } from '@/data/client/db-schema'
import { db } from '@/system-v2'
import { and, eq } from 'drizzle-orm'

interface Params {
  userId: string
  transactionId: string
}

export function getTransaction({ userId, transactionId }: Params) {
  return db.query.transactions.findFirst({
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
    }
  })
}

export type GetTransactionResult = Awaited<ReturnType<typeof getTransaction>>
export type GetTransactionResultItem = Exclude<GetTransactionResult, undefined>
