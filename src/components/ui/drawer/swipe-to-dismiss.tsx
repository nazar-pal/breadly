import React from 'react'
import type { ViewStyle } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming
} from 'react-native-reanimated'
import { scheduleOnRN } from 'react-native-worklets'

// Animation constants for better maintainability
const ANIMATION_CONFIG = {
  DISMISS_THRESHOLD: 120,
  VELOCITY_THRESHOLD: 800,
  FADE_DISTANCE: 200,
  FADE_OPACITY: 0.3,
  CLOSE_DURATION: 200,
  SPRING_CONFIG: { damping: 20, stiffness: 180 }
} as const

// Props for the SwipeToDismiss wrapper component
interface SwipeToDismissProps {
  /** Content to wrap with swipe-to-dismiss gesture */
  children: React.ReactNode
  /** Whether swipe to dismiss is enabled */
  enabled: boolean
  /** Callback fired when modal should close */
  onClose: () => void
  /** Threshold distance in pixels to trigger close */
  closeThreshold?: number
  /** Animation duration in ms */
  animationDuration?: number
  /** Shared value for translateY animation */
  translateY: SharedValue<number>
  /** Shared value for opacity animation */
  opacity: SharedValue<number>
  /** Additional styles to apply */
  style?: ViewStyle | ViewStyle[]
  /** Additional className */
  className?: string
  /** Height for the modal */
  height?: number | `${number}%` | 'auto'
}

/**
 * SwipeToDismiss - Wraps content with a pan gesture that allows dismissing by swiping down
 */
export function SwipeToDismiss({
  children,
  enabled,
  onClose,
  closeThreshold = ANIMATION_CONFIG.DISMISS_THRESHOLD,
  animationDuration = ANIMATION_CONFIG.CLOSE_DURATION,
  translateY,
  opacity,
  style,
  className,
  height = '80%'
}: SwipeToDismissProps) {
  // Height calculation
  const modalHeight = () => {
    if (height === 'auto') return undefined
    if (typeof height === 'string' && height.endsWith('%')) return height
    if (typeof height === 'number')
      return height <= 1 ? `${height * 100}%` : height
    return '80%'
  }

  // Optimized close handler
  const handleClose = () => {
    'worklet'
    scheduleOnRN(onClose)
  }

  // Gesture handler with improved performance
  const panGesture = () => {
    if (!enabled) {
      return Gesture.Pan().enabled(false)
    }

    return Gesture.Pan()
      .activeOffsetY(20) // Only activate for downward swipes to allow horizontal scrolling in children
      .onBegin(() => {
        'worklet'
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
          translateY.value = withTiming(500, {
            duration: animationDuration
          })
          opacity.value = withTiming(
            0,
            {
              duration: animationDuration
            },
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
  }

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value
  }))

  const computedStyle: ViewStyle[] = [
    {
      ...(() => {
        const h = modalHeight()
        return h !== undefined ? { height: h as any } : {}
      })(),
      ...(height === 'auto' && { maxHeight: '80%' as any })
    },
    ...(Array.isArray(style) ? style : style ? [style] : [])
  ]

  return (
    <GestureDetector gesture={panGesture()}>
      <Animated.View
        className={className}
        style={[computedStyle, animatedStyle]}
      >
        {children}
      </Animated.View>
    </GestureDetector>
  )
}
