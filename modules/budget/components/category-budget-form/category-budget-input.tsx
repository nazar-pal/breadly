import { Icon } from '@/components/icon'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import React from 'react'
import { View } from 'react-native'

export function CategoryBudgetInput({
  value,
  onChangeText
}: {
  value: string
  onChangeText: (text: string) => void
}) {
  return (
    <View className="mb-6">
      <Text className="mb-3 text-sm font-medium text-foreground">
        Monthly Spending Limit
      </Text>
      <View className="relative">
        <Input
          value={value}
          style={{ paddingLeft: 24 }}
          onChangeText={onChangeText}
          placeholder="0.00"
          keyboardType="numeric"
          className="text-lg"
          autoFocus
        />

        <View
          className="absolute bottom-0 top-0 justify-center"
          style={{ left: 6 }}
        >
          <Icon name="DollarSign" size={18} className="text-muted-foreground" />
        </View>
      </View>
    </View>
  )
}
