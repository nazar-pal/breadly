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
      <View className="mb-3">
        <Text
          numberOfLines={2}
          className="text-base font-semibold leading-5 text-foreground"
        >
          {category.name}
        </Text>
      </View>

      {/* Icon and Amount - Bottom Section */}
      <View className="flex-row items-center justify-between">
        <CategoryCardIcon name={category.icon} type={category.type} />

        <View className="ml-3 flex-1 items-end">
          <View className="flex-row flex-wrap justify-end gap-1">
            {totals.length > 0 &&
              totals.map(t => (
                <View
                  key={t.currencyId}
                  className="rounded-full bg-secondary px-2 py-0.5"
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

            {totals.length === 0 && (
              <View className="rounded-full bg-secondary px-2 py-0.5">
                <Text className="text-xs font-semibold text-muted-foreground">
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
