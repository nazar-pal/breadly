import { categories } from '@/data/client/db-schema'
import { asyncTryCatch } from '@/lib/utils/index'
import { db } from '@/system-v2'
import { and, eq } from 'drizzle-orm'

export async function setCategoryArchiveStatus({
  id,
  userId,
  isArchived
}: {
  id: string
  userId: string
  isArchived: boolean
}) {
  const [error, result] = await asyncTryCatch(
    db
      .update(categories)
      .set({
        isArchived,
        ...(isArchived ? { archivedAt: new Date() } : {})
      })
      .where(and(eq(categories.id, id), eq(categories.userId, userId)))
  )

  return [error, result]
}
