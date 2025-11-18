import { useDrizzleQuery } from '@/lib/hooks'
import { CATEGORY_TYPE } from '../db-schema'
import { getCategories } from './get-categories'

/**
 * Flexible hook to fetch categories with optional parent filtering
 *
 * @param params.parentId - Controls which categories to fetch:
 *   - `undefined` (default): Get all categories (both parent and subcategories)
 *   - `null`: Get only parent categories (categories with no parent)
 *   - `string`: Get subcategories that belong to the specified parent ID
 *
 * @example
 * // Get all categories
 * const { data } = useGetCategories({ userId, type: 'expense' })
 *
 * // Get only parent categories (for main category grid)
 * const { data } = useGetCategories({ userId, type: 'expense', parentId: null })
 *
 * // Get subcategories of a specific parent
 * const { data } = useGetCategories({ userId, type: 'expense', parentId: 'parent-category-id' })
 */
export function useGetCategories({
  userId,
  type,
  parentId,
  transactionsFrom,
  transactionsTo,
  isArchived,
  includeSubcategoriesWithTransactions
}: {
  userId: string
  type: (typeof CATEGORY_TYPE)[number]
  parentId?: string | null // undefined = all categories, null = parent categories only, string = subcategories of that parent
  transactionsFrom?: Date
  transactionsTo?: Date
  isArchived?: boolean
  /**
   * When true and fetching parent categories (parentId === null), also load their immediate subcategories
   * with transactions filtered by the same user/type/date range. Archived children are included.
   */
  includeSubcategoriesWithTransactions?: boolean
}) {
  const query = getCategories({
    userId,
    type,
    parentId,
    transactionsFrom,
    transactionsTo,
    isArchived,
    includeSubcategoriesWithTransactions
  })

  const result = useDrizzleQuery(query)

  return result
}
