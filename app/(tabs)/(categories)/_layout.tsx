import { CategoriesHeader } from '@/components/categories/categories-header'
import { CategoriesHeaderNavBar } from '@/components/categories/categories-header-nav-bar'
import { CategoryViewToggle } from '@/components/categories/category-view-toggle'
import { CalculatorModal } from '@/components/categories/modal-add-transaction'
import { CategoryDetailsModal } from '@/components/categories/modal-category-details'
import { useCategoriesDateRangeActions } from '@/lib/storage/categories-date-range-store'
import { Slot } from 'expo-router'
import React from 'react'
import { View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { runOnJS } from 'react-native-reanimated'

function GestureDetectorContainer({ children }: { children: React.ReactNode }) {
  const { navigatePrevious, navigateNext } = useCategoriesDateRangeActions()

  // Create pan gesture for full-screen swipe support
  const panGesture = Gesture.Pan()
    .minDistance(30)
    .onEnd(event => {
      'worklet'

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

export default function CategoriesLayout() {
  return (
    <GestureDetectorContainer>
      <View className="flex-1 bg-background" collapsable={false}>
        <View className="px-4 py-2">
          <CategoriesHeader />
          <CategoriesHeaderNavBar />
        </View>
        <CategoryViewToggle />
        <Slot />
        <CalculatorModal />
        <CategoryDetailsModal />
      </View>
    </GestureDetectorContainer>
  )
}
