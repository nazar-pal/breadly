import {
  accounts,
  categories,
  currencies,
  events,
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
 *    - Transfers have a source account (accountId not null)
 *    - Transfers have different source and destination accounts
 *    - Non-transfers don't have a counter account
 * 2. Transaction validates FK constraints and business rules:
 *    - Currency, category, and account references exist
 *    - Category type matches transaction type (expense→expense, income→income)
 *    - Transfer transactions cannot have a category
 *
 * Note: Negative account balances are allowed (no insufficient funds check).
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
  // Normalize currency code to uppercase and trim whitespace
  const normalizedData = {
    ...data,
    currencyId: data.currencyId.trim().toUpperCase()
  }
  const parsedData = transactionInsertSchema.parse({
    ...normalizedData,
    userId,
    id
  })

  // Perform validation and balance updates atomically
  const [error, result] = await asyncTryCatch(
    db.transaction(async tx => {
      // Validate currency exists (FK constraint not enforced by PowerSync)
      const currency = await tx.query.currencies.findFirst({
        where: eq(currencies.code, parsedData.currencyId)
      })
      if (!currency)
        throw new Error(`Currency "${parsedData.currencyId}" not found`)

      // Transfer transactions cannot have a category (server trigger enforces this)
      if (parsedData.type === 'transfer' && parsedData.categoryId != null)
        throw new Error('Transfer transactions cannot have a category')

      // Validate category exists, belongs to user, is not archived, and type matches (if provided)
      if (parsedData.categoryId) {
        const category = await tx.query.categories.findFirst({
          where: and(
            eq(categories.id, parsedData.categoryId),
            eq(categories.userId, userId)
          )
        })
        if (!category) throw new Error('Category not found')

        // Prevent using archived categories in new transactions
        if (category.isArchived)
          throw new Error('Cannot use archived category for new transaction')

        // Validate category type matches transaction type (server trigger enforces this)
        if (category.type !== parsedData.type) {
          throw new Error(
            `Cannot use ${category.type} category for ${parsedData.type} transaction`
          )
        }
      }

      // Validate event exists and belongs to user (if provided)
      if (parsedData.eventId) {
        const event = await tx.query.events.findFirst({
          where: and(
            eq(events.id, parsedData.eventId),
            eq(events.userId, userId)
          )
        })
        if (!event)
          throw new Error('Event not found or does not belong to user')

        // Prevent using archived events in new transactions
        if (event.isArchived)
          throw new Error('Cannot use archived event for new transaction')
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

      // Prevent using archived accounts in new transactions
      if (fromAccount?.isArchived)
        throw new Error('Cannot use archived account for new transaction')

      if (toAccount?.isArchived)
        throw new Error(
          'Cannot use archived account as transfer destination for new transaction'
        )

      // Validate currency consistency (prevents server trigger failure)
      if (fromAccount && fromAccount.currencyId !== parsedData.currencyId) {
        throw new Error(
          `Transaction currency (${parsedData.currencyId}) does not match account currency (${fromAccount.currencyId})`
        )
      }

      if (
        parsedData.type === 'transfer' &&
        toAccount &&
        toAccount.currencyId !== parsedData.currencyId
      ) {
        throw new Error(
          `Transfer currency (${parsedData.currencyId}) does not match destination account currency (${toAccount.currencyId})`
        )
      }

      // Insert transaction
      await tx.insert(transactions).values(parsedData)

      // Update account balances (managed by application, not database triggers)
      // Note: Amounts are stored as integers in the smallest currency unit (e.g., cents for USD)
      // Both server (bigint) and client (integer) use integer arithmetic for precision
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
