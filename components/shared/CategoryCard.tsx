import React, { useState } from 'react'
import { Platform, Pressable, Text, View } from 'react-native'

interface CategoryCardProps {
  id: string
  name: string
  amount: number
  icon: React.ReactNode
  type: 'expense' | 'income'
  onPress: (categoryName: string) => void
  onLongPress?: (categoryId: string, categoryName: string) => void
}

export default function CategoryCard({
  id,
  name,
  amount,
  icon,
  type,
  onPress,
  onLongPress
}: CategoryCardProps) {
  const [isPressed, setIsPressed] = useState(false)

  const handleLongPress = () => {
    if (onLongPress) {
      onLongPress(id, name)
    }
  }

  const handlePressIn = () => {
    setIsPressed(true)
  }

  const handlePressOut = () => {
    setIsPressed(false)
  }

  return (
    <Pressable
      className={`w-[47%] flex-row items-center rounded-2xl bg-card p-3 transition-all duration-150 ${
        isPressed ? 'scale-98 opacity-70' : 'scale-100 opacity-100'
      }`}
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
      onPress={() => onPress(name)}
      onLongPress={handleLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      delayLongPress={500}
    >
      <View
        className={`h-9 w-9 items-center justify-center rounded-lg ${
          type === 'income' ? 'bg-income/10' : 'bg-muted'
        }`}
      >
        {icon}
      </View>
      <View className="ml-3 flex-1">
        <Text
          numberOfLines={1}
          className="mb-0.5 text-sm font-semibold text-foreground"
        >
          {name}
        </Text>
        <Text
          className={`text-[13px] ${
            type === 'income'
              ? amount > 0
                ? 'text-income'
                : 'text-muted-foreground'
              : amount > 0
                ? 'text-foreground'
                : 'text-muted-foreground'
          }`}
        >
          ${amount.toFixed(2)}
        </Text>
      </View>
    </Pressable>
  )
}
