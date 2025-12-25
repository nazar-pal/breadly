import { categoryTotalAnimationStore } from '@/lib/storage/category-total-animation-store'
import { formatCurrency } from '@/lib/utils'
import { useEffect, useRef } from 'react'
import {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming
} from 'react-native-reanimated'

export interface CategoryCurrencyTotal {
  currencyId: string
  amount: number
}

const ANIMATION_DURATION = 300
const ANIMATION_WINDOW_MS = 2000

/**
 * Hook that handles the animated value transition for category totals.
 * When a transaction is created (via `markTransactionCreated`), any category
 * whose total changes within 2 seconds will show a slide animation.
 */
export function useCategoryTotalAnimation(
  totalsByCurrency: CategoryCurrencyTotal[]
) {
  const lastTransactionCreatedAt = categoryTotalAnimationStore(
    state => state.lastTransactionCreatedAt
  )
  const translateY = useSharedValue(0)
  const opacity = useSharedValue(1)
  const prevTotalsRef = useRef<string>('')

  const currentTotals = formatTotals(totalsByCurrency)

  useEffect(() => {
    const isRecentTransaction =
      lastTransactionCreatedAt !== null &&
      Date.now() - lastTransactionCreatedAt < ANIMATION_WINDOW_MS

    const valueChanged =
      prevTotalsRef.current !== '' && prevTotalsRef.current !== currentTotals
    const justMounted = prevTotalsRef.current === ''

    if (isRecentTransaction && (valueChanged || justMounted)) {
      // Animate: slide old value up and fade out, then slide new value in from bottom
      translateY.value = withSequence(
        withTiming(-16, { duration: ANIMATION_DURATION }),
        withTiming(16, { duration: 0 }),
        withTiming(0, { duration: ANIMATION_DURATION })
      )

      opacity.value = withSequence(
        withTiming(0, { duration: ANIMATION_DURATION }),
        withTiming(1, { duration: ANIMATION_DURATION })
      )

      // Clear marker after animation to prevent re-animating
      categoryTotalAnimationStore.getState().clearTransactionMarker()
    }

    prevTotalsRef.current = currentTotals
  }, [lastTransactionCreatedAt, currentTotals, translateY, opacity])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value
  }))

  return { animatedStyle, currentTotals }
}

function formatTotals(totalsByCurrency: CategoryCurrencyTotal[]): string {
  const totals = totalsByCurrency.filter(t => t.amount > 0)
  if (totals.length === 0) return '0'
  if (totals.length === 1)
    return formatCurrency(totals[0].amount, totals[0].currencyId)
  return totals.map(t => formatCurrency(t.amount, t.currencyId)).join(' + ')
}
