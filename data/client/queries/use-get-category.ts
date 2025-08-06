import { toCompilableQuery } from '@powersync/drizzle-driver'
import { useQuery } from '@powersync/react-native'
import { and, eq } from 'drizzle-orm'
import { categories } from '../db-schema'
import { db } from '../powersync/system'

export function useGetCategory({
  userId,
  categoryId
}: {
  userId: string
  categoryId: string
}) {
  const query = db.query.categories.findMany({
    where: and(eq(categories.userId, userId), eq(categories.id, categoryId)),
    with: {
      budgets: true
    },
    limit: 1
  })

  const result = useQuery(toCompilableQuery(query))

  return result
}
