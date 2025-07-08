import { Edit2 } from '@/lib/icons'
import { cn } from '@/lib/utils'
import React, { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { CategoryWithAmounts } from '../lib/use-get-categories-with-amounts'
import { CategoryCardIcon } from './category-card-icon'

interface Props {
  category: CategoryWithAmounts
  isEditMode: boolean
  className?: string
  onPress: (categoryId: string) => void
  onLongPress?: () => void
}

export function CategoryCardExtended({
  category,
  isEditMode,
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
            ${category.amount.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Edit Mode Indicator */}
      {isEditMode && (
        <View className="absolute right-2 top-2 rounded-lg border border-primary/20 bg-primary/15 p-1.5 backdrop-blur-md">
          <Edit2 size={12} className="text-primary" strokeWidth={2.5} />
        </View>
      )}
    </Pressable>
  )
}
