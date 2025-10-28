import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import React from 'react'
import { ActivityIndicator, View } from 'react-native'

interface Props {
  onCancel: () => void
  onSubmit: () => void
  submitLabel: string
  disabled?: boolean
  isSubmitting?: boolean
}

export function AccountFormActionButtons({
  onCancel,
  onSubmit,
  submitLabel,
  disabled = false,
  isSubmitting = false
}: Props) {
  return (
    <View className="mt-auto flex-row gap-3 rounded-xl border-t border-border px-5 py-4">
      <Button
        variant="outline"
        className="flex-1"
        onPress={onCancel}
        disabled={isSubmitting}
      >
        <Text className="font-semibold">Cancel</Text>
      </Button>

      <Button
        className=" flex-1 flex-row items-center justify-center rounded-xl"
        onPress={onSubmit}
        disabled={disabled || isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="white" className="mr-2" />
        ) : null}
        <Text className="font-semibold">
          {isSubmitting ? 'Saving…' : submitLabel}
        </Text>
      </Button>
    </View>
  )
}
