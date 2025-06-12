import AddCategoryModal from '@/components/shared/AddCategoryModal'
import CalculatorModal from '@/components/shared/CalculatorModal'
import CategoryEditModal from '@/components/shared/CategoryEditModal'
import CategoryGrid from '@/components/shared/CategoryGrid'
import FinancialHeader from '@/components/shared/FinancialHeader'
import { useCategories } from '@/hooks/useCategories'
import { useCategoryUI } from '@/hooks/useCategoryUI'
import { useTransactions } from '@/hooks/useTransactions'
import { iconWithClassName } from '@/lib/icons/iconWithClassName'
import { trpc } from '@/trpc/react'
import { useQuery } from '@tanstack/react-query'
import {
  Briefcase,
  Building,
  Bus,
  Coffee,
  DollarSign,
  Film,
  Heart,
  Home,
  LucideIcon,
  PiggyBank,
  Shirt,
  Target,
  TrendingUp,
  Users,
  UtensilsCrossed
} from 'lucide-react-native'
import React from 'react'
import { View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { runOnJS } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

// Map category names to icons for expenses
const categoryIcons: { [key: string]: LucideIcon } = {
  Coffee: Coffee,
  Dining: UtensilsCrossed,
  Entertainment: Film,
  Transportation: Bus,
  Health: Heart,
  Home: Home,
  Family: Users,
  Shopping: Shirt
}

// Map income category names to icons
const incomeCategoryIcons: { [key: string]: LucideIcon } = {
  Salary: Briefcase,
  Freelance: DollarSign,
  Investment: TrendingUp,
  Business: Building,
  Rental: Home,
  'Side Hustle': Target,
  Other: PiggyBank
}

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
  const { transactions } = useTransactions()
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
      const amount = transactions
        .filter(transaction => transaction.categoryId === category.id)
        .reduce(
          (total, transaction) => total + parseFloat(transaction.amount),
          0
        )

      return {
        ...category,
        amount
      }
    })
  }, [currentCategories, transactions])

  const getCategoryIcon = (
    categoryName: string,
    type: 'expense' | 'income'
  ) => {
    const icons = type === 'expense' ? categoryIcons : incomeCategoryIcons
    const IconComponent = icons[categoryName] || Home
    iconWithClassName(IconComponent)
    return (
      <IconComponent
        size={20}
        className={type === 'expense' ? 'text-expense' : 'text-income'}
      />
    )
  }

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

      <CategoryGrid
        getIcon={getCategoryIcon}
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
