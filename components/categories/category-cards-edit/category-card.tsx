import { Edit2 } from '@/lib/icons'
import { CategorySelectSQLite } from '@/lib/powersync/schema/table_4_categories'
import { cn } from '@/lib/utils'
import React, { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { CategoryCardIcon } from './category-card-icon'

interface Props {
  category: CategorySelectSQLite
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
        <Text numberOfLines={1} className="text-[13px] text-muted-foreground">
          {category.description}
        </Text>
      </View>

      <View className="rounded-lg border border-primary/20 bg-primary/15 p-1.5 backdrop-blur-md">
        <Edit2 size={13} className="text-primary" strokeWidth={2.5} />
      </View>
    </Pressable>
  )
}
