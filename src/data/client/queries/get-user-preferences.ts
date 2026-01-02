import { userPreferences } from '@/data/client/db-schema'
import { db } from '@/system-v2'
import { eq } from 'drizzle-orm'

interface Params {
  userId: string
}

export function getUserPreferences({ userId }: Params) {
  return db.query.userPreferences.findFirst({
    where: eq(userPreferences.userId, userId),
    with: { defaultCurrency: true }
  })
}

export type GetUserPreferencesResult = Awaited<
  ReturnType<typeof getUserPreferences>
>
export type GetUserPreferencesResultItem = Exclude<
  GetUserPreferencesResult,
  undefined
>
