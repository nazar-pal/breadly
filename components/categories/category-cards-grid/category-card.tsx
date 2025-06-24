import { cn } from '@/lib/utils'
import React, { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { CategoryWithAmounts } from '../lib/use-get-categories-with-amounts'
import { CategoryCardIcon } from './category-card-icon'

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

  const handlePressIn = () => {
    setIsPressed(true)
  }

  const handlePressOut = () => {
    setIsPressed(false)
  }

  return (
    <Pressable
      className={cn(
        'flex-row items-center',
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
              ? category.amount > 0
                ? 'text-income'
                : 'text-muted-foreground'
              : category.amount > 0
                ? 'text-foreground'
                : 'text-muted-foreground'
          }`}
        >
          ${category.amount.toFixed(2)}
        </Text>
      </View>
    </Pressable>
  )
}
