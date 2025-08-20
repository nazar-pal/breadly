import { cn } from '@/lib/utils/cn'
import React, { useEffect } from 'react'
import {
  Modal as RNModal,
  ModalProps as RNModalProps,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native'
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView
} from 'react-native-gesture-handler'
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

// Animation constants for better maintainability
const ANIMATION_CONFIG = {
  DISMISS_THRESHOLD: 120,
  VELOCITY_THRESHOLD: 800,
  FADE_DISTANCE: 200,
  FADE_OPACITY: 0.3,
  CLOSE_DURATION: 200,
  SPRING_CONFIG: { damping: 20, stiffness: 180 }
} as const

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
  animationDuration = ANIMATION_CONFIG.CLOSE_DURATION,
  closeThreshold = ANIMATION_CONFIG.DISMISS_THRESHOLD,
  additionalSafeAreaPadding = 16,
  backdropAccessibilityLabel = 'Close modal',
  // Spread all other native Modal props
  ...nativeModalProps
}: ModalProps) {
  const insets = useSafeAreaInsets()

  // Animation values for swipe to dismiss
  const translateY = useSharedValue(0)
  const opacity = useSharedValue(1)

  // Memoized height calculation
  const modalHeight = () => {
    if (height === 'auto') {
      return undefined // Let content determine height
    }
    if (typeof height === 'string' && height.endsWith('%')) {
      const percentage = parseFloat(height.replace('%', '')) / 100
      return `${percentage * 100}%`
    }
    if (typeof height === 'number') {
      return height <= 1 ? `${height * 100}%` : height
    }
    return '80%'
  }

  // Optimized close handler
  const handleClose = () => {
    'worklet'
    runOnJS(onClose)()
  }

  // Gesture handler with improved performance
  const panGesture = () => {
    if (!enableSwipeToClose) {
      return Gesture.Pan().enabled(false)
    }

    return (
      Gesture.Pan()
        // Only activate for downward swipes to allow horizontal scrolling in children
        .activeOffsetY(20)
        .onBegin(() => {
          'worklet'
          // Reset any ongoing animations for responsive feel
        })
        .onUpdate(event => {
          'worklet'
          // Only allow downward swipes
          const newTranslateY = Math.max(0, event.translationY)
          translateY.value = newTranslateY

          // Smooth fade out based on drag progress
          const progress = Math.min(
            newTranslateY / ANIMATION_CONFIG.FADE_DISTANCE,
            1
          )
          opacity.value = 1 - progress * ANIMATION_CONFIG.FADE_OPACITY
        })
        .onEnd(event => {
          'worklet'
          const shouldClose =
            event.translationY > closeThreshold ||
            event.velocityY > ANIMATION_CONFIG.VELOCITY_THRESHOLD

          if (shouldClose) {
            // Animate out and close
            translateY.value = withTiming(500, { duration: animationDuration })
            opacity.value = withTiming(
              0,
              { duration: animationDuration },
              () => {
                handleClose()
              }
            )
          } else {
            // Spring back to original position
            translateY.value = withSpring(0, ANIMATION_CONFIG.SPRING_CONFIG)
            opacity.value = withSpring(1, ANIMATION_CONFIG.SPRING_CONFIG)
          }
        })
    )
  }

  // Animated styles with improved interpolation
  const animatedModalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value
  }))

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(opacity.value, [0, 1], [0, 0.1])
  }))

  // Reset animation values when modal opens
  useEffect(() => {
    if (isVisible) {
      translateY.value = 0
      opacity.value = 1
    }
  }, [isVisible, translateY, opacity])

  // Handle backdrop press
  const handleBackdropPress = () => {
    if (enableBackdropClose) {
      onClose()
    }
  }

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
          <TouchableWithoutFeedback
            onPress={handleBackdropPress}
            accessibilityRole="button"
            accessibilityLabel={backdropAccessibilityLabel}
            disabled={!enableBackdropClose}
          >
            <Animated.View
              className={cn('absolute inset-0 bg-black', backdropClassName)}
              pointerEvents={enableBackdropClose ? 'auto' : 'none'}
              style={animatedBackdropStyle}
            />
          </TouchableWithoutFeedback>

          {/* Modal Content */}
          <GestureDetector gesture={panGesture()}>
            <Animated.View
              className={cn('rounded-t-3xl bg-popover', className)}
              style={[
                {
                  ...(() => {
                    const h = modalHeight()
                    return h !== undefined ? { height: h as any } : {}
                  })(),
                  ...(height === 'auto' && { maxHeight: '80%' }), // Prevent auto-sizing from taking full screen
                  paddingBottom: insets.bottom + additionalSafeAreaPadding
                },
                animatedModalStyle
              ]}
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
            </Animated.View>
          </GestureDetector>
        </View>
      </GestureHandlerRootView>
    </RNModal>
  )
}

// Export default for convenient importing
export default Modal
