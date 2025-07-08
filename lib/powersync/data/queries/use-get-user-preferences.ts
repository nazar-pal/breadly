import { toCompilableQuery } from '@powersync/drizzle-driver'
import { useQuery } from '@powersync/react-native'
import { eq } from 'drizzle-orm'
import { userPreferences } from '../../schema/table_3_user-preferences'
import { db } from '../../system'

export function useGetUserPreferences({ userId }: { userId: string }) {
  const query = db.query.userPreferences.findMany({
    where: eq(userPreferences.userId, userId),
    with: {
      defaultCurrency: true
    },
    limit: 1
  })

  const result = useQuery(toCompilableQuery(query))

  return result
}
