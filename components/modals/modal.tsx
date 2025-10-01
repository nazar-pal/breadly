import { cn } from '@/lib/utils/cn'
import React, { useEffect } from 'react'
import {
  Pressable,
  Modal as RNModal,
  ModalProps as RNModalProps,
  Text,
  View
} from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Animated, {
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { SwipeToDismiss } from './swipe-to-dismiss'

// Custom props that are specific to our enhanced modal
interface CustomModalProps {
  /** Content to render inside the modal */
  children: React.ReactNode
  /** Controls modal visibility */
  isVisible: boolean
  /** Callback fired when modal should close */
  onClose: () => void
  /** Custom className for the modal container */
  className?: string
  /** Custom className for the backdrop */
  backdropClassName?: string
  /** Custom className for the drag indicator */
  dragIndicatorClassName?: string
  /** Optional modal title rendered above the content */
  title?: React.ReactNode
  /** Custom className for the title text when title is a string */
  titleClassName?: string
  /** Custom className for the header container that wraps the title */
  headerClassName?: string
  /** Modal height as percentage (0-1), fixed value, or 'auto' to fit content */
  height?: number | `${number}%` | 'auto'
  /** Whether to show the drag indicator */
  showDragIndicator?: boolean
  /** Whether to enable swipe to dismiss */
  enableSwipeToClose?: boolean
  /** Whether to enable tap outside to close */
  enableBackdropClose?: boolean
  /** Custom backdrop opacity (0-1) */
  backdropOpacity?: number
  /** Custom animation duration in ms */
  animationDuration?: number
  /** Custom close threshold for swipe gesture */
  closeThreshold?: number
  /** Additional safe area padding */
  additionalSafeAreaPadding?: number
  /** Accessibility label for the backdrop */
  backdropAccessibilityLabel?: string
}

// Combine custom props with all native Modal props
export interface ModalProps
  extends CustomModalProps,
    Omit<RNModalProps, 'visible' | 'children' | 'onRequestClose'> {}

export function Modal({
  children,
  isVisible,
  onClose,
  className,
  backdropClassName,
  dragIndicatorClassName,
  title,
  titleClassName,
  headerClassName,
  height = '80%',
  showDragIndicator = true,
  enableSwipeToClose = true,
  enableBackdropClose = true,
  backdropOpacity = 0.1,
  animationDuration,
  closeThreshold,
  additionalSafeAreaPadding = 12,
  backdropAccessibilityLabel = 'Close modal',
  // Spread all other native Modal props
  ...nativeModalProps
}: ModalProps) {
  // Local animation values shared with backdrop
  const translateY = useSharedValue(0)
  const opacity = useSharedValue(1)

  // Reset animation values when modal opens
  useEffect(() => {
    if (isVisible) {
      translateY.value = 0
      opacity.value = 1
    }
  }, [isVisible, translateY, opacity])

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value * backdropOpacity
  }))

  const handleBackdropPress = () => enableBackdropClose && onClose()

  return (
    <RNModal
      transparent={true}
      animationType="slide"
      statusBarTranslucent={true}
      {...nativeModalProps}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View className="flex-1 justify-end">
          {/* Backdrop */}
          <Animated.View
            className={cn('absolute inset-0 bg-black', backdropClassName)}
            style={animatedBackdropStyle}
            accessibilityLabel={backdropAccessibilityLabel}
          >
            {enableBackdropClose ? (
              <Pressable
                className="flex-1"
                onPress={handleBackdropPress}
                accessibilityRole="button"
                accessibilityLabel={backdropAccessibilityLabel}
              />
            ) : null}
          </Animated.View>

          {/* Modal Content */}
          <SwipeToDismiss
            enabled={enableSwipeToClose}
            onClose={onClose}
            closeThreshold={closeThreshold}
            animationDuration={animationDuration}
            translateY={translateY}
            opacity={opacity}
            className={cn('rounded-t-3xl bg-popover', className)}
            height={height}
          >
            {/* Drag Indicator */}
            {showDragIndicator && (
              <View className="items-center py-3">
                <View
                  className={cn(
                    'h-1 w-10 rounded-full bg-popover-foreground',
                    dragIndicatorClassName
                  )}
                  accessibilityLabel="Drag to dismiss"
                  accessibilityHint="Swipe down to close this modal"
                />
              </View>
            )}

            {/* Optional Title */}
            {title !== undefined && title !== null && title !== '' && (
              <View className={cn('px-6 pb-2', headerClassName)}>
                {typeof title === 'string' ? (
                  <Text
                    className={cn(
                      'text-center text-base font-semibold text-popover-foreground',
                      titleClassName
                    )}
                  >
                    {title}
                  </Text>
                ) : (
                  title
                )}
              </View>
            )}

            {children}

            <SafeAreaView
              edges={['bottom']}
              style={{ paddingBottom: additionalSafeAreaPadding }}
            />
          </SwipeToDismiss>
        </View>
      </GestureHandlerRootView>
    </RNModal>
  )
}
