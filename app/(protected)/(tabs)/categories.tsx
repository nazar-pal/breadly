import AddCategoryModal from '@/components/shared/AddCategoryModal'
import CalculatorModal from '@/components/shared/CalculatorModal'
import { CategoryCardsGrid } from '@/components/shared/category-cards-grid'
import CategoryEditModal from '@/components/shared/CategoryEditModal'
import FinancialHeader from '@/components/shared/FinancialHeader'
import { useCategories } from '@/hooks/useCategories'
import { useCategoryUI } from '@/hooks/useCategoryUI'
import { useTransactions } from '@/hooks/useTransactions'
import { trpc } from '@/trpc/react'
import { useQuery } from '@tanstack/react-query'

import React from 'react'
import { View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { runOnJS } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

function GestureDetectorContainer({
  children,
  canNavigate,
  navigatePrevious,
  navigateNext
}: {
  children: React.ReactNode
  canNavigate: boolean
  navigatePrevious: () => void
  navigateNext: () => void
}) {
  // Create pan gesture for full-screen swipe support
  const panGesture = Gesture.Pan()
    .minDistance(30)
    .onEnd(event => {
      'worklet'
      // Only handle swipes if navigation is enabled
      if (!canNavigate) return

      const { translationX, velocityX } = event

      // Require minimum velocity for swipe detection
      if (Math.abs(velocityX) > 200) {
        if (translationX > 30) {
          // Swipe right - go to previous period
          runOnJS(navigatePrevious)()
        } else if (translationX < -30) {
          // Swipe left - go to next period
          runOnJS(navigateNext)()
        }
      }
    })

  return <GestureDetector gesture={panGesture}>{children}</GestureDetector>
}

function CategoriesContent() {
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
      <FinancialHeader
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

export default function CategoriesScreen() {
  return (
    <GestureDetectorContainer
      canNavigate={true}
      navigatePrevious={() => console.log('Navigate previous')}
      navigateNext={() => console.log('Navigate next')}
    >
      <CategoriesContent />
    </GestureDetectorContainer>
  )
}
