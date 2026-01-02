import { CategoryType } from '@/data/client/db-schema'
import { getAccount, getUserPreferences } from '@/data/client/queries'
import { useDrizzleQuery } from '@/lib/hooks'
import {
  useCategoriesDateRangeActions,
  useCategoriesDateRangeState
} from '@/lib/storage/categories-date-range-store'
import { categoryTotalAnimationStore } from '@/lib/storage/category-total-animation-store'
import { useLastParams } from '@/lib/storage/last-transaction-params-store'
import { openExpenseIncomeBottomSheet } from '@/screens/(modals)/add-transaction'
import { CategoryCardsGrid } from '@/screens/(tabs)/categories/components/category-cards-grid'
import { useUserSession } from '@/system-v2/session'
import { router } from 'expo-router'
import React, { useEffect, useRef } from 'react'
import { View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { scheduleOnRN } from 'react-native-worklets'
import { TabsCategoriesHeader } from './components/tabs-categories-header'

function GestureDetectorContainer({ children }: { children: React.ReactNode }) {
  const { navigatePrevious, navigateNext } = useCategoriesDateRangeActions()
  const { dateRange } = useCategoriesDateRangeState()

  // Clear the animation marker when navigating between date periods
  // This prevents stale animations when viewing a period where a transaction was created earlier
  const prevDateRangeRef = useRef(dateRange)
  useEffect(() => {
    if (prevDateRangeRef.current !== dateRange) {
      categoryTotalAnimationStore.getState().clearTransactionMarker()
      prevDateRangeRef.current = dateRange
    }
  }, [dateRange])

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

  const {
    data: [userPreferences]
  } = useDrizzleQuery(getUserPreferences({ userId }))

  const lastParams = useLastParams(state => state[type])

  const lastAccountId =
    lastParams.from === 'account' ? lastParams.id : undefined
  const {
    data: [lastAccount]
  } = useDrizzleQuery(
    lastAccountId ? getAccount({ userId, accountId: lastAccountId }) : undefined
  )

  const lastCurrencyCode =
    lastParams.from === 'currency' ? lastParams.id : undefined

  const currencyCode =
    lastCurrencyCode || userPreferences?.defaultCurrency?.code || 'USD'

  const openTransactionModal = (categoryId: string) =>
    openExpenseIncomeBottomSheet(
      lastAccount && lastAccount.type === 'payment'
        ? { type, categoryId, accountId: lastAccount.id }
        : { type, categoryId, currencyCode }
    )

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
