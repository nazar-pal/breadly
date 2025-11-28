import { CategoryType } from '@/data/client/db-schema'
import { getUserPreferences } from '@/data/client/queries'
import { useDrizzleQuery } from '@/lib/hooks'
import { useCategoriesDateRangeActions } from '@/lib/storage/categories-date-range-store'
import { openExpenseIncomeBottomSheet } from '@/screens/(modals)/add-transaction'
import { CategoryCardsGrid } from '@/screens/(tabs)/categories/components/category-cards-grid'
import { useUserSession } from '@/system/session-and-migration/hooks'
import { router } from 'expo-router'
import React from 'react'
import { View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { scheduleOnRN } from 'react-native-worklets'
import { TabsCategoriesHeader } from './components/tabs-categories-header'

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

export default function TabsCategoriesScreen({ type }: { type: CategoryType }) {
  const { userId } = useUserSession()

  const { data: preferences } = useDrizzleQuery(getUserPreferences({ userId }))
  const currencyCode = preferences?.[0]?.defaultCurrency?.code || 'USD'

  const openTransactionModal = (categoryId: string) =>
    openExpenseIncomeBottomSheet({
      type,
      categoryId,
      currencyCode
    })

  const openCategoryDetailsModal = (categoryId: string) =>
    router.push({ pathname: '/category-details', params: { categoryId } })

  return (
    <GestureDetectorContainer>
      <View className="bg-background flex-1" collapsable={false}>
        <TabsCategoriesHeader type={type} />
        <CategoryCardsGrid
          onPress={openTransactionModal}
          onLongPress={openCategoryDetailsModal}
          type={type}
        />
      </View>
    </GestureDetectorContainer>
  )
}
