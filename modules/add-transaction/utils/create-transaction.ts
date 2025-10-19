import { asyncTryCatch } from '@/lib/utils/index'
import { db } from '@/system/powersync/system'
import { and, eq } from 'drizzle-orm'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import { accounts, transactions } from '../../../data/client/db-schema'

const transactionInsertSchema = createInsertSchema(transactions)

export async function createTransaction({
  userId,
  data
}: {
  userId: string
  data: Omit<z.input<typeof transactionInsertSchema>, 'userId'>
}) {
  const parsedData = transactionInsertSchema.parse({ ...data, userId })

  // Perform validation and balance updates atomically
  const [error, result] = await asyncTryCatch(
    db.transaction(async tx => {
      // Load involved accounts (if any)
      const fromAccount = parsedData.accountId
        ? await tx.query.accounts.findFirst({
            where: and(
              eq(accounts.id, parsedData.accountId),
              eq(accounts.userId, userId)
            )
          })
        : null

      const toAccount =
        parsedData.type === 'transfer' && parsedData.counterAccountId
          ? await tx.query.accounts.findFirst({
              where: and(
                eq(accounts.id, parsedData.counterAccountId),
                eq(accounts.userId, userId)
              )
            })
          : null

      // Basic existence checks for referenced accounts
      if (parsedData.type === 'transfer') {
        if (!fromAccount) throw new Error('From account not found')
        if (!toAccount) throw new Error('To account not found')
      } else if (parsedData.accountId && !fromAccount) {
        throw new Error('Account not found')
      }

      // Insufficient funds check for expenses and transfers
      if (
        (parsedData.type === 'expense' || parsedData.type === 'transfer') &&
        fromAccount &&
        fromAccount.balance < parsedData.amount
      ) {
        throw new Error('Insufficient funds')
      }

      // Insert transaction
      await tx.insert(transactions).values(parsedData)

      // Update balances locally to mirror server triggers
      if (parsedData.type === 'income') {
        if (fromAccount) {
          await tx
            .update(accounts)
            .set({ balance: fromAccount.balance + parsedData.amount })
            .where(eq(accounts.id, fromAccount.id))
        }
      } else if (parsedData.type === 'expense') {
        if (fromAccount) {
          await tx
            .update(accounts)
            .set({ balance: fromAccount.balance - parsedData.amount })
            .where(eq(accounts.id, fromAccount.id))
        }
      } else if (parsedData.type === 'transfer') {
        if (fromAccount && toAccount) {
          // Debit source account
          await tx
            .update(accounts)
            .set({ balance: fromAccount.balance - parsedData.amount })
            .where(eq(accounts.id, fromAccount.id))

          // Credit destination account
          await tx
            .update(accounts)
            .set({ balance: toAccount.balance + parsedData.amount })
            .where(eq(accounts.id, toAccount.id))
        }
      }

      return true
    })
  )

  return [error, result]
}
