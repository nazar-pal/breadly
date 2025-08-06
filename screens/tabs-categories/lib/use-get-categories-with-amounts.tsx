import { categories } from '@/data/client/db-schema'
import { useGetCategories } from '@/data/client/queries'
import { useCategoryType } from '@/lib/hooks'
import { useUserSession } from '@/modules/session-and-migration'
import { InferSelectModel } from 'drizzle-orm'

export interface CategoryWithAmounts
  extends InferSelectModel<typeof categories> {
  amount: number
}

export function useGetCategoriesWithAmounts({
  transactionsFrom,
  transactionsTo,
  isArchived
}: {
  transactionsFrom: Date | null
  transactionsTo: Date | null
  isArchived: boolean
}): CategoryWithAmounts[] {
  const { userId } = useUserSession()
  const type = useCategoryType()

  const { data: categories } = useGetCategories({
    userId,
    type,
    parentId: null, // Only get parent categories (no subcategories)
    transactionsFrom: transactionsFrom ?? undefined,
    transactionsTo: transactionsTo ?? undefined,
    isArchived
  })

  const categoriesWithAmounts = categories.map(category => ({
    ...category,
    amount: category.transactions.reduce((acc, tx) => acc + tx.amount, 0)
  }))

  return categoriesWithAmounts
}
