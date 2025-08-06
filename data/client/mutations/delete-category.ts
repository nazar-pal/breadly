import { asyncTryCatch } from '@/lib/utils/index'
import { and, eq } from 'drizzle-orm'
import { categories } from '../db-schema'
import { db } from '../powersync/system'

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
