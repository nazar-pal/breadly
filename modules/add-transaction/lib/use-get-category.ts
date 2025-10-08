import { categories } from '@/data/client/db-schema'
import { useDrizzleQuery } from '@/lib/hooks'
import { db } from '@/system/powersync/system'
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

  const result = useDrizzleQuery(query)

  return result
}
