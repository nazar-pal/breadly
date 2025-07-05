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

export function CategoryCard({
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

      {isEditMode && (
        <View className="absolute right-0 top-0">
          <Edit2 size={16} className="text-muted-foreground" />
        </View>
      )}
    </Pressable>
  )
}
