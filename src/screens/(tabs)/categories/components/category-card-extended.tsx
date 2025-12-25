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

export function CategoryCardExtended({
  category,
  className,
  onPress,
  onLongPress
}: Props) {
  const [isPressed, setIsPressed] = useState(false)

  const totals = category.totalsByCurrency
    .filter(t => t.amount > 0)
    .sort((a, b) => b.amount - a.amount)
  const displayTotals = totals.slice(0, 1)

  const handlePressIn = () => {
    setIsPressed(true)
  }

  const handlePressOut = () => {
    setIsPressed(false)
  }

  return (
    <Pressable
      className={cn(
        'relative flex-col justify-between',
        isPressed && 'opacity-70',
        className
      )}
      onPress={() => onPress(category.id)}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      delayLongPress={500}
    >
      {/* Category Name - Top Section */}
      <View className="mb-1.5">
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          className="text-foreground text-base leading-5 font-semibold"
        >
          {category.name}
        </Text>
      </View>

      {/* Icon and Amount - Bottom Section */}
      <View className="flex-row items-center justify-between">
        <CategoryCardIcon name={category.icon} type={category.type} />

        <View className="ml-2 flex-1 items-end">
          <View className="flex-row justify-end gap-1">
            {displayTotals.length > 0 &&
              displayTotals.map(t => (
                <View
                  key={t.currencyId}
                  className="bg-secondary rounded-full px-2 py-0.5"
                >
                  <Text
                    className={`text-xs font-semibold ${
                      category.type === 'income'
                        ? 'text-income'
                        : 'text-foreground'
                    }`}
                  >
                    {formatCurrency(t.amount, t.currencyId)}
                  </Text>
                </View>
              ))}

            {displayTotals.length === 0 && (
              <View className="bg-secondary rounded-full px-2 py-0.5">
                <Text className="text-muted-foreground text-xs font-semibold">
                  0
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  )
}
