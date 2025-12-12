import {
  accounts,
  categories,
  currencies,
  transactionUpdateSchema,
  transactions
} from '@/data/client/db-schema'
import { asyncTryCatch } from '@/lib/utils/index'
import { db } from '@/system/powersync/system'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'

const updateTransactionSchema = transactionUpdateSchema.pick({
  type: true,
  accountId: true,
  counterAccountId: true,
  categoryId: true,
  amount: true,
  currencyId: true,
  txDate: true,
  notes: true
})

/**
 * Updates an existing transaction.
 *
 * Validation is performed in two layers:
 * 1. Zod schema validates CHECK constraints:
 *    - Amount is positive and within limits (if provided)
 *    - Transaction date is not in the future (if provided)
 * 2. Transaction validates FK constraints and business rules:
 *    - Transaction exists and belongs to user
 *    - Transfer constraints (validated on merged state since Zod can't see existing values)
 *    - Currency, category, and account references exist (if being updated)
 *    - Currency matches account currency (prevents server trigger failure)
 *    - Sufficient funds for expenses and transfers
 */
export async function updateTransaction({
  userId,
  transactionId,
  data
}: {
  userId: string
  transactionId: string
  data: z.input<typeof updateTransactionSchema>
}) {
  const parsedData = updateTransactionSchema.parse(data)

  const [error, result] = await asyncTryCatch(
    db.transaction(async tx => {
      // 1. Fetch existing transaction to calculate balance changes
      const existingTx = await tx.query.transactions.findFirst({
        where: and(
          eq(transactions.id, transactionId),
          eq(transactions.userId, userId)
        )
      })

      if (!existingTx) throw new Error('Transaction not found')

      // Compute final values after update
      const finalType = parsedData.type ?? existingTx.type
      const finalAccountId =
        parsedData.accountId !== undefined
          ? parsedData.accountId
          : existingTx.accountId
      const finalCounterAccountId =
        parsedData.counterAccountId !== undefined
          ? parsedData.counterAccountId
          : existingTx.counterAccountId

      // Compute final currency
      const finalCurrencyId = parsedData.currencyId ?? existingTx.currencyId

      // Validate transfer constraints on merged state (Zod can't validate partial updates)
      if (finalType === 'transfer') {
        if (!finalAccountId)
          throw new Error('Transfer must have a source account')

        if (!finalCounterAccountId)
          throw new Error('Transfer must have a destination account')

        if (finalAccountId === finalCounterAccountId)
          throw new Error(
            'Transfer source and destination accounts must be different'
          )
      } else if (finalCounterAccountId)
        throw new Error('Only transfers can have a destination account')

      // 2. Validate foreign keys if they're being updated
      if (parsedData.currencyId !== undefined) {
        const currency = await tx.query.currencies.findFirst({
          where: eq(currencies.code, parsedData.currencyId)
        })
        if (!currency)
          throw new Error(`Currency "${parsedData.currencyId}" not found`)
      }

      if (
        parsedData.categoryId !== undefined &&
        parsedData.categoryId !== null
      ) {
        const category = await tx.query.categories.findFirst({
          where: and(
            eq(categories.id, parsedData.categoryId),
            eq(categories.userId, userId)
          )
        })
        if (!category) throw new Error('Category not found')
      }

      // Validate account existence and currency consistency
      // We need to check currency on final accounts if currency or accounts are changing
      const needsCurrencyValidation =
        parsedData.currencyId !== undefined ||
        parsedData.accountId !== undefined ||
        parsedData.counterAccountId !== undefined

      if (parsedData.accountId !== undefined && parsedData.accountId !== null) {
        const account = await tx.query.accounts.findFirst({
          where: and(
            eq(accounts.id, parsedData.accountId),
            eq(accounts.userId, userId)
          )
        })
        if (!account) throw new Error('Account not found')

        // Validate currency matches
        if (account.currencyId !== finalCurrencyId) {
          throw new Error(
            `Transaction currency (${finalCurrencyId}) does not match account currency (${account.currencyId})`
          )
        }
      } else if (needsCurrencyValidation && finalAccountId) {
        // Account not being updated but currency might be - validate existing account
        const account = await tx.query.accounts.findFirst({
          where: and(
            eq(accounts.id, finalAccountId),
            eq(accounts.userId, userId)
          )
        })
        if (account && account.currencyId !== finalCurrencyId) {
          throw new Error(
            `Transaction currency (${finalCurrencyId}) does not match account currency (${account.currencyId})`
          )
        }
      }

      if (
        parsedData.counterAccountId !== undefined &&
        parsedData.counterAccountId !== null
      ) {
        const counterAccount = await tx.query.accounts.findFirst({
          where: and(
            eq(accounts.id, parsedData.counterAccountId),
            eq(accounts.userId, userId)
          )
        })
        if (!counterAccount) throw new Error('Counter account not found')

        // Validate currency matches for transfers
        if (
          finalType === 'transfer' &&
          counterAccount.currencyId !== finalCurrencyId
        ) {
          throw new Error(
            `Transfer currency (${finalCurrencyId}) does not match destination account currency (${counterAccount.currencyId})`
          )
        }
      } else if (
        needsCurrencyValidation &&
        finalType === 'transfer' &&
        finalCounterAccountId
      ) {
        // Counter account not being updated but currency/type might be - validate existing counter account
        const counterAccount = await tx.query.accounts.findFirst({
          where: and(
            eq(accounts.id, finalCounterAccountId),
            eq(accounts.userId, userId)
          )
        })
        if (counterAccount && counterAccount.currencyId !== finalCurrencyId) {
          throw new Error(
            `Transfer currency (${finalCurrencyId}) does not match destination account currency (${counterAccount.currencyId})`
          )
        }
      }

      // 3. Reverse old transaction's balance effect
      if (existingTx.accountId) {
        const oldAccount = await tx.query.accounts.findFirst({
          where: and(
            eq(accounts.id, existingTx.accountId),
            eq(accounts.userId, userId)
          )
        })

        if (oldAccount) {
          let reversedBalance = oldAccount.balance
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
            .where(eq(accounts.id, oldAccount.id))
        }
      }

      // Reverse counter account for old transfer
      if (existingTx.type === 'transfer' && existingTx.counterAccountId) {
        const oldCounterAccount = await tx.query.accounts.findFirst({
          where: and(
            eq(accounts.id, existingTx.counterAccountId),
            eq(accounts.userId, userId)
          )
        })

        if (oldCounterAccount)
          await tx
            .update(accounts)
            .set({ balance: oldCounterAccount.balance - existingTx.amount })
            .where(eq(accounts.id, oldCounterAccount.id))
      }

      // 4. Update the transaction
      await tx
        .update(transactions)
        .set(parsedData)
        .where(
          and(
            eq(transactions.id, transactionId),
            eq(transactions.userId, userId)
          )
        )

      // 5. Apply new transaction's balance effect
      const finalAmount = parsedData.amount ?? existingTx.amount

      if (finalAccountId) {
        const updatedAccount = await tx.query.accounts.findFirst({
          where: and(
            eq(accounts.id, finalAccountId),
            eq(accounts.userId, userId)
          )
        })

        if (updatedAccount) {
          let newBalance = updatedAccount.balance
          if (finalType === 'income') {
            newBalance += finalAmount
          } else if (finalType === 'expense') {
            // Check for insufficient funds
            if (newBalance < finalAmount) throw new Error('Insufficient funds')

            newBalance -= finalAmount
          } else if (finalType === 'transfer') {
            // Check for insufficient funds
            if (newBalance < finalAmount) throw new Error('Insufficient funds')

            newBalance -= finalAmount
          }

          await tx
            .update(accounts)
            .set({ balance: newBalance })
            .where(eq(accounts.id, updatedAccount.id))
        }
      }

      // Apply new counter account balance for transfer
      if (finalType === 'transfer' && finalCounterAccountId) {
        const updatedCounterAccount = await tx.query.accounts.findFirst({
          where: and(
            eq(accounts.id, finalCounterAccountId),
            eq(accounts.userId, userId)
          )
        })

        if (updatedCounterAccount)
          await tx
            .update(accounts)
            .set({ balance: updatedCounterAccount.balance + finalAmount })
            .where(eq(accounts.id, updatedCounterAccount.id))
      }

      return true
    })
  )

  return [error, result]
}
