import { asyncTryCatch } from '@/lib/utils/index'
import { db } from '@/system/powersync/system'
import { and, eq } from 'drizzle-orm'
import { transactions } from '../db-schema'

export async function deleteTransaction({
  userId,
  transactionId
}: {
  userId: string
  transactionId: string
}) {
  const [error, result] = await asyncTryCatch(
    db
      .delete(transactions)
      .where(
        and(eq(transactions.id, transactionId), eq(transactions.userId, userId))
      )
  )

  return [error, result]
}
