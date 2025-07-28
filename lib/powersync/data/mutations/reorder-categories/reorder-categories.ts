import { asyncTryCatch } from '@/lib/utils'
import { needsRebalancing } from '@/lib/utils/fractional-ordering'
import { and, asc, eq, isNull } from 'drizzle-orm'
import { categories } from '../../../schema/table_4_categories'
import { db } from '../../../system'
import { handleFractionalReorder } from './utils/handle-fractional-reorder'
import { handleRebalancingReorder } from './utils/handle-rebalancing-reorder'

interface SuccessReturn {
  newSortOrder: number
  rebalanced: boolean
}

interface Params {
  userId: string
  parentId: string | null // null = reordering root categories, string = reordering subcategories within that parent
  categoryId: string
  targetIndex: number
}

async function baseFn({
  userId,
  parentId,
  categoryId,
  targetIndex
}: Params): Promise<SuccessReturn> {
  if (targetIndex < 0) throw new Error('Target index must be non-negative')

  const categoriesResult = await db.query.categories.findMany({
    where: and(
      eq(categories.userId, userId),
      parentId === null
        ? isNull(categories.parentId)
        : eq(categories.parentId, parentId)
    ),
    columns: { id: true, sortOrder: true },
    orderBy: asc(categories.sortOrder)
  })

  const categoryToMove = categoriesResult.find(cat => cat.id === categoryId)
  if (!categoryToMove)
    throw new Error(`Category ${categoryId} not found in the parent scope`)

  if (targetIndex >= categoriesResult.length)
    throw new Error('Target index is out of bounds')

  if (needsRebalancing(categoriesResult)) {
    return await handleRebalancingReorder(
      categoriesResult,
      categoryId,
      targetIndex,
      userId
    )
  } else {
    return await handleFractionalReorder(
      categoriesResult,
      categoryId,
      targetIndex,
      userId
    )
  }
}

export async function reorderCategories(params: Params) {
  return await asyncTryCatch(baseFn(params))
}
