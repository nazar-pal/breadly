import { cn } from '@/lib/utils'
import React from 'react'
import { Modal, ModalProps, Pressable, View } from 'react-native'

interface CustomProps {
  children: React.ReactNode
  onRequestClose: () => void
  className?: string
}

interface Props
  extends CustomProps,
    Omit<ModalProps, 'children' | 'onRequestClose'> {}

export function CenteredModal({
  children,
  className,
  onRequestClose,
  ...props
}: Props) {
  return (
    <Modal
      animationType="fade"
      transparent
      statusBarTranslucent
      onRequestClose={onRequestClose}
      {...props}
    >
      <View className="flex-1 items-center justify-center">
        {/* Semi-transparent backdrop */}
        <Pressable
          className="absolute inset-0 bg-black/10"
          onPress={onRequestClose}
        />

        <View
          className={cn(
            'z-10 w-[92%] max-w-md rounded-2xl border border-border bg-popover p-6 text-popover-foreground shadow-lg',
            className
          )}
        >
          {children}
        </View>
      </View>
    </Modal>
  )
}
