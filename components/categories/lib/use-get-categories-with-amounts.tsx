import { useGetCategories } from '@/lib/powersync/data/queries'
import { categories } from '@/lib/powersync/schema/table_4_categories'
import { InferSelectModel } from 'drizzle-orm'
import { use } from 'react'
import { CategoriesContext } from '../categories-context'
import { useCategoryType } from './use-category-type'

export interface CategoryWithAmounts
  extends InferSelectModel<typeof categories> {
  amount: number
}

export function useGetCategoriesWithAmounts(): CategoryWithAmounts[] {
  const { userId } = use(CategoriesContext)
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
