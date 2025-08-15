import { toCompilableQuery } from '@powersync/drizzle-driver'
import { useQuery } from '@powersync/react-native'
import { and, eq } from 'drizzle-orm'
import { transactions } from '../db-schema'
import { db } from '../powersync/system'

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

  const result = useQuery(toCompilableQuery(query))

  return result
}
