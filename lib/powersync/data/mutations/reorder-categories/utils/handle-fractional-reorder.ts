import { calculateMoveOrder } from '@/lib/utils/fractional-ordering'
import { and, eq } from 'drizzle-orm'
import { categories } from '../../../../schema/table_4_categories'
import { db } from '../../../../system'

/**
 * Handle reordering using fractional ordering
 */
export async function handleFractionalReorder(
  allCategories: { id: string; sortOrder: number }[],
  categoryId: string,
  targetIndex: number,
  userId: string
) {
  const newSortOrder = calculateMoveOrder(
    allCategories,
    categoryId,
    targetIndex
  )

  const result = await db
    .update(categories)
    .set({ sortOrder: newSortOrder })
    .where(and(eq(categories.id, categoryId), eq(categories.userId, userId)))
    .returning({ id: categories.id })

  if (result.length === 0) throw new Error('Failed to update category order')

  return {
    newSortOrder,
    rebalanced: false
  }
}
