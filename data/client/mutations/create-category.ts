import { asyncTryCatch } from '@/lib/utils/index'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import { categories } from '../db-schema'
import { db } from '../powersync/system'

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
