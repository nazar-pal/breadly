import TestAuth from '@/components/categories/TestAuth'
import CalculatorModal from '@/components/shared/CalculatorModal'
import CategoryEditModal from '@/components/shared/CategoryEditModal'
import CategoryGrid from '@/components/shared/CategoryGrid'
import FinancialHeader from '@/components/shared/FinancialHeader'
import { CategoryProvider, useCategoryContext } from '@/context/CategoryContext'
import { useTheme } from '@/context/ThemeContext'
import {
  Briefcase,
  Building,
  Bus,
  Coffee,
  DollarSign,
  Film,
  Heart,
  Home,
  PiggyBank,
  Shirt,
  Target,
  TrendingUp,
  Users,
  UtensilsCrossed
} from 'lucide-react-native'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { runOnJS } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

// Map category names to icons for expenses
const categoryIcons: { [key: string]: React.ComponentType<any> } = {
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
const incomeCategoryIcons: { [key: string]: React.ComponentType<any> } = {
  Salary: Briefcase,
  Freelance: DollarSign,
  Investment: TrendingUp,
  Business: Building,
  Rental: Home,
  'Side Hustle': Target,
  Other: PiggyBank
}

function CategoriesContent() {
  const { colors } = useTheme()
  const insets = useSafeAreaInsets()
  const { canNavigate, navigatePrevious, navigateNext } = useCategoryContext()

  // Mock data - in real app these would come from state/API
  const totalExpenses = 1845
  const totalIncome = 6750

  const getCategoryIcon = (
    categoryName: string,
    type: 'expense' | 'income'
  ) => {
    const icons = type === 'expense' ? categoryIcons : incomeCategoryIcons
    const IconComponent = icons[categoryName] || Home

    // Use semantic colors based on category type
    const iconColor = type === 'expense' ? colors.expense : colors.income

    return <IconComponent size={20} color={iconColor} />
  }

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

  return (
    <GestureDetector gesture={panGesture}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            paddingTop: insets.top
          }
        ]}
      >
        <FinancialHeader
          totalExpenses={totalExpenses}
          totalIncome={totalIncome}
        />

        <TestAuth />

        <CategoryGrid getIcon={getCategoryIcon} />

        <CalculatorModal />

        <CategoryEditModal />
      </View>
    </GestureDetector>
  )
}

export default function CategoriesScreen() {
  return (
    <CategoryProvider>
      <CategoriesContent />
    </CategoryProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
