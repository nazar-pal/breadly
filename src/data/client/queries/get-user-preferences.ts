import { db } from '@/system/powersync/system'
import { eq } from 'drizzle-orm'
import { userPreferences } from '../db-schema'

interface Params {
  userId: string
}

export function getUserPreferences({ userId }: Params) {
  return db.query.userPreferences.findMany({
    where: eq(userPreferences.userId, userId),
    with: { defaultCurrency: true },
    limit: 1
  })
}

export type GetUserPreferencesResult = Awaited<
  ReturnType<typeof getUserPreferences>
>
export type GetUserPreferencesResultItem = GetUserPreferencesResult[number]
