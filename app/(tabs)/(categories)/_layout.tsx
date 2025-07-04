import { CategoriesHeader } from '@/components/categories/categories-header'
import { CalculatorModal } from '@/components/categories/modal-add-transaction'
import { CategoryModal } from '@/components/categories/modal-category'
import {
  useCategoriesActions,
  useDateRangeState
} from '@/lib/storage/categories-store'
import { Slot } from 'expo-router'
import React from 'react'
import { View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { runOnJS } from 'react-native-reanimated'

function GestureDetectorContainer({
  children,
  canNavigate,
  canNavigateForward,
  navigatePrevious,
  navigateNext
}: {
  children: React.ReactNode
  canNavigate: boolean
  canNavigateForward: boolean
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
          if (canNavigateForward) {
            runOnJS(navigateNext)()
          }
          // Note: No animation for blocked navigation - header animations provide feedback
        }
      }
    })

  return <GestureDetector gesture={panGesture}>{children}</GestureDetector>
}

export default function CategoriesLayout() {
  // Get date range state and navigation actions from store
  const { canNavigate, canNavigateForward } = useDateRangeState()
  const { navigatePrevious, navigateNext } = useCategoriesActions()

  return (
    <GestureDetectorContainer
      canNavigate={canNavigate}
      canNavigateForward={canNavigateForward}
      navigatePrevious={navigatePrevious}
      navigateNext={navigateNext}
    >
      <View className="flex-1 bg-background" collapsable={false}>
        <CategoriesHeader />
        <Slot />
        <CalculatorModal />
        <CategoryModal />
      </View>
    </GestureDetectorContainer>
  )
}
