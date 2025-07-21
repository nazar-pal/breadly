import { asyncTryCatch } from '@/lib/utils/index'
import { and, eq } from 'drizzle-orm'
import { categories } from '../../schema/table_4_categories'
import { db } from '../../system'

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
      .set({ isArchived })
      .where(and(eq(categories.id, id), eq(categories.userId, userId)))
  )

  return [error, result]
}
