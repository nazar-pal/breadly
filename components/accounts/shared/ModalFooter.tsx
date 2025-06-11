import { Check } from '@/lib/icons'
import React from 'react'
import { Pressable, Text } from 'react-native'

interface ModalFooterProps {
  onCancel: () => void
  onSubmit: () => void
  isLoading: boolean
  isEditing: boolean
}

export default function ModalFooter({
  onCancel,
  onSubmit,
  isLoading,
  isEditing
}: ModalFooterProps) {
  return (
    <>
      <Pressable
        className="min-h-[48px] flex-[0.4] flex-row items-center justify-center rounded-xl border border-border py-3"
        onPress={onCancel}
      >
        <Text className="text-base font-semibold text-foreground">Cancel</Text>
      </Pressable>

      <Pressable
        className="min-h-[48px] flex-[0.6] flex-row items-center justify-center rounded-xl bg-primary py-3"
        onPress={onSubmit}
        disabled={isLoading}
      >
        <Check size={20} className="mr-2 text-primary-foreground" />
        <Text className="text-base font-semibold text-primary-foreground">
          {isLoading
            ? 'Saving...'
            : isEditing
              ? 'Save Changes'
              : 'Create Account'}
        </Text>
      </Pressable>
    </>
  )
}
