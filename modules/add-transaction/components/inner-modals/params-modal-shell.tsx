import { CenteredModal } from '@/components/modals'
import { Icon } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import React from 'react'
import { Pressable, View } from 'react-native'

export interface ParamsModalShellProps {
  visible: boolean
  onClose: () => void
  children: React.ReactNode
  title: string
  description?: string
}

export function ParamsModalShell({
  visible,
  onClose,
  children,
  title,
  description
}: ParamsModalShellProps) {
  return (
    <CenteredModal
      visible={visible}
      onRequestClose={onClose}
      className="max-h-[60%]"
    >
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-xl font-semibold text-foreground">{title}</Text>
        <Pressable className="absolute -right-2 -top-2 p-2" onPress={onClose}>
          <Icon name="X" className="h-5 w-5 text-muted-foreground" />
        </Pressable>
      </View>

      {description && (
        <Text className="text-sm text-muted-foreground">{description}</Text>
      )}

      {children}
    </CenteredModal>
  )
}
