import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import React from 'react'
import { View } from 'react-native'

export function CategoryBudgetActionButtons({
  onClose,
  onSave
}: {
  onClose: () => void
  onSave: () => void
}) {
  return (
    <View className="mt-auto flex-row gap-3">
      <Button onPress={onClose} variant="outline" className="flex-1">
        <Text>Cancel</Text>
      </Button>
      <Button onPress={onSave} className="flex-1">
        <Text>Save Budget</Text>
      </Button>
    </View>
  )
}
