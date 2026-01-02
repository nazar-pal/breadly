import {
  currencies,
  userPreferenceInsertSchema,
  userPreferenceUpdateSchema,
  userPreferences
} from '@/data/client/db-schema'
import { asyncTryCatch } from '@/lib/utils/index'
import { db } from '@/system-v2'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

const updateUserPreferencesSchema = userPreferenceUpdateSchema.pick({
  defaultCurrency: true,
  locale: true,
  firstWeekday: true
})

/**
 * Creates or updates user preferences.
 *
 * Validation is performed in two layers:
 * 1. Zod schema validates CHECK constraints (firstWeekday 1-7)
 * 2. Transaction validates foreign keys (currency exists)
 */
export async function createOrUpdateUserPreferences({
  userId,
  data
}: {
  userId: string
  data: z.input<typeof updateUserPreferencesSchema>
}) {
  // Zod schema handles firstWeekday range validation
  const parsedData = updateUserPreferencesSchema.parse(data)

  const [error, result] = await asyncTryCatch(
    db.transaction(async tx => {
      // Validate currency exists if provided (FK constraint not enforced by PowerSync)
      if (parsedData.defaultCurrency) {
        const currency = await tx.query.currencies.findFirst({
          where: eq(currencies.code, parsedData.defaultCurrency)
        })
        if (!currency)
          throw new Error(`Currency "${parsedData.defaultCurrency}" not found`)
      }

      const currentUserPreferences = await tx.query.userPreferences.findFirst({
        where: eq(userPreferences.userId, userId)
      })

      if (!currentUserPreferences) {
        const insertData = userPreferenceInsertSchema.parse({
          userId,
          id: userId,
          ...parsedData
        })
        await tx.insert(userPreferences).values(insertData)
      } else {
        await tx
          .update(userPreferences)
          .set(parsedData)
          .where(eq(userPreferences.userId, userId))
      }

      return true
    })
  )

  return [error, result]
}
