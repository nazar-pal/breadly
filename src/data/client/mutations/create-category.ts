import { categories } from '@/data/client/db-schema'
import { asyncTryCatch } from '@/lib/utils/index'
import { db } from '@/system/powersync/system'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

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
