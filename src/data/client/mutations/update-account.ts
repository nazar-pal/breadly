import {
  accountUpdateSchema,
  accounts,
  currencies,
  transactions
} from '@/data/client/db-schema'
import { asyncTryCatch } from '@/lib/utils/index'
import { db } from '@/system/powersync/system'
import { and, eq, or } from 'drizzle-orm'
import { z } from 'zod'

const updateAccountSchema = accountUpdateSchema.pick({
  name: true,
  description: true,
  currencyId: true,
  balance: true,
  savingsTargetAmount: true,
  savingsTargetDate: true,
  debtInitialAmount: true,
  debtDueDate: true,
  isArchived: true,
  archivedAt: true
})

/**
 * Updates an existing account.
 *
 * Validation is performed in two layers:
 * 1. Zod schema validates CHECK constraints:
 *    - Name is non-empty after trim (if provided)
 *    - Positive savings target amount (if provided)
 *    - Positive debt initial amount (if provided)
 * 2. Transaction validates FK constraints and business rules:
 *    - Account exists and belongs to user
 *    - Currency exists (if being updated)
 *    - Currency change protection: cannot change currency when transactions exist
 *    - Type-specific field validations on merged state
 */
export async function updateAccount({
  userId,
  accountId,
  data
}: {
  userId: string
  accountId: string
  data: z.input<typeof updateAccountSchema>
}) {
  // Normalize currency code to uppercase and trim whitespace if provided
  const normalizedData = {
    ...data,
    currencyId: data.currencyId?.trim().toUpperCase()
  }
  const parsedData = updateAccountSchema.parse(normalizedData)

  const [error, result] = await asyncTryCatch(
    db.transaction(async tx => {
      // 1. Fetch existing account
      const existingAccount = await tx.query.accounts.findFirst({
        where: and(eq(accounts.id, accountId), eq(accounts.userId, userId))
      })

      if (!existingAccount) throw new Error('Account not found')

      // 2. Auto-populate archivedAt when isArchived changes to true
      if (
        parsedData.isArchived === true &&
        existingAccount.archivedAt == null
      ) {
        parsedData.archivedAt = new Date()
      }

      // 3. Compute final values after update
      const finalType = existingAccount.type
      const finalSavingsTargetAmount =
        parsedData.savingsTargetAmount !== undefined
          ? parsedData.savingsTargetAmount
          : existingAccount.savingsTargetAmount
      const finalSavingsTargetDate =
        parsedData.savingsTargetDate !== undefined
          ? parsedData.savingsTargetDate
          : existingAccount.savingsTargetDate
      const finalDebtInitialAmount =
        parsedData.debtInitialAmount !== undefined
          ? parsedData.debtInitialAmount
          : existingAccount.debtInitialAmount
      const finalDebtDueDate =
        parsedData.debtDueDate !== undefined
          ? parsedData.debtDueDate
          : existingAccount.debtDueDate

      // 4. Validate currency exists (if being updated)
      if (
        parsedData.currencyId !== undefined &&
        parsedData.currencyId !== existingAccount.currencyId
      ) {
        const currency = await tx.query.currencies.findFirst({
          where: eq(currencies.code, parsedData.currencyId)
        })
        if (!currency)
          throw new Error(`Currency "${parsedData.currencyId}" not found`)

        // 5. Currency change protection: validate_account_currency_change() trigger
        // Cannot change currency when transactions exist for this account
        const hasTransactions = await tx.query.transactions.findFirst({
          where: and(
            eq(transactions.userId, userId),
            or(
              eq(transactions.accountId, accountId),
              eq(transactions.counterAccountId, accountId)
            )
          ),
          columns: { id: true }
        })

        if (hasTransactions) {
          throw new Error(
            'Cannot change account currency when transactions exist'
          )
        }
      }

      // 6. Validate type-specific fields on merged state
      // Savings fields only for saving accounts
      if (
        finalType !== 'saving' &&
        (finalSavingsTargetAmount != null || finalSavingsTargetDate != null)
      ) {
        throw new Error('Savings fields can only be set for saving accounts')
      }

      // Debt fields only for debt accounts
      if (
        finalType !== 'debt' &&
        (finalDebtInitialAmount != null || finalDebtDueDate != null)
      ) {
        throw new Error('Debt fields can only be set for debt accounts')
      }

      // Payment accounts cannot have any type-specific fields
      if (
        finalType === 'payment' &&
        (finalSavingsTargetAmount != null ||
          finalSavingsTargetDate != null ||
          finalDebtInitialAmount != null ||
          finalDebtDueDate != null)
      ) {
        throw new Error('Payment accounts cannot have savings or debt fields')
      }

      // 7. Update the account
      await tx
        .update(accounts)
        .set(parsedData)
        .where(and(eq(accounts.id, accountId), eq(accounts.userId, userId)))

      return true
    })
  )

  return [error, result]
}
