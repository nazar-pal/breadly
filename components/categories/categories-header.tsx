import { useUserSession } from '@/lib/hooks'
import { useSumTransactions } from '@/lib/powersync/data/queries'
import {
  useCategoriesActions,
  useDateRangeState
} from '@/lib/storage/categories-store'
import { useTheme } from '@react-navigation/native'
import { Link } from 'expo-router'
import React, { useEffect } from 'react'
import { Pressable, Text, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming
} from 'react-native-reanimated'
import { useCategoryType } from './lib/use-category-type'
import { DateRangeModal } from './modal-transactions-date-range'

// Animated Text Component for slide transitions
function AnimatedValue({
  value,
  style,
  animationKey,
  shakeKey
}: {
  value: string | number
  style?: any
  animationKey: string | number
  shakeKey?: string | number
}) {
  const translateY = useSharedValue(0)
  const translateX = useSharedValue(0)
  const opacity = useSharedValue(1)

  // Vertical slide / fade when the displayed value changes (normal behaviour)
  useEffect(() => {
    translateY.value = withSequence(
      withTiming(-30, { duration: 200 }), // Slide up and fade out
      withTiming(30, { duration: 0 }), // Jump to bottom position
      withTiming(0, { duration: 200 }) // Slide in from bottom
    )

    opacity.value = withSequence(
      withTiming(0, { duration: 200 }), // Fade out
      withTiming(1, { duration: 200 }) // Fade in
    )
  }, [animationKey])

  // Horizontal shake when shakeKey changes (error feedback)
  useEffect(() => {
    if (shakeKey === undefined) return

    translateX.value = withSequence(
      withTiming(-6, { duration: 50 }),
      withTiming(6, { duration: 50 }),
      withTiming(-6, { duration: 50 }),
      withTiming(6, { duration: 50 }),
      withTiming(0, { duration: 50 })
    )
  }, [shakeKey])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value }
    ],
    opacity: opacity.value
  }))

  return <Animated.Text style={[style, animatedStyle]}>{value}</Animated.Text>
}

export function CategoriesHeader() {
  const { userId } = useUserSession()
  const activeCategoryType = useCategoryType()
  const { colors } = useTheme()

  // Use enhanced date range state from categories store
  const {
    isDateRangeModalOpen,
    dateRangeMode,
    formattedRange,
    canNavigate,
    canNavigateForward,
    getModeDisplayName,
    failedNavigateNextCounter
  } = useDateRangeState()

  const {
    openDateRangeModal,
    closeDateRangeModal,
    setDateRangeMode,
    navigatePrevious,
    navigateNext
  } = useCategoriesActions()

  // Local feedback state
  const [shakeKey, setShakeKey] = React.useState(0)
  const [highlightOn, setHighlightOn] = React.useState(false)

  // Helper: trigger shake + red flash
  const triggerError = () => {
    setShakeKey(prev => prev + 1)
    setHighlightOn(true)
    setTimeout(() => setHighlightOn(false), 600)
  }

  // Listen for failed navigation attempts coming from outside (e.g., swipe gesture)
  const prevFailedCounterRef = React.useRef(failedNavigateNextCounter)
  useEffect(() => {
    if (failedNavigateNextCounter !== prevFailedCounterRef.current) {
      triggerError()
      prevFailedCounterRef.current = failedNavigateNextCounter
    }
  }, [failedNavigateNextCounter, triggerError])

  const totalExpensesResult = useSumTransactions({
    userId,
    type: 'expense'
  })
  const totalIncomeResult = useSumTransactions({
    userId,
    type: 'income'
  })

  const totalExpenses = Number(totalExpensesResult.data?.[0]?.totalAmount || 0)
  const totalIncome = Number(totalIncomeResult.data?.[0]?.totalAmount || 0)

  const netBalance = totalIncome - totalExpenses

  // Animation key for date range only
  const dateRangeKey = `${formattedRange}-${dateRangeMode}`

  const handleNavigateNext = () => {
    if (canNavigateForward) {
      navigateNext()
    } else {
      triggerError()
    }
  }

  return (
    <View className="px-4 py-2">
      {/* Top Row: Balance and Date Range */}
      <View className="mb-2 flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="mb-0.5 text-xs text-foreground">Net Balance</Text>
          <Text
            style={{
              fontSize: 28,
              fontWeight: 'bold',
              color: netBalance >= 0 ? colors.primary : colors.notification
            }}
          >
            {`$${Math.abs(netBalance).toFixed(2)}`}
          </Text>
        </View>

        <Pressable onPress={openDateRangeModal} className="items-end">
          <AnimatedValue
            value={formattedRange}
            animationKey={dateRangeKey}
            shakeKey={shakeKey}
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: highlightOn ? colors.notification : colors.text
            }}
          />
          <AnimatedValue
            value={getModeDisplayName(dateRangeMode)}
            animationKey={dateRangeKey}
            shakeKey={shakeKey}
            style={{
              marginTop: 2,
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: 1,
              color: highlightOn ? colors.notification : colors.text
            }}
          />
        </Pressable>
      </View>

      {/* Tab Navigation */}
      <View className="mt-1 flex-row gap-2">
        <Link href="/(tabs)/(categories)" asChild>
          <Pressable
            className={`mb-1 mt-2 flex-1 items-center rounded-md px-2 py-2 ${
              activeCategoryType === 'expense'
                ? 'border border-primary bg-primary/10'
                : 'bg-transparent'
            }`}
          >
            <Text
              className={`mb-0.5 text-base font-semibold ${
                activeCategoryType === 'expense'
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              Expenses
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '500',
                color:
                  activeCategoryType === 'expense'
                    ? colors.notification
                    : colors.text
              }}
            >
              {`$${totalExpenses.toFixed(2)}`}
            </Text>
          </Pressable>
        </Link>

        <Link href="/(tabs)/(categories)/incomes" asChild>
          <Pressable
            className={`mb-1 mt-2 flex-1 items-center rounded-md px-2 py-2 ${
              activeCategoryType === 'income'
                ? 'border border-primary bg-primary/10'
                : 'bg-transparent'
            }`}
          >
            <Text
              className={`mb-0.5 text-base font-semibold ${
                activeCategoryType === 'income'
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              Income
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '500',
                color:
                  activeCategoryType === 'income' ? colors.primary : colors.text
              }}
            >
              {`$${totalIncome.toFixed(2)}`}
            </Text>
          </Pressable>
        </Link>
      </View>

      {/* Date Range Modal */}
      <DateRangeModal
        visible={isDateRangeModalOpen}
        currentMode={dateRangeMode}
        onSelectMode={setDateRangeMode}
        onClose={closeDateRangeModal}
        canNavigate={canNavigate}
        navigatePrevious={navigatePrevious}
        navigateNext={handleNavigateNext}
        formattedRange={formattedRange}
      />
    </View>
  )
}
