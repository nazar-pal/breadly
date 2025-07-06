import { CategoriesHeader } from '@/components/categories/categories-header'
import { CategoriesHeaderNavBar } from '@/components/categories/categories-header-nav-bar'
import { CalculatorModal } from '@/components/categories/modal-add-transaction'
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
  canNavigateBackward,
  canNavigateForward,
  navigatePrevious,
  navigateNext,
  onNavigateNextBlocked
}: {
  children: React.ReactNode
  canNavigateBackward: boolean
  canNavigateForward: boolean
  navigatePrevious: () => void
  navigateNext: () => void
  onNavigateNextBlocked: () => void
}) {
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
          if (canNavigateBackward) {
            runOnJS(navigatePrevious)()
          } else {
            // Trigger feedback for blocked navigation
            runOnJS(onNavigateNextBlocked)()
          }
          // Note: No animation for blocked navigation - header animations provide feedback
        } else if (translationX < -30) {
          // Swipe left - go to next period
          if (canNavigateForward) {
            runOnJS(navigateNext)()
          } else {
            // Trigger feedback for blocked navigation
            runOnJS(onNavigateNextBlocked)()
          }
          // Note: No animation for blocked navigation - header animations provide feedback
        }
      }
    })

  return <GestureDetector gesture={panGesture}>{children}</GestureDetector>
}

export default function CategoriesLayout() {
  // Get date range state and navigation actions from store
  const { canNavigateBackward, canNavigateForward } = useDateRangeState()
  const { navigatePrevious, navigateNext, notifyFailedNavigateNext } =
    useCategoriesActions()

  return (
    <GestureDetectorContainer
      canNavigateBackward={canNavigateBackward}
      canNavigateForward={canNavigateForward}
      navigatePrevious={navigatePrevious}
      navigateNext={navigateNext}
      onNavigateNextBlocked={notifyFailedNavigateNext}
    >
      <View className="flex-1 bg-background" collapsable={false}>
        <View className="px-4 py-2">
          <CategoriesHeader />
          <CategoriesHeaderNavBar />
        </View>
        <Slot />
        <CalculatorModal />
      </View>
    </GestureDetectorContainer>
  )
}
