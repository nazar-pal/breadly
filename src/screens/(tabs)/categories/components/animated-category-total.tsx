import React from 'react'
import { Text, View } from 'react-native'
import Animated from 'react-native-reanimated'
import {
  CategoryCurrencyTotal,
  useCategoryTotalAnimation
} from './lib/use-category-total-animation'

interface AnimatedCategoryTotalProps {
  categoryType: 'expense' | 'income'
  totalsByCurrency: CategoryCurrencyTotal[]
}

/**
 * Renders the category totals with a slide animation when updated.
 * The animation triggers automatically when a transaction is created
 * (via `markTransactionCreated`) and the total value changes.
 */
export function AnimatedCategoryTotal({
  categoryType,
  totalsByCurrency
}: AnimatedCategoryTotalProps) {
  const { animatedStyle, currentTotals } =
    useCategoryTotalAnimation(totalsByCurrency)

  const hasPositiveAmount = totalsByCurrency.some(t => t.amount > 0)
  const textColorClass =
    categoryType === 'income'
      ? hasPositiveAmount
        ? 'text-income'
        : 'text-muted-foreground'
      : hasPositiveAmount
        ? 'text-foreground'
        : 'text-muted-foreground'

  return (
    <View className="overflow-hidden">
      <Animated.View style={animatedStyle}>
        <Text numberOfLines={1} className={`text-[12px] ${textColorClass}`}>
          {currentTotals}
        </Text>
      </Animated.View>
    </View>
  )
}
