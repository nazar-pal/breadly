import { toCompilableQuery } from '@powersync/drizzle-driver'
import { useQuery } from '@powersync/react-native'
import { and, eq } from 'drizzle-orm'
import { categories, userPreferences } from '../../../../data/client/db-schema'
import { db } from '../../../../data/client/powersync/system'

export function useGetCategoryBudgetData({
  userId,
  categoryId
}: {
  userId: string
  categoryId: string
}) {
  const query = db.query.categories.findMany({
    where: and(eq(categories.userId, userId), eq(categories.id, categoryId)),
    with: {
      budgets: true,
      parent: {
        with: {
          budgets: true
        }
      }
    },
    limit: 1
  })

  const userPreferencesQuery = db.query.userPreferences.findMany({
    where: eq(userPreferences.userId, userId),
    with: {
      defaultCurrency: true
    },
    limit: 1
  })

  const categoryResult = useQuery(toCompilableQuery(query))
  const userPreferencesResult = useQuery(
    toCompilableQuery(userPreferencesQuery)
  )

  // Combine the loading states
  const isLoading = categoryResult.isLoading || userPreferencesResult.isLoading

  // Transform the data to match the expected format from the original hooks
  const transformedData = categoryResult.data?.[0]
    ? {
        category: categoryResult.data[0],
        userPreferences: userPreferencesResult.data?.[0]
      }
    : null

  return {
    data: transformedData,
    isLoading,
    error: categoryResult.error || userPreferencesResult.error
  }
}
