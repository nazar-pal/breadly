import { useGetCategories } from '@/lib/powersync/data/queries'
import { categories } from '@/lib/powersync/schema/table_4_categories'
import { useUserSession } from '@/lib/user-session'
import { InferSelectModel } from 'drizzle-orm'
import { useCategoryType } from './use-category-type'

export interface CategoryWithAmounts
  extends InferSelectModel<typeof categories> {
  amount: number
}

export function useGetCategoriesWithAmounts(): CategoryWithAmounts[] {
  const { userId } = useUserSession()
  const type = useCategoryType()

  const { data: categories } = useGetCategories({
    userId,
    type
  })

  const categoriesWithAmounts = categories.map(category => ({
    ...category,
    amount: category.transactions.reduce((acc, tx) => acc + tx.amount, 0)
  }))

  return categoriesWithAmounts
}
