import { CategoriesHeader } from '@/components/categories/categories-header'
import { CategoryCardsGrid } from '@/components/categories/category-cards-grid'
import { CalculatorModal } from '@/components/categories/modal-add-transaction'
import { AddCategoryModal } from '@/components/categories/modal-category-add'
import { CategoryEditModal } from '@/components/categories/modal-category-edit'
import { useCategories } from '@/hooks/useCategories'
import { useCategoryUI } from '@/hooks/useCategoryUI'
import { useTransactions } from '@/hooks/useTransactions'
import { trpc } from '@/trpc/react'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export function CategoriesContent() {
  const insets = useSafeAreaInsets()
  const { categories, isLoading } = useCategories()
  const { rawTransactions } = useTransactions()
  const categoryUI = useCategoryUI()

  // Calculate totals from actual transactions using the new TRPC procedure
  const expenseQueryOptions = trpc.transactions.getTotalAmount.queryOptions({
    transactionType: 'expense'
  })
  const incomeQueryOptions = trpc.transactions.getTotalAmount.queryOptions({
    transactionType: 'income'
  })

  const { data: expenseData } = useQuery(expenseQueryOptions)
  const { data: incomeData } = useQuery(incomeQueryOptions)

  const totalExpenses = expenseData?.totalAmount || 0
  const totalIncome = incomeData?.totalAmount || 0

  // Filter categories based on current tab
  const currentCategories = categories.filter(category =>
    categoryUI.currentType === 'expense'
      ? category.type === 'expense'
      : category.type === 'income'
  )

  // Add amount to each category using client-side calculation
  // This works properly now thanks to cache invalidation when transactions change
  const categoriesWithAmounts = React.useMemo(() => {
    return currentCategories.map(category => {
      const amount = rawTransactions
        .filter((transaction: any) => transaction.categoryId === category.id)
        .reduce(
          (total: number, transaction: any) =>
            total + parseFloat(transaction.amount.toString()),
          0
        )

      return {
        ...category,
        amount
      }
    })
  }, [currentCategories, rawTransactions])

  return (
    <View
      className="flex-1 bg-background"
      style={{
        paddingTop: insets.top
      }}
      collapsable={false}
    >
      <CategoriesHeader
        totalExpenses={totalExpenses}
        totalIncome={totalIncome}
        categoryUI={categoryUI}
      />

      <CategoryCardsGrid
        categories={categoriesWithAmounts}
        isLoading={isLoading}
        categoryUI={categoryUI}
      />

      <CalculatorModal categoryUI={categoryUI} />

      <CategoryEditModal categoryUI={categoryUI} />

      <AddCategoryModal categoryUI={categoryUI} />
    </View>
  )
}
