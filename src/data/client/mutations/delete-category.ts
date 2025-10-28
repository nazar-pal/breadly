import { asyncTryCatch } from '@/lib/utils/index'
import { db } from '@/system/powersync/system'
import { and, eq } from 'drizzle-orm'
import { categories } from '../db-schema'

export async function deleteCategory({
  id,
  userId
}: {
  id: string
  userId: string
}) {
  const [error, result] = await asyncTryCatch(
    db
      .delete(categories)
      .where(and(eq(categories.id, id), eq(categories.userId, userId)))
  )

  return [error, result]
}
