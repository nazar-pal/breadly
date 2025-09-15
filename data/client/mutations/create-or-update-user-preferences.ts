import { asyncTryCatch } from '@/lib/utils/index'
import { eq } from 'drizzle-orm'
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'
import { z } from 'zod'
import { userPreferences } from '../db-schema'
import { db } from '../powersync/system'

const userPreferencesInsertSchema = createInsertSchema(userPreferences)

const userPreferencesUpdateSchema = createUpdateSchema(userPreferences).pick({
  defaultCurrency: true,
  locale: true,
  firstWeekday: true
})

export async function createOrUpdateUserPreferences({
  userId,
  data
}: {
  userId: string
  data: z.input<typeof userPreferencesUpdateSchema>
}) {
  const currentUserPreferences = await db.query.userPreferences.findFirst({
    where: eq(userPreferences.userId, userId)
  })

  if (!currentUserPreferences) {
    const parsedData = userPreferencesInsertSchema.parse({
      userId,
      id: userId,
      ...data
    })

    const [error, result] = await asyncTryCatch(
      db.insert(userPreferences).values(parsedData)
    )

    return [error, result]
  } else {
    const parsedData = userPreferencesUpdateSchema.parse(data)

    const [error, result] = await asyncTryCatch(
      db
        .update(userPreferences)
        .set(parsedData)
        .where(eq(userPreferences.userId, userId))
    )

    return [error, result]
  }
}
