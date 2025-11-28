import {
  accountInsertSchema,
  accounts,
  currencies
} from '@/data/client/db-schema'
import { asyncTryCatch } from '@/lib/utils/index'
import { db } from '@/system/powersync/system'
import { eq } from 'drizzle-orm'
import { randomUUID } from 'expo-crypto'
import { z } from 'zod'

/**
 * Creates a new account for a user.
 *
 * Validation is performed in two layers:
 * 1. Zod schema validates CHECK constraints (name non-empty, type-specific fields, positive amounts)
 * 2. Transaction validates foreign key references (currency exists)
 *
 * @returns Tuple of [error, { id }] - the created account ID on success
 */
export async function createAccount({
  userId,
  data
}: {
  userId: string
  data: Omit<z.input<typeof accountInsertSchema>, 'userId' | 'id'>
}) {
  const id = randomUUID()
  // Zod schema handles all CHECK constraint validations:
  // - Name is non-empty after trimming
  // - Savings fields only for saving accounts
  // - Debt fields only for debt accounts
  // - Positive amounts for savingsTargetAmount and debtInitialAmount
  const parsedData = accountInsertSchema.parse({ ...data, userId, id })

  const [error, result] = await asyncTryCatch(
    db.transaction(async tx => {
      // Validate currency exists (FK constraint not enforced by PowerSync)
      const currency = await tx.query.currencies.findFirst({
        where: eq(currencies.code, parsedData.currencyId)
      })
      if (!currency)
        throw new Error(`Currency "${parsedData.currencyId}" not found`)

      await tx.insert(accounts).values(parsedData)

      return { id }
    })
  )

  return [error, result]
}
