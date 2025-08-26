import { cn, formatCurrency } from '@/lib/utils'
import React, { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { CategoryCardIcon } from './category-card-icon'
import { CategoryWithAmounts } from './lib/use-get-categories-with-amounts'

interface Props {
  category: CategoryWithAmounts
  className?: string
  onPress: (categoryId: string) => void
  onLongPress?: () => void
}

export function CategoryCard({
  category,
  className,
  onPress,
  onLongPress
}: Props) {
  const [isPressed, setIsPressed] = useState(false)

  const renderTotals = () => {
    const totals = category.totalsByCurrency.filter(t => t.amount > 0)
    if (totals.length === 0) return '0'
    if (totals.length === 1)
      return formatCurrency(totals[0].amount, totals[0].currencyId)
    return totals.map(t => formatCurrency(t.amount, t.currencyId)).join(' + ')
  }

  const handlePressIn = () => {
    setIsPressed(true)
  }

  const handlePressOut = () => {
    setIsPressed(false)
  }

  return (
    <Pressable
      className={cn(
        'relative flex-row items-center',
        isPressed && 'opacity-70',
        className
      )}
      onPress={() => onPress(category.id)}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      delayLongPress={500}
    >
      <CategoryCardIcon name={category.icon} type={category.type} />

      <View className="ml-3 flex-1">
        <Text
          numberOfLines={1}
          className="mb-0.5 text-sm font-semibold text-foreground"
        >
          {category.name}
        </Text>
        <Text
          numberOfLines={1}
          className={`text-[13px] ${
            category.type === 'income'
              ? category.totalsByCurrency.some(t => t.amount > 0)
                ? 'text-income'
                : 'text-muted-foreground'
              : category.totalsByCurrency.some(t => t.amount > 0)
                ? 'text-foreground'
                : 'text-muted-foreground'
          }`}
        >
          {renderTotals()}
        </Text>
      </View>
    </Pressable>
  )
}
