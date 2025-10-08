import { useDrizzleQuery } from '@/lib/hooks'
import { db } from '@/system/powersync/system'
import { eq } from 'drizzle-orm'
import { userPreferences } from '../db-schema'

export function useGetUserPreferences({ userId }: { userId: string }) {
  const query = db.query.userPreferences.findMany({
    where: eq(userPreferences.userId, userId),
    with: {
      defaultCurrency: true
    },
    limit: 1
  })

  const result = useDrizzleQuery(query)

  return result
}
