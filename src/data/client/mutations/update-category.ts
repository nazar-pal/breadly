import { asyncTryCatch } from '@/lib/utils/index'
import { db } from '@/system/powersync/system'
import { and, eq } from 'drizzle-orm'
import { createUpdateSchema } from 'drizzle-zod'
import { z } from 'zod'
import { categories } from '../db-schema'

const categoryUpdateSchema = createUpdateSchema(categories).pick({
  parentId: true,
  name: true,
  description: true,
  icon: true
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
