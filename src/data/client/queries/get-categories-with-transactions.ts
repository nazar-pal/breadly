import {
  categories,
  CATEGORY_TYPE,
  transactions
} from '@/data/client/db-schema'
import { db } from '@/system/powersync/system'
import { and, asc, eq, gte, isNull, lte } from 'drizzle-orm'

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
 * getCategoriesWithTransactions({ userId, type: 'expense' }) // All categories
 * getCategoriesWithTransactions({ userId, type: 'expense', parentId: null }) // Parent categories only
 * getCategoriesWithTransactions({ userId, type: 'expense', parentId: 'parent-id' }) // Subcategories of parent
 */
export function getCategoriesWithTransactions({
  userId,
  type,
  parentId,
  transactionsFrom,
  transactionsTo,
  isArchived,
  includeSubcategoriesWithTransactions
}: Params) {
  // parentId: undefined = all, null = root only, string = children of parent
  const parentCondition =
    parentId === undefined
      ? undefined
      : parentId === null
        ? isNull(categories.parentId)
        : eq(categories.parentId, parentId)

  const transactionsWhere = and(
    eq(transactions.userId, userId),
    eq(transactions.type, type),
    ...(transactionsFrom ? [gte(transactions.txDate, transactionsFrom)] : []),
    ...(transactionsTo ? [lte(transactions.txDate, transactionsTo)] : [])
  )

  return db.query.categories.findMany({
    where: and(
      eq(categories.userId, userId),
      eq(categories.type, type),
      ...(parentCondition ? [parentCondition] : []),
      ...(isArchived !== undefined
        ? [eq(categories.isArchived, isArchived)]
        : [])
    ),
    with: {
      transactions: {
        where: transactionsWhere
      },
      ...(includeSubcategoriesWithTransactions
        ? {
            subcategories: {
              with: { transactions: { where: transactionsWhere } }
            }
          }
        : {})
    },
    orderBy: [asc(categories.sortOrder), asc(categories.name)]
  })
}

export type GetCategoriesWithTransactionsResult = Awaited<
  ReturnType<typeof getCategoriesWithTransactions>
>
export type GetCategoriesWithTransactionsResultItem =
  GetCategoriesWithTransactionsResult[number]
