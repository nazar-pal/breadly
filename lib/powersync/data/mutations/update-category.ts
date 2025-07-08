import { asyncTryCatch } from '@/lib/utils/index'
import { and, eq } from 'drizzle-orm'
import { createUpdateSchema } from 'drizzle-zod'
import { z } from 'zod/v4'
import { categories } from '../../schema/table_4_categories'
import { db } from '../../system'

const categoryUpdateSchema = createUpdateSchema(categories).pick({
  parentId: true,
  name: true,
  description: true,
  icon: true,
  isArchived: true
})

export async function updateCategory({
  id,
  userId,
  data
}: {
  id: string
  userId: string
  data: z.input<typeof categoryUpdateSchema>
}) {
  const parsedData = categoryUpdateSchema.parse(data)

  const [error, result] = await asyncTryCatch(
    db
      .update(categories)
      .set(parsedData)
      .where(and(eq(categories.id, id), eq(categories.userId, userId)))
  )

  return [error, result]
}
