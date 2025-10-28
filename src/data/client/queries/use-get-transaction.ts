import { useDrizzleQuery } from '@/lib/hooks'
import { db } from '@/system/powersync/system'
import { and, eq } from 'drizzle-orm'
import { transactions } from '../db-schema'

export function useGetTransaction({
  userId,
  transactionId
}: {
  userId: string
  transactionId: string
}) {
  const query = db.query.transactions.findMany({
    where: and(
      eq(transactions.userId, userId),
      eq(transactions.id, transactionId)
    ),
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
    limit: 1
  })

  const result = useDrizzleQuery(query)

  return result
}
