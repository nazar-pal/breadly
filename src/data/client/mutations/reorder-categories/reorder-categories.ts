import { asyncTryCatch } from '@/lib/utils'
import { needsRebalancing } from '@/lib/utils/fractional-ordering'
import { db } from '@/system/powersync/system'
import { and, asc, eq, isNull } from 'drizzle-orm'
import { z } from 'zod'
import { categories, CATEGORY_TYPE } from '../../db-schema'
import { handleFractionalReorder } from './utils/handle-fractional-reorder'
import { handleRebalancingReorder } from './utils/handle-rebalancing-reorder'

interface SuccessReturn {
  newSortOrder: number
  rebalanced: boolean
}

/**
 * Schema for reorder-categories input validation.
 */
const reorderCategoriesSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  parentId: z.string().nullable(), // null = reordering root categories
  categoryId: z.string().min(1, 'Category ID is required'),
  targetIndex: z
    .number()
    .int('Target index must be an integer')
    .nonnegative('Target index must be non-negative'),
  isArchived: z.boolean(),
  type: z.enum(CATEGORY_TYPE)
})

type Params = z.infer<typeof reorderCategoriesSchema>

async function baseFn({
  userId,
  parentId,
  categoryId,
  targetIndex,
  isArchived,
  type
}: Params): Promise<SuccessReturn> {
  // Input validation is handled by Zod schema in the public function

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

/**
 * Reorders a category within its parent scope.
 *
 * Validation is performed via Zod schema:
 * - targetIndex must be non-negative integer
 * - All required fields present
 * - Type is valid category type
 */
export async function reorderCategories(
  params: z.input<typeof reorderCategoriesSchema>
) {
  const parseResult = reorderCategoriesSchema.safeParse(params)
  if (!parseResult.success) {
    return [new Error(parseResult.error.issues[0].message), null]
  }

  return await asyncTryCatch(baseFn(parseResult.data))
}
