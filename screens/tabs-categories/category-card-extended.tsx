import { cn } from '@/lib/utils'
import { formatCurrency } from '@/modules/statistics/utils'
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
          <Text
            numberOfLines={1}
            className={`text-sm font-bold ${
              category.type === 'income'
                ? category.amount > 0
                  ? 'text-income'
                  : 'text-muted-foreground'
                : category.amount > 0
                  ? 'text-foreground'
                  : 'text-muted-foreground'
            }`}
          >
            {formatCurrency(category.amount)}
          </Text>
        </View>
      </View>
    </Pressable>
  )
}
