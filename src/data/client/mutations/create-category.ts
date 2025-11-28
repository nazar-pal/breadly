import { categories, categoryInsertSchema } from '@/data/client/db-schema'
import { asyncTryCatch } from '@/lib/utils/index'
import { db } from '@/system/powersync/system'
import { and, eq } from 'drizzle-orm'
import { randomUUID } from 'expo-crypto'
import { z } from 'zod'

/**
 * Creates a new category for a user.
 *
 * Validation is performed in two layers:
 * 1. Zod schema validates CHECK constraints (name non-empty)
 * 2. Transaction validates foreign key references and business rules
 */
export async function createCategory({
  userId,
  data
}: {
  userId: string
  data: Omit<z.input<typeof categoryInsertSchema>, 'userId' | 'id'>
}) {
  const id = randomUUID()
  // Zod schema handles CHECK constraint validations:
  // - Name is non-empty after trimming
  const parsedData = categoryInsertSchema.parse({ ...data, userId, id })

  const [error, result] = await asyncTryCatch(
    db.transaction(async tx => {
      // Validate parent exists and belongs to user (if provided)
      if (parsedData.parentId) {
        const parentCategory = await tx.query.categories.findFirst({
          where: and(
            eq(categories.id, parsedData.parentId),
            eq(categories.userId, userId)
          )
        })
        if (!parentCategory) throw new Error('Parent category not found')

        // Validate type matches parent (income/expense must match)
        if (parentCategory.type !== parsedData.type)
          throw new Error('Category type must match parent category type')

        // Prevent creating grandchildren (only allow 2 levels of nesting)
        if (parentCategory.parentId != null)
          throw new Error('Cannot nest categories more than one level deep')
      }

      await tx.insert(categories).values(parsedData)

      return { id }
    })
  )

  return [error, result]
}
