import { cn } from '@/lib/utils'
import React, { useState } from 'react'
import { Platform, Pressable, Text, View } from 'react-native'
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

  const handlePressIn = () => {
    setIsPressed(true)
  }

  const handlePressOut = () => {
    setIsPressed(false)
  }

  return (
    <Pressable
      className={cn(
        'flex-row items-center transition-all duration-150',
        isPressed ? 'scale-98 opacity-70' : 'scale-100 opacity-100',
        className
      )}
      style={{
        ...Platform.select({
          android: {
            elevation: isPressed ? 1 : 2
          },
          default: {
            boxShadow: `0px ${isPressed ? 1 : 2}px ${isPressed ? 2 : 4}px rgba(0, 0, 0, 0.1)${isPressed ? '80' : ''}`
          }
        })
      }}
      onPress={() => onPress(category.id)}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      delayLongPress={500}
    >
      <View
        className={`h-9 w-9 items-center justify-center rounded-lg ${
          category.type === 'income' ? 'bg-income/10' : 'bg-muted'
        }`}
      >
        <CategoryCardIcon name={category.icon} type={category.type} />
      </View>
      <View className="ml-3 flex-1">
        <Text
          numberOfLines={1}
          className="mb-0.5 text-sm font-semibold text-foreground"
        >
          {category.name}
        </Text>
        <Text
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
