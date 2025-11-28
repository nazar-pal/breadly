import { categories, categoryUpdateSchema } from '@/data/client/db-schema'
import { asyncTryCatch } from '@/lib/utils/index'
import { db } from '@/system/powersync/system'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'

const updateCategorySchema = categoryUpdateSchema.pick({
  parentId: true,
  name: true,
  description: true,
  icon: true
})

/**
 * Updates an existing category.
 *
 * Validation is performed in two layers:
 * 1. Zod schema validates CHECK constraints (name non-empty if provided)
 * 2. Transaction validates existence, ownership, and parent relationships
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

      // Validate parent relationship if being updated
      if (parsedData.parentId !== undefined && parsedData.parentId !== null) {
        // Prevent setting self as parent
        if (parsedData.parentId === id)
          throw new Error('Category cannot be its own parent')

        const parentCategory = await tx.query.categories.findFirst({
          where: and(
            eq(categories.id, parsedData.parentId),
            eq(categories.userId, userId)
          )
        })
        if (!parentCategory) throw new Error('Parent category not found')

        // Validate type matches parent (income/expense must match)
        if (parentCategory.type !== existingCategory.type)
          throw new Error('Category type must match parent category type')

        // Prevent creating grandchildren (only allow 2 levels of nesting)
        // Check 1: Target parent must be a root category
        if (parentCategory.parentId != null)
          throw new Error('Cannot nest categories more than one level deep')

        // Check 2: Category being moved must not have children (would become grandchildren)
        const hasChildren = await tx.query.categories.findFirst({
          where: and(
            eq(categories.parentId, id),
            eq(categories.userId, userId)
          ),
          columns: { id: true }
        })
        if (hasChildren)
          throw new Error(
            'Cannot make a category with subcategories into a subcategory'
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
