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

  const getCardStyle = () => {
    return {
      backgroundColor: '#FFFFFF', // colors.card
      opacity: isPressed ? 0.7 : 1,
      transform: [{ scale: isPressed ? 0.98 : 1 }],
      ...Platform.select({
        android: {
          elevation: isPressed ? 1 : 2
        },
        default: {
          boxShadow: `0px ${isPressed ? 1 : 2}px ${isPressed ? 2 : 4}px rgba(0, 0, 0, 0.1)${isPressed ? '80' : ''}`
        }
      })
    }
  }

  const getAmountColor = () => {
    if (type === 'income') {
      return amount > 0 ? '#10B981' : '#4A5568' // colors.success : colors.textSecondary
    }
    return amount > 0 ? '#1A202C' : '#4A5568' // colors.text : colors.textSecondary
  }

  const getIconBackgroundColor = () => {
    if (type === 'income') {
      return 'rgba(16, 185, 129, 0.1)' // colors.iconBackground.success
    }
    return '#F1F5F9' // colors.iconBackground.neutral
  }

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
      className="w-[47%] flex-row items-center rounded-2xl p-3"
      style={getCardStyle()}
      onPress={() => onPress(name)}
      onLongPress={handleLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      delayLongPress={500}
    >
      <View
        className="h-9 w-9 items-center justify-center rounded-lg"
        style={{ backgroundColor: getIconBackgroundColor() }}
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
        <Text className="text-[13px]" style={{ color: getAmountColor() }}>
          ${amount.toFixed(2)}
        </Text>
      </View>
    </Pressable>
  )
}
