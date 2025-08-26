import { categories } from '@/data/client/db-schema'
import { useGetCategories } from '@/data/client/queries'
import { useCategoryType } from '@/lib/hooks'
import { useUserSession } from '@/modules/session-and-migration'
import { InferSelectModel } from 'drizzle-orm'

export interface CategoryCurrencyTotal {
  currencyId: string
  amount: number
}

export interface CategoryWithAmounts
  extends InferSelectModel<typeof categories> {
  totalsByCurrency: CategoryCurrencyTotal[]
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

  const categoriesWithAmounts = categories.map(category => {
    const totalsMap = new Map<string, number>()

    for (const tx of category.transactions) {
      const current = totalsMap.get(tx.currencyId) ?? 0
      totalsMap.set(tx.currencyId, current + tx.amount)
    }

    const totalsByCurrency = Array.from(totalsMap.entries())
      .map(([currencyId, amount]) => ({ currencyId, amount }))
      .sort((a, b) => b.amount - a.amount)

    return {
      ...category,
      totalsByCurrency
    }
  })

  return categoriesWithAmounts
}
