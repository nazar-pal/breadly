import { db } from '@/system/powersync/system'
import { and, asc, eq, gte, isNull, lte } from 'drizzle-orm'
import { categories, CATEGORY_TYPE, transactions } from '../db-schema'

interface Params {
  userId: string
  type: (typeof CATEGORY_TYPE)[number]
  /**
   * Controls which categories to fetch:
   * - `undefined` (default): Get all categories (both parent and subcategories)
   * - `null`: Get only parent categories (categories with no parent)
   * - `string`: Get subcategories that belong to the specified parent ID
   */
  parentId?: string | null
  transactionsFrom?: Date
  transactionsTo?: Date
  isArchived?: boolean
  /**
   * When true and fetching parent categories (parentId === null), also load their immediate subcategories
   * with transactions filtered by the same user/type/date range. Archived children are included.
   */
  includeSubcategoriesWithTransactions?: boolean
}

/**
 * Fetches categories with optional parent filtering and transaction filtering.
 * Transactions are always filtered by user, type, and optional date range.
 *
 * @example
 * getCategories({ userId, type: 'expense' }) // All categories
 * getCategories({ userId, type: 'expense', parentId: null }) // Parent categories only
 * getCategories({ userId, type: 'expense', parentId: 'parent-id' }) // Subcategories of parent
 */
export function getCategories({
  userId,
  type,
  parentId,
  transactionsFrom,
  transactionsTo,
  isArchived,
  includeSubcategoriesWithTransactions
}: Params) {
  // Build the where conditions based on parentId parameter
  const parentCondition =
    parentId === undefined
      ? undefined // No parent filter - get all categories
      : parentId === null
        ? isNull(categories.parentId) // Get only parent categories
        : eq(categories.parentId, parentId) // Get subcategories of specific parent

  // Always include transactions filtered by user/type/date range
  const baseTransactionsWhere = and(
    eq(transactions.userId, userId),
    eq(transactions.type, type),
    transactionsFrom ? gte(transactions.txDate, transactionsFrom) : undefined,
    transactionsTo ? lte(transactions.txDate, transactionsTo) : undefined
  )

  return db.query.categories.findMany({
    where: and(
      eq(categories.userId, userId),
      eq(categories.type, type),
      parentCondition,
      isArchived === undefined
        ? undefined
        : eq(categories.isArchived, isArchived)
    ),
    with: {
      transactions: {
        where: baseTransactionsWhere
      },
      ...(includeSubcategoriesWithTransactions
        ? {
            subcategories: {
              with: { transactions: { where: baseTransactionsWhere } }
            }
          }
        : {})
    },
    orderBy: [asc(categories.sortOrder), asc(categories.name)]
  })
}

export type GetCategoriesResult = Awaited<ReturnType<typeof getCategories>>
export type GetCategoriesResultItem = GetCategoriesResult[number]
