import { categories } from '@/data/client/db-schema'
import { db } from '@/system/powersync/system'
import { toCompilableQuery } from '@powersync/drizzle-driver'
import { useQuery } from '@powersync/react-native'
import { and, eq } from 'drizzle-orm'

export function useGetCategory({
  userId,
  categoryId
}: {
  userId: string
  categoryId: string
}) {
  const query = db.query.categories.findFirst({
    where: and(eq(categories.userId, userId), eq(categories.id, categoryId)),
    with: { parent: true }
  })

  const result = useQuery(toCompilableQuery(query))

  return result
}
