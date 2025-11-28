import { categories } from '@/data/client/db-schema'
import { asyncTryCatch } from '@/lib/utils/index'
import { db } from '@/system/powersync/system'
import { createInsertSchema } from 'drizzle-zod'
import { randomUUID } from 'expo-crypto'
import { z } from 'zod'

const categoryInsertSchema = createInsertSchema(categories)

export async function createCategory({
  userId,
  data
}: {
  userId: string
  data: Omit<z.input<typeof categoryInsertSchema>, 'userId' | 'id'>
}) {
  const id = randomUUID()
  const parsedData = categoryInsertSchema.parse({ ...data, userId, id })

  const [error] = await asyncTryCatch(db.insert(categories).values(parsedData))

  if (error) {
    return [error, null] as const
  }

  return [null, { id }] as const
}
