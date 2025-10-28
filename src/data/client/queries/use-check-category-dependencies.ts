import { useDrizzleQuery } from '@/lib/hooks'
import { db } from '@/system/powersync/system'
import { and, count, eq } from 'drizzle-orm'
import { categories, transactions } from '../db-schema'

export function useCheckCategoryDependencies({
  userId,
  categoryId
}: {
  userId: string
  categoryId: string
}) {
  // Check for transactions using this category
  const transactionsQuery = db
    .select({
      count: count()
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.userId, userId),
        eq(transactions.categoryId, categoryId)
      )
    )

  // Check for subcategories (children) of this category
  const subcategoriesQuery = db
    .select({
      count: count()
    })
    .from(categories)
    .where(
      and(eq(categories.userId, userId), eq(categories.parentId, categoryId))
    )

  const transactionsResult = useDrizzleQuery(transactionsQuery)
  const subcategoriesResult = useDrizzleQuery(subcategoriesQuery)

  const isLoading =
    transactionsResult.isLoading || subcategoriesResult.isLoading

  const hasTransactions =
    !transactionsResult.isLoading && transactionsResult.data?.[0]?.count > 0

  const hasSubcategories =
    !subcategoriesResult.isLoading && subcategoriesResult.data?.[0]?.count > 0

  const hasDependencies = hasTransactions || hasSubcategories
  const canDelete = !hasDependencies

  return {
    isLoading,
    hasTransactions,
    hasSubcategories,
    hasDependencies,
    canDelete,
    transactionCount: transactionsResult.data?.[0]?.count || 0,
    subcategoryCount: subcategoriesResult.data?.[0]?.count || 0
  }
}
