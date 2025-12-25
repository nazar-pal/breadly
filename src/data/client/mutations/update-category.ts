import { categories, categoryUpdateSchema } from '@/data/client/db-schema'
import { asyncTryCatch } from '@/lib/utils/index'
import { db } from '@/system/powersync/system'
import { and, eq, isNull, ne } from 'drizzle-orm'
import { z } from 'zod'

const updateCategorySchema = categoryUpdateSchema.pick({
  name: true,
  description: true,
  icon: true
})

/**
 * Updates an existing category.
 *
 * Validation is performed in two layers:
 * 1. Zod schema validates CHECK constraints (name non-empty if provided)
 * 2. Transaction validates existence, ownership, and unique name constraint
 */
export async function updateCategory({
  id,
  userId,
  data
}: {
  id: string
  userId: string
  data: z.input<typeof updateCategorySchema>
}) {
  // Zod schema handles CHECK constraint validations:
  // - Name is non-empty after trimming (if provided)
  const parsedData = updateCategorySchema.parse(data)

  const [error, result] = await asyncTryCatch(
    db.transaction(async tx => {
      // Verify category exists and belongs to user
      const existingCategory = await tx.query.categories.findFirst({
        where: and(eq(categories.id, id), eq(categories.userId, userId))
      })
      if (!existingCategory) throw new Error('Category not found')

      // Validate unique name within user+parent scope (server unique constraint)
      if (
        parsedData.name !== undefined &&
        parsedData.name !== existingCategory.name
      ) {
        const duplicateName = await tx.query.categories.findFirst({
          where: and(
            eq(categories.userId, userId),
            existingCategory.parentId
              ? eq(categories.parentId, existingCategory.parentId)
              : isNull(categories.parentId),
            eq(categories.name, parsedData.name),
            ne(categories.id, id) // Exclude current category
          ),
          columns: { id: true }
        })
        if (duplicateName)
          throw new Error(
            'A category with this name already exists at this level'
          )
      }

      await tx
        .update(categories)
        .set(parsedData)
        .where(and(eq(categories.id, id), eq(categories.userId, userId)))

      return true
    })
  )

  return [error, result]
}
