import { useUserSession } from '@/lib/hooks'
import { useSumTransactions } from '@/lib/powersync/data/queries'
import {
  useCategoriesActions,
  useDateRangeState
} from '@/lib/storage/categories-store'
import { getModeDisplayName } from '@/lib/storage/categories-store/utils/get-mode-display-name'
import { useTheme } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { Pressable, Text, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming
} from 'react-native-reanimated'
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
  const { colors } = useTheme()

  // Use enhanced date range state from categories store
  const { dateRangeMode, formattedRange, failedNavigateNextCounter } =
    useDateRangeState()

  const { openDateRangeModal } = useCategoriesActions()

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
  }, [failedNavigateNextCounter])

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

  return (
    <>
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

      {/* Date Range Modal */}
      <DateRangeModal triggerError={triggerError} />
    </>
  )
}
