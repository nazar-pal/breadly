import { Text } from '@/components/ui/text'
import { ChevronLeft } from '@/lib/icons'
import React from 'react'
import { TouchableOpacity } from 'react-native'

interface AuthBackButtonProps {
  onPress: () => void
  text: string
}

export function AuthBackButton({ onPress, text }: AuthBackButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="mb-4 flex-row items-center gap-3 self-start rounded-xl bg-muted/50 px-4 py-3"
    >
      <ChevronLeft size={16} className="text-muted-foreground" />
      <Text className="font-medium text-muted-foreground">{text}</Text>
    </TouchableOpacity>
  )
}
