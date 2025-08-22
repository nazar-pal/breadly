import { accounts, transactions } from '@/data/client/db-schema'
import { db } from '@/data/client/powersync/system'
import { asyncTryCatch } from '@/lib/utils/index'
import { and, count, eq, or } from 'drizzle-orm'

export async function deleteAccount({
  id,
  userId
}: {
  id: string
  userId: string
}) {
  // Prevent deletion if there are transactions linked to this account
  const [txCountError, txCountResult] = await asyncTryCatch(
    db
      .select({ count: count() })
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          or(
            eq(transactions.accountId, id),
            eq(transactions.counterAccountId, id)
          )
        )
      )
      .limit(1)
  )

  if (txCountError) return [txCountError, null]

  const transactionCount = txCountResult?.[0]?.count ?? 0
  if (transactionCount > 0) {
    return [
      new Error(
        'Cannot delete account with existing transactions. Archive it instead.'
      ),
      null
    ]
  }

  const [error, result] = await asyncTryCatch(
    db
      .delete(accounts)
      .where(and(eq(accounts.id, id), eq(accounts.userId, userId)))
  )

  return [error, result]
}
