import AddCategoryModal from '@/components/shared/AddCategoryModal'
import CalculatorModal from '@/components/shared/CalculatorModal'
import CategoryEditModal from '@/components/shared/CategoryEditModal'
import CategoryGrid from '@/components/shared/CategoryGrid'
import FinancialHeader from '@/components/shared/FinancialHeader'
import { useCategories } from '@/hooks/useCategories'
import { useCategoryUI } from '@/hooks/useCategoryUI'
import { iconWithClassName } from '@/lib/icons/iconWithClassName'
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
  const categoryUI = useCategoryUI()

  // TODO: Calculate totals from actual transactions/budgets
  const totalExpenses = 1845 // Mock value for now
  const totalIncome = 6750 // Mock value for now

  // Filter categories based on current tab
  const currentCategories = categories.filter(category =>
    categoryUI.currentType === 'expense'
      ? category.type === 'expense'
      : category.type === 'income'
  )

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

  // Mock navigation functions for now
  const canNavigate = true
  const navigatePrevious = () => console.log('Navigate previous')
  const navigateNext = () => console.log('Navigate next')

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
        categories={currentCategories}
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
  const canNavigate = true
  const navigatePrevious = () => console.log('Navigate previous')
  const navigateNext = () => console.log('Navigate next')

  return (
    <GestureDetectorContainer
      canNavigate={canNavigate}
      navigatePrevious={navigatePrevious}
      navigateNext={navigateNext}
    >
      <CategoriesContent />
    </GestureDetectorContainer>
  )
}
