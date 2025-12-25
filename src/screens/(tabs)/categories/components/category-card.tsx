import { cn } from '@/lib/utils'
import React, { useState } from 'react'
import { Pressable, PressableProps, Text, View } from 'react-native'
import { AnimatedCategoryTotal } from './animated-category-total'
import { CategoryCardIcon } from './category-card-icon'
import { CategoryWithAmounts } from './lib/use-get-categories-with-amounts'

interface Props extends PressableProps {
  category: CategoryWithAmounts
  className?: string
}

export function CategoryCard({ category, className, ...rest }: Props) {
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
        'relative h-full flex-row items-center',
        isPressed && 'opacity-70',
        className
      )}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      delayLongPress={500}
      {...rest}
    >
      <CategoryCardIcon name={category.icon} type={category.type} size={20} />

      <View className="ml-2 flex-1">
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          className={cn(
            'text-foreground font-semibold',
            'text-[13px] leading-4'
          )}
        >
          {category.name}
        </Text>
        <AnimatedCategoryTotal
          categoryType={category.type}
          totalsByCurrency={category.totalsByCurrency}
        />
      </View>
    </Pressable>
  )
}
