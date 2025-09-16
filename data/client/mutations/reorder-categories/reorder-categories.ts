import { asyncTryCatch } from '@/lib/utils'
import { needsRebalancing } from '@/lib/utils/fractional-ordering'
import { db } from '@/system/powersync/system'
import { and, asc, eq, isNull } from 'drizzle-orm'
import { categories } from '../../db-schema'
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
  isArchived: boolean
  type: 'expense' | 'income'
}

async function baseFn({
  userId,
  parentId,
  categoryId,
  targetIndex,
  isArchived,
  type
}: Params): Promise<SuccessReturn> {
  if (targetIndex < 0) throw new Error('Target index must be non-negative')

  const parentCondition =
    parentId === null
      ? isNull(categories.parentId)
      : eq(categories.parentId, parentId)

  const categoriesResult = await db.query.categories.findMany({
    where: and(
      eq(categories.userId, userId),
      eq(categories.type, type),
      parentCondition,
      eq(categories.isArchived, isArchived)
    ),
    columns: { id: true, sortOrder: true, name: true },
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
