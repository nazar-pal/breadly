import {
  categories as categoriesTable,
  CategoryType
} from '@/data/client/db-schema'
import { getCategoriesWithTransactions } from '@/data/client/queries'
import { useDrizzleQuery } from '@/lib/hooks'
import { useUserSession } from '@/system/session-and-migration'
import { InferSelectModel } from 'drizzle-orm'

export interface CategoryCurrencyTotal {
  currencyId: string
  amount: number
}

export interface CategoryWithAmounts extends InferSelectModel<
  typeof categoriesTable
> {
  totalsByCurrency: CategoryCurrencyTotal[]
}

export function useGetCategoriesWithAmounts({
  transactionsFrom,
  transactionsTo,
  isArchived,
  type
}: {
  transactionsFrom: Date | null
  transactionsTo: Date | null
  isArchived: boolean
  type: CategoryType
}): CategoryWithAmounts[] {
  const { userId } = useUserSession()

  const { data: parentCategories } = useDrizzleQuery(
    getCategoriesWithTransactions({
      userId,
      type,
      parentId: null, // Only get parent categories (no subcategories)
      transactionsFrom: transactionsFrom ?? undefined,
      transactionsTo: transactionsTo ?? undefined,
      isArchived,
      includeSubcategoriesWithTransactions: true
    })
  )

  const list = parentCategories ?? []

  const categoriesWithAmounts = list.map(category => {
    const totalsMap = new Map<string, number>()

    // 1) Parent transactions
    for (const tx of category.transactions) {
      const current = totalsMap.get(tx.currencyId) ?? 0
      totalsMap.set(tx.currencyId, current + tx.amount)
    }

    // 2) Immediate children transactions (if any)
    if (category.subcategories && Array.isArray(category.subcategories)) {
      for (const child of category.subcategories) {
        for (const tx of ('transactions' in child ? child.transactions : []) ??
          []) {
          const current = totalsMap.get(tx.currencyId) ?? 0
          totalsMap.set(tx.currencyId, current + tx.amount)
        }
      }
    }

    const totalsByCurrency = Array.from(totalsMap.entries())
      .map(([currencyId, amount]) => ({ currencyId, amount }))
      .sort((a, b) => b.amount - a.amount)

    return { ...category, totalsByCurrency }
  })

  return categoriesWithAmounts
}
