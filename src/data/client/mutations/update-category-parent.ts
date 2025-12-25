import { categories } from '@/data/client/db-schema'
import { asyncTryCatch } from '@/lib/utils/index'
import { db } from '@/system/powersync/system'
import { and, eq } from 'drizzle-orm'

/**
 * Updates the parent relationship of a category.
 *
 * Validation is performed in two layers:
 * 1. Transaction validates existence, ownership, and parent relationships
 * 2. Prevents invalid parent-child relationships (self-reference, type mismatch, deep nesting)
 */
export async function updateCategoryParent({
  id,
  userId,
  parentId
}: {
  id: string
  userId: string
  parentId: string | null
}) {
  const [error, result] = await asyncTryCatch(
    db.transaction(async tx => {
      // Verify category exists and belongs to user
      const existingCategory = await tx.query.categories.findFirst({
        where: and(eq(categories.id, id), eq(categories.userId, userId))
      })
      if (!existingCategory) throw new Error('Category not found')

      // Validate parent relationship if being set (not null)
      if (parentId !== null) {
        // Prevent setting self as parent
        if (parentId === id)
          throw new Error('Category cannot be its own parent')

        const parentCategory = await tx.query.categories.findFirst({
          where: and(eq(categories.id, parentId), eq(categories.userId, userId))
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
        .set({ parentId })
        .where(and(eq(categories.id, id), eq(categories.userId, userId)))

      return true
    })
  )

  return [error, result]
}
