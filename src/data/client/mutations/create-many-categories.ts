import { categories } from '@/data/client/db-schema'
import { asyncTryCatch } from '@/lib/utils/index'
import { db } from '@/system/powersync/system'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

const categoryInsertSchema = createInsertSchema(categories)

type CategoryInsert = Omit<z.input<typeof categoryInsertSchema>, 'userId'>

type CreateManyCategoriesArgs = {
  rows: CategoryInsert[]
  userId: string
}

/**
 * Inserts parsed categories using an atomic batch transaction.
 * Schema validation already guarantees parent resolution/order, so we only need
 * to ensure parents hit the DB before children by inserting in two passes.
 */
export async function createManyCategories({
  rows,
  userId
}: CreateManyCategoriesArgs) {
  const CHUNK_SIZE = 50

  const parentRows = rows.filter(row => !row.parentId)
  const childRows = rows.filter(row => !!row.parentId)

  const [error, result] = await asyncTryCatch(
    db.transaction(async tx => {
      const insertBatch = async (batch: CategoryInsert[]) => {
        if (batch.length === 0) return

        for (let i = 0; i < batch.length; i += CHUNK_SIZE) {
          const chunk = batch.slice(i, i + CHUNK_SIZE)
          const values = chunk.map(row => ({ userId, ...row }))

          const parsedValues = z.array(categoryInsertSchema).parse(values)

          await tx.insert(categories).values(parsedValues)
        }
      }

      await insertBatch(parentRows)
      await insertBatch(childRows)

      return true
    })
  )

  return [error, result]
}
