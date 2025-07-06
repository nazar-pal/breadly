import React, { useEffect } from 'react'
import { Modal as RNModal, TouchableWithoutFeedback, View } from 'react-native'
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView
} from 'react-native-gesture-handler'
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export function Modal({
  children,
  isVisible,
  onClose
}: {
  children: React.ReactNode
  isVisible: boolean
  onClose: () => void
}) {
  const insets = useSafeAreaInsets()

  // Animation values for swipe to dismiss
  const translateY = useSharedValue(0)
  const opacity = useSharedValue(1)

  const animateClose = () => {
    'worklet'
    runOnJS(onClose)()
  }

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      'worklet'
      // Initial touch
    })
    .onUpdate(event => {
      'worklet'
      const newTranslateY = Math.max(0, event.translationY)
      translateY.value = newTranslateY

      // Fade out as user drags down
      const progress = Math.min(newTranslateY / 200, 1)
      opacity.value = 1 - progress * 0.3
    })
    .onEnd(event => {
      'worklet'
      const shouldClose = event.translationY > 120 || event.velocityY > 800

      if (shouldClose) {
        translateY.value = withTiming(500, { duration: 200 })
        opacity.value = withTiming(0, { duration: 200 }, () => {
          // Call JS to close modal after animation finishes
          animateClose()
        })
      } else {
        translateY.value = withSpring(0, { damping: 20, stiffness: 180 })
        opacity.value = withSpring(1, { damping: 20, stiffness: 180 })
      }
    })

  const animatedModalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value
  }))

  // Reset shared values when modal becomes isVisible to avoid stale off-screen positions.
  useEffect(() => {
    if (isVisible) {
      translateY.value = 0
      opacity.value = 1
    }
  }, [isVisible])

  return (
    <RNModal
      visible={isVisible}
      animationType="none"
      transparent={true}
      onRequestClose={onClose}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View className="flex-1 justify-end">
          <TouchableWithoutFeedback
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close modal"
          >
            <View className="absolute inset-0 bg-black/10" />
          </TouchableWithoutFeedback>
          <GestureDetector gesture={panGesture}>
            <Animated.View
              className="max-h-[80%] min-h-[50%] rounded-t-3xl bg-background"
              style={[
                {
                  paddingBottom: insets.bottom + 16
                },
                animatedModalStyle
              ]}
            >
              {/* Drag Indicator */}
              <View className="items-center py-3">
                <View className="h-1 w-10 rounded-full bg-muted" />
              </View>

              {children}
            </Animated.View>
          </GestureDetector>
        </View>
      </GestureHandlerRootView>
    </RNModal>
  )
}
