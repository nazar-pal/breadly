import { Plus } from 'lucide-react-native'
import React from 'react'
import { Platform, Pressable, Text, View, ViewStyle } from 'react-native'

interface AddAccountButtonProps {
  onPress: () => void
  label?: string
}

export default function AddAccountButton({
  onPress,
  label = 'Add Account'
}: AddAccountButtonProps) {
  const getCustomShadowStyle = (): ViewStyle => {
    if (Platform.OS === 'android') {
      return { elevation: 1 }
    }
    return {}
  }

  return (
    <Pressable
      className="-primary bg-card-secondary mb-2 min-h-[60px] w-full rounded-xl border-2 border-dashed p-3"
      style={getCustomShadowStyle()}
      onPress={onPress}
    >
      <View className="flex-row items-center justify-center gap-3">
        <View className="h-7 w-7 items-center justify-center rounded-md">
          <Plus size={16} color="#6366F1" />
        </View>
        <Text className="text-foreground text-center text-sm font-semibold">
          {label}
        </Text>
      </View>
    </Pressable>
  )
}
