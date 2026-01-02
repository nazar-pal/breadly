import { accounts, transactions } from '@/data/client/db-schema'
import { asyncTryCatch } from '@/lib/utils/index'
import { db } from '@/system-v2'
import { and, eq } from 'drizzle-orm'

/**
 * Deletes a transaction and reverses its balance effects.
 *
 * Validation:
 * - Transaction must exist and belong to user
 *
 * Balance handling:
 * - Reverses balance changes on primary account
 * - Reverses counter account balance for transfers
 * - Accounts that no longer exist are silently skipped
 */
export async function deleteTransaction({
  userId,
  transactionId
}: {
  userId: string
  transactionId: string
}) {
  const [error, result] = await asyncTryCatch(
    db.transaction(async tx => {
      // 1. Fetch transaction to reverse balance changes
      const existingTx = await tx.query.transactions.findFirst({
        where: and(
          eq(transactions.id, transactionId),
          eq(transactions.userId, userId)
        )
      })

      if (!existingTx) throw new Error('Transaction not found')

      // 2. Reverse balance changes for primary account
      // Note: Amounts are stored as integers in the smallest currency unit (e.g., cents for USD)
      // Both server (bigint) and client (integer) use integer arithmetic for precision
      if (existingTx.accountId) {
        const account = await tx.query.accounts.findFirst({
          where: and(
            eq(accounts.id, existingTx.accountId),
            eq(accounts.userId, userId)
          )
        })

        if (account) {
          let reversedBalance = account.balance
          if (existingTx.type === 'income') {
            reversedBalance -= existingTx.amount
          } else if (existingTx.type === 'expense') {
            reversedBalance += existingTx.amount
          } else if (existingTx.type === 'transfer') {
            reversedBalance += existingTx.amount
          }

          await tx
            .update(accounts)
            .set({ balance: reversedBalance })
            .where(eq(accounts.id, account.id))
        }
      }

      // 3. Reverse counter account balance for transfers
      if (existingTx.type === 'transfer' && existingTx.counterAccountId) {
        const counterAccount = await tx.query.accounts.findFirst({
          where: and(
            eq(accounts.id, existingTx.counterAccountId),
            eq(accounts.userId, userId)
          )
        })

        if (counterAccount) {
          await tx
            .update(accounts)
            .set({ balance: counterAccount.balance - existingTx.amount })
            .where(eq(accounts.id, counterAccount.id))
        }
      }

      // 4. Delete the transaction
      await tx
        .delete(transactions)
        .where(
          and(
            eq(transactions.id, transactionId),
            eq(transactions.userId, userId)
          )
        )

      return true
    })
  )

  return [error, result]
}
