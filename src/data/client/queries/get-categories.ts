import { categories, CATEGORY_TYPE } from '@/data/client/db-schema'
import { db } from '@/system/powersync/system'
import { and, asc, eq, isNull } from 'drizzle-orm'

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
  /**
   * Controls archived status filtering:
   * - `undefined` (default): Get all categories regardless of archived status
   * - `true`: Get only archived categories
   * - `false`: Get only non-archived categories
   */
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
  // parentId: undefined = all, null = root only, string = children of parent
  const parentCondition =
    parentId === undefined
      ? undefined
      : parentId === null
        ? isNull(categories.parentId)
        : eq(categories.parentId, parentId)

  return db.query.categories.findMany({
    where: and(
      eq(categories.userId, userId),
      ...(type ? [eq(categories.type, type)] : []),
      ...(parentCondition ? [parentCondition] : []),
      // isArchived: undefined = all (both archived and non-archived), boolean = filter by that value
      ...(isArchived !== undefined
        ? [eq(categories.isArchived, isArchived)]
        : [])
    ),
    orderBy: [asc(categories.sortOrder), asc(categories.name)]
  })
}

export type GetCategoriesResult = Awaited<ReturnType<typeof getCategories>>
export type GetCategoriesResultItem = GetCategoriesResult[number]
