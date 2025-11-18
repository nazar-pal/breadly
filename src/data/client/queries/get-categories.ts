import { db } from '@/system/powersync/system'
import { and, asc, eq, isNull } from 'drizzle-orm'
import { categories, CATEGORY_TYPE } from '../db-schema'

interface Params {
  userId: string
  type?: (typeof CATEGORY_TYPE)[number]
  /**
   * Controls which categories to fetch:
   * - `undefined` (default): Get all categories (both parent and subcategories)
   * - `null`: Get only parent categories (categories with no parent)
   * - `string`: Get subcategories that belong to the specified parent ID
   */
  parentId?: string | null
  isArchived?: boolean
}

/**
 * Fetches categories with optional parent filtering.
 *
 * @example
 * getCategories({ userId, type: 'expense' }) // All categories
 * getCategories({ userId, type: 'expense', parentId: null }) // Parent categories only
 * getCategories({ userId, type: 'expense', parentId: 'parent-id' }) // Subcategories of parent
 */
export function getCategories({ userId, type, parentId, isArchived }: Params) {
  // Build the where conditions based on parentId parameter
  const parentCondition =
    parentId === undefined
      ? undefined // No parent filter - get all categories
      : parentId === null
        ? isNull(categories.parentId) // Get only parent categories
        : eq(categories.parentId, parentId) // Get subcategories of specific parent

  return db.query.categories.findMany({
    where: and(
      eq(categories.userId, userId),
      type === undefined ? undefined : eq(categories.type, type),
      parentCondition,
      isArchived === undefined
        ? undefined
        : eq(categories.isArchived, isArchived)
    ),

    orderBy: [asc(categories.sortOrder), asc(categories.name)]
  })
}

export type GetCategoriesResult = Awaited<ReturnType<typeof getCategories>>
export type GetCategoriesResultItem = GetCategoriesResult[number]
