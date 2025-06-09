import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { LucideIcon } from 'lucide-react-native'
import React from 'react'
import { View } from 'react-native'

interface AuthInputProps {
  label: string
  icon: LucideIcon
  value: string
  onChangeText: (text: string) => void
  placeholder: string
  secureTextEntry?: boolean
  keyboardType?: 'default' | 'email-address' | 'number-pad'
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
  autoCorrect?: boolean
}

export function AuthInput({
  label,
  icon: Icon,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoCorrect = false
}: AuthInputProps) {
  return (
    <View className="mb-5">
      <Text className="text-foreground mb-2 text-base font-semibold">
        {label}
      </Text>
      <View className="flex-row items-center gap-3">
        <View className="bg-secondary h-14 w-14 items-center justify-center rounded-full">
          <Icon size={20} className="text-muted-foreground" />
        </View>
        <View className="flex-1">
          <Input
            className="bg-secondary text-foreground h-14 rounded-xl border-0"
            value={value}
            placeholder={placeholder}
            placeholderClassName="text-muted-foreground"
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            autoCorrect={autoCorrect}
            onChangeText={onChangeText}
          />
        </View>
      </View>
    </View>
  )
}
