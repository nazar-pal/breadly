import { Plus } from '@/lib/icons'
import React from 'react'
import { Platform, Pressable, Text, View } from 'react-native'

interface Props {
  onPress: () => void
  label?: string
}

export function ButtonAddCategory({ onPress, label = 'Add Category' }: Props) {
  const getCardStyle = () => {
    return {
      backgroundColor: '#F8F9FA', // colors.surfaceSecondary
      borderStyle: 'dashed' as const,
      borderWidth: 1,
      borderColor: '#F7FAFC', // colors.borderLight
      ...Platform.select({
        android: {
          elevation: 1
        },
        default: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)' // colors.shadowLight
        }
      })
    }
  }

  return (
    <Pressable
      className="w-[47%] flex-row items-center rounded-2xl p-3"
      style={getCardStyle()}
      onPress={onPress}
    >
      <View className="flex-1 flex-row items-center justify-center gap-2">
        <Plus size={20} color="#4A5568" />
        <Text className="text-sm font-medium text-foreground">{label}</Text>
      </View>
    </Pressable>
  )
}
