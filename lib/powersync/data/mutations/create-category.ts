import { asyncTryCatch } from '@/lib/utils/index'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod/v4'
import { categories } from '../../schema/table_4_categories'
import { db } from '../../system'

const categoryInsertSchema = createInsertSchema(categories)

export async function createCategory({
  userId,
  data
}: {
  userId: string
  data: Omit<z.input<typeof categoryInsertSchema>, 'userId'>
}) {
  const parsedData = categoryInsertSchema.parse({ ...data, userId })

  const [error, result] = await asyncTryCatch(
    db.insert(categories).values(parsedData)
  )

  return [error, result]
}
