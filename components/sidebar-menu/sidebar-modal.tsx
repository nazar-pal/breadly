import { Text } from '@/components/ui/text'
import {
  useSidebarState,
  useTabsHeaderActions
} from '@/lib/storage/tabs-header-store'
import { GoogleOAuthButton, UserInfo } from '@/modules/session-and-migration'
import { SignedIn, SignedOut } from '@clerk/clerk-expo'
import React from 'react'
import {
  BackHandler,
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  View
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
import { DataLossWarning } from '../../modules/session-and-migration/components/data-loss-warning'
import { PowerSyncStatus } from './power-sync-status'
import { Preferences } from './preferences/preferences'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const SIDEBAR_WIDTH = Math.min(SCREEN_WIDTH * 0.9, 400)

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export function SidebarModal() {
  const insets = useSafeAreaInsets()
  const visible = useSidebarState()
  const { closeSidebar } = useTabsHeaderActions()

  const progress = useSharedValue(0)
  const dragX = useSharedValue(0)

  // Handle Android back button
  React.useEffect(() => {
    if (Platform.OS === 'android' && visible) {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          closeSidebar()
          return true
        }
      )
      return () => backHandler.remove()
    }
  }, [visible, closeSidebar])

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
        dragX.value = Math.max(event.translationX, -SIDEBAR_WIDTH)
      }
    })
    .onEnd(event => {
      'worklet'
      const shouldClose =
        event.translationX < -SIDEBAR_WIDTH * 0.3 || event.velocityX < -800

      if (shouldClose) {
        progress.value = withTiming(0, { duration: 200 }, finished => {
          if (finished) {
            runOnJS(closeSidebar)()
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
    opacity: interpolate(progress.value, [0, 1], [0, 0.5])
  }))

  // Sidebar animation
  const sidebarStyle = useAnimatedStyle(() => {
    const translateX = interpolate(progress.value, [0, 1], [-SIDEBAR_WIDTH, 0])
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
        onPress={closeSidebar}
        className="absolute inset-0 bg-black"
        style={backdropStyle}
      />

      {/* Sidebar */}
      <GestureDetector gesture={panGesture}>
        <Animated.View
          className="absolute bottom-0 left-0 top-0 overflow-hidden rounded-r-2xl bg-background shadow-2xl"
          style={[{ width: SIDEBAR_WIDTH }, sidebarStyle]}
        >
          {/* Drag indicator */}
          <View className="absolute right-2 top-1/2 z-10 h-10 w-1 -translate-y-1/2 rounded-full bg-border/20" />

          {/* Content */}
          <ScrollView
            className="flex-1 bg-background px-6 py-4"
            showsVerticalScrollIndicator={false}
            style={{ paddingTop: insets.top + 16 }}
            removeClippedSubviews={true}
            bounces={false}
          >
            <SignedOut>
              <GoogleOAuthButton />
              <DataLossWarning />
            </SignedOut>

            <SignedIn>
              <UserInfo />
            </SignedIn>

            <PowerSyncStatus />

            <Preferences />
          </ScrollView>

          {/* Footer */}
          <View
            className="border-t border-border/10 bg-background px-6"
            style={{ paddingBottom: insets.bottom + 16 }}
          >
            <Text className="py-4 text-center text-sm text-muted-foreground">
              Breadly v1.0.0
            </Text>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  )
}
