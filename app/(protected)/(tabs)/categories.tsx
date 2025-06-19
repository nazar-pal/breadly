import { CategoriesContent } from '@/components/categories/categories-content'
import { CategoriesContextProvider } from '@/components/categories/categories-context'

import React from 'react'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { runOnJS } from 'react-native-reanimated'

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

export default function CategoriesScreen() {
  return (
    <GestureDetectorContainer
      canNavigate={true}
      navigatePrevious={() => console.log('Navigate previous')}
      navigateNext={() => console.log('Navigate next')}
    >
      <CategoriesContextProvider>
        <CategoriesContent />
      </CategoriesContextProvider>
    </GestureDetectorContainer>
  )
}
