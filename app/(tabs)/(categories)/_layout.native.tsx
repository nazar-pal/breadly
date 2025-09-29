import { ModalAddTransaction } from '@/components/modals/add-transaction'
import { CategoryDetailsModal } from '@/components/modals/category-details'
import { useCategoriesDateRangeActions } from '@/lib/storage/categories-date-range-store'
import { TabsCategoriesHeader } from '@/screens/tabs-categories'
import { Slot } from 'expo-router'
import React from 'react'
import { View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { scheduleOnRN } from 'react-native-worklets'

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
          scheduleOnRN(navigatePrevious)
        } else if (translationX < -30) {
          // Swipe left - go to next period
          scheduleOnRN(navigateNext)
        }
      }
    })

  return <GestureDetector gesture={panGesture}>{children}</GestureDetector>
}

export default function CategoriesLayout() {
  return (
    <GestureDetectorContainer>
      <View className="flex-1 bg-background" collapsable={false}>
        <TabsCategoriesHeader />
        <Slot />
        <ModalAddTransaction />
        <CategoryDetailsModal />
      </View>
    </GestureDetectorContainer>
  )
}
