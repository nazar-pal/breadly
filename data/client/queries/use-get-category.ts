import { db } from '@/system/powersync/system'
import { toCompilableQuery } from '@powersync/drizzle-driver'
import { useQuery } from '@powersync/react-native'
import { and, eq } from 'drizzle-orm'
import { categories } from '../db-schema'

export function useGetCategory({
  userId,
  categoryId
}: {
  userId: string
  categoryId: string
}) {
  const query = db.query.categories.findMany({
    where: and(eq(categories.userId, userId), eq(categories.id, categoryId)),
    limit: 1
  })

  const result = useQuery(toCompilableQuery(query))

  return result
}
