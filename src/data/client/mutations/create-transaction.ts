import {
  accounts,
  categories,
  currencies,
  transactionInsertSchema,
  transactions
} from '@/data/client/db-schema'
import { asyncTryCatch } from '@/lib/utils/index'
import { db } from '@/system/powersync/system'
import { and, eq } from 'drizzle-orm'
import { randomUUID } from 'expo-crypto'
import { z } from 'zod'

/**
 * Creates a new transaction.
 *
 * Validation is performed in two layers:
 * 1. Zod schema validates CHECK constraints:
 *    - Amount is positive and within limits
 *    - Transaction date is not in the future
 *    - Transfers have a source account (accountId not null)
 *    - Transfers have different source and destination accounts
 *    - Non-transfers don't have a counter account
 * 2. Transaction validates FK constraints and business rules:
 *    - Currency, category, and account references exist
 *    - Sufficient funds for expenses and transfers
 *
 * @returns Tuple of [error, { id }] - the created transaction ID on success
 */
export async function createTransaction({
  userId,
  data
}: {
  userId: string
  data: Omit<z.input<typeof transactionInsertSchema>, 'userId' | 'id'>
}) {
  const id = randomUUID()
  const parsedData = transactionInsertSchema.parse({ ...data, userId, id })

  // Perform validation and balance updates atomically
  const [error, result] = await asyncTryCatch(
    db.transaction(async tx => {
      // Validate currency exists (FK constraint not enforced by PowerSync)
      const currency = await tx.query.currencies.findFirst({
        where: eq(currencies.code, parsedData.currencyId)
      })
      if (!currency)
        throw new Error(`Currency "${parsedData.currencyId}" not found`)

      // Validate category exists and belongs to user (if provided)
      if (parsedData.categoryId) {
        const category = await tx.query.categories.findFirst({
          where: and(
            eq(categories.id, parsedData.categoryId),
            eq(categories.userId, userId)
          )
        })
        if (!category) throw new Error('Category not found')
      }

      // Load involved accounts if IDs are present
      // (Zod schema guarantees both IDs exist for transfers, and counterAccountId is null for non-transfers)
      const fromAccount = parsedData.accountId
        ? await tx.query.accounts.findFirst({
            where: and(
              eq(accounts.id, parsedData.accountId),
              eq(accounts.userId, userId)
            )
          })
        : null

      const toAccount = parsedData.counterAccountId
        ? await tx.query.accounts.findFirst({
            where: and(
              eq(accounts.id, parsedData.counterAccountId),
              eq(accounts.userId, userId)
            )
          })
        : null

      // Validate account existence (FK constraint not enforced by PowerSync)
      if (parsedData.accountId && !fromAccount)
        throw new Error('Account not found')
      if (parsedData.counterAccountId && !toAccount)
        throw new Error('Destination account not found')

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
        // For income, accountId is optional - update balance only if account is set
        if (fromAccount) {
          await tx
            .update(accounts)
            .set({ balance: fromAccount.balance + parsedData.amount })
            .where(eq(accounts.id, fromAccount.id))
        }
      } else if (parsedData.type === 'expense') {
        // For expense, accountId is optional - update balance only if account is set
        if (fromAccount) {
          await tx
            .update(accounts)
            .set({ balance: fromAccount.balance - parsedData.amount })
            .where(eq(accounts.id, fromAccount.id))
        }
      } else if (parsedData.type === 'transfer') {
        // For transfers, Zod schema guarantees both accountId and counterAccountId exist,
        // and FK validation above guarantees fromAccount and toAccount exist
        // Debit source account
        if (!fromAccount || !toAccount)
          throw new Error('Invalid transaction data') // This should never happen
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

      return { id }
    })
  )

  return [error, result]
}
