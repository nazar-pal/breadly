import { toCompilableQuery } from '@powersync/drizzle-driver'
import { useQuery } from '@powersync/react-native'
import { and, count, eq } from 'drizzle-orm'
import { categories } from '../../schema/table_4_categories'
import { budgets } from '../../schema/table_5_budgets'
import { transactions } from '../../schema/table_7_transactions'
import { db } from '../../system'

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

  // Check for budgets using this category
  const budgetsQuery = db
    .select({
      count: count()
    })
    .from(budgets)
    .where(and(eq(budgets.userId, userId), eq(budgets.categoryId, categoryId)))

  // Check for subcategories (children) of this category
  const subcategoriesQuery = db
    .select({
      count: count()
    })
    .from(categories)
    .where(
      and(eq(categories.userId, userId), eq(categories.parentId, categoryId))
    )

  const transactionsResult = useQuery(toCompilableQuery(transactionsQuery))
  const budgetsResult = useQuery(toCompilableQuery(budgetsQuery))
  const subcategoriesResult = useQuery(toCompilableQuery(subcategoriesQuery))

  const isLoading =
    transactionsResult.isLoading ||
    budgetsResult.isLoading ||
    subcategoriesResult.isLoading

  const hasTransactions =
    !transactionsResult.isLoading && transactionsResult.data?.[0]?.count > 0

  const hasBudgets =
    !budgetsResult.isLoading && budgetsResult.data?.[0]?.count > 0

  const hasSubcategories =
    !subcategoriesResult.isLoading && subcategoriesResult.data?.[0]?.count > 0

  const hasDependencies = hasTransactions || hasBudgets || hasSubcategories
  const canDelete = !hasDependencies

  return {
    isLoading,
    hasTransactions,
    hasBudgets,
    hasSubcategories,
    hasDependencies,
    canDelete,
    transactionCount: transactionsResult.data?.[0]?.count || 0,
    budgetCount: budgetsResult.data?.[0]?.count || 0,
    subcategoryCount: subcategoriesResult.data?.[0]?.count || 0
  }
}
