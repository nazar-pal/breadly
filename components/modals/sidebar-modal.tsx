import React from 'react'
import {
  BackHandler,
  Platform,
  Pressable,
  ScrollView,
  View,
  useWindowDimensions
} from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

// Compute width per render to handle rotation/split-screen
const getSidebarWidth = (screenWidth: number) =>
  Math.min(screenWidth * 0.9, 400)

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export function SidebarModal({
  children,
  footer,
  visible,
  onRequestClose
}: {
  children: React.ReactNode
  footer: React.ReactNode
  visible: boolean
  onRequestClose: () => void
}) {
  const insets = useSafeAreaInsets()
  const { width: screenWidth } = useWindowDimensions()
  const sidebarWidth = getSidebarWidth(screenWidth)

  const progress = useSharedValue(0)
  const dragX = useSharedValue(0)

  // Handle Android back button
  React.useEffect(() => {
    if (Platform.OS === 'android' && visible) {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          onRequestClose()
          return true
        }
      )
      return () => backHandler.remove()
    }
  }, [visible, onRequestClose])

  // Animate open/close
  React.useEffect(() => {
    if (visible) {
      progress.value = withTiming(1, {
        duration: 250,
        easing: Easing.out(Easing.cubic)
      })
      dragX.value = 0
    } else {
      progress.value = withTiming(0, {
        duration: 200,
        easing: Easing.in(Easing.cubic)
      })
    }
  }, [visible, progress, dragX])

  // Swipe gesture handler
  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-10, 10])
    .onUpdate(event => {
      'worklet'
      if (event.translationX < 0) {
        dragX.value = Math.max(event.translationX, -sidebarWidth)
      }
    })
    .onEnd(event => {
      'worklet'
      const shouldClose =
        event.translationX < -sidebarWidth * 0.3 || event.velocityX < -800

      if (shouldClose) {
        progress.value = withTiming(0, { duration: 200 }, finished => {
          if (finished) {
            runOnJS(onRequestClose)()
          }
        })
      } else {
        dragX.value = withTiming(0, {
          duration: 250,
          easing: Easing.out(Easing.cubic)
        })
      }
    })

  // Backdrop animation
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 0.1])
  }))

  // Sidebar animation
  const sidebarStyle = useAnimatedStyle(() => {
    const translateX = interpolate(progress.value, [0, 1], [-sidebarWidth, 0])
    return {
      transform: [{ translateX: translateX + dragX.value }]
    }
  })

  // Don't render if not visible for performance
  if (!visible && progress.value === 0) {
    return null
  }

  return (
    <View
      className="absolute inset-0 z-50"
      style={{ pointerEvents: visible ? 'auto' : 'none' }}
    >
      {/* Backdrop */}
      <AnimatedPressable
        onPress={onRequestClose}
        className="absolute inset-0 bg-black"
        style={backdropStyle}
      />

      {/* Sidebar */}
      <GestureDetector gesture={panGesture}>
        <Animated.View
          className="absolute bottom-0 left-0 top-0 overflow-hidden rounded-r-2xl bg-popover text-popover-foreground shadow-2xl"
          style={[{ width: sidebarWidth }, sidebarStyle]}
        >
          {/* Drag indicator */}
          <View className="absolute right-2 top-1/2 z-10 h-10 w-1 -translate-y-1/2 rounded-full bg-border/20" />

          {/* Content */}
          <ScrollView
            className="flex-1 bg-popover px-6 py-4"
            showsVerticalScrollIndicator={false}
            style={{ paddingTop: insets.top + 16 }}
            removeClippedSubviews={true}
            bounces={false}
          >
            {children}
          </ScrollView>

          {/* Footer */}
          <View
            className="border-t border-border/10 bg-popover px-6"
            style={{ paddingBottom: insets.bottom + 16 }}
          >
            {footer}
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  )
}
