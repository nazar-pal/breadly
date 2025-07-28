import { and, eq } from 'drizzle-orm'
import { categories } from '../../../../schema/table_4_categories'
import { db } from '../../../../system'
import { calculateRebalancedOrder } from './calculate-rebalanced-order'

/**
 * Handle reordering when rebalancing is needed
 */
export async function handleRebalancingReorder(
  allUserCategories: { id: string; sortOrder: number }[],
  categoryId: string,
  targetIndex: number,
  userId: string
) {
  const rebalancedCategories = calculateRebalancedOrder(
    allUserCategories,
    categoryId,
    targetIndex
  )

  const results = await db.transaction(async tx => {
    const updatePromises = rebalancedCategories.map(({ id, newSortOrder }) =>
      tx
        .update(categories)
        .set({ sortOrder: newSortOrder })
        .where(and(eq(categories.id, id), eq(categories.userId, userId)))
        .returning({ id: categories.id })
    )
    return await Promise.all(updatePromises)
  })

  const updatedCount = results.filter(result => result.length > 0).length

  if (updatedCount === 0)
    throw new Error('Failed to update category orders during rebalancing')

  const movedCategoryNewSort = rebalancedCategories.find(
    cat => cat.id === categoryId
  )?.newSortOrder

  if (movedCategoryNewSort === undefined) {
    throw new Error('Failed to calculate new sort order for moved category')
  }

  return {
    newSortOrder: movedCategoryNewSort,
    rebalanced: true
  }
}
