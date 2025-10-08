import { Icon } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import { cn } from '@/lib/utils'
import React from 'react'
import { Modal, ModalProps, Pressable, View } from 'react-native'

interface CustomProps {
  children: React.ReactNode
  onRequestClose: () => void
  className?: string
  showCloseButton?: boolean
  title?: string
  titleClassName?: string
  description?: string
  descriptionClassName?: string
}

export interface CenteredModalProps
  extends CustomProps,
    Omit<ModalProps, 'children' | 'onRequestClose'> {}

export function CenteredModal({
  children,
  className,
  onRequestClose,
  title,
  showCloseButton = true,
  description,
  titleClassName,
  descriptionClassName,
  ...props
}: CenteredModalProps) {
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

        {/* Modal Content */}
        <View
          className={cn(
            'z-10 w-[92%] max-w-md rounded-2xl border border-border bg-popover p-6 text-popover-foreground shadow-lg',
            className
          )}
        >
          {/* Modal Header (Title and Close Button) */}
          {(title || showCloseButton) && (
            <View
              className={cn(
                'flex-row items-center justify-between',
                title && 'mb-4'
              )}
            >
              <Text
                className={cn(
                  'text-xl font-semibold text-foreground',
                  titleClassName
                )}
              >
                {title || ''}
              </Text>
              {showCloseButton && (
                <Pressable
                  className="absolute -right-2 -top-2 p-2"
                  onPress={onRequestClose}
                >
                  <Icon name="X" className="h-5 w-5 text-muted-foreground" />
                </Pressable>
              )}
            </View>
          )}

          {/* Modal Description (optional) */}
          {description && (
            <Text
              className={cn(
                'text-sm text-muted-foreground',
                descriptionClassName
              )}
            >
              {description}
            </Text>
          )}

          {/* Modal Main Content */}
          {children}
        </View>
      </View>
    </Modal>
  )
}
