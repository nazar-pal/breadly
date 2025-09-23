import { CategoryDetailsFormModal } from '@/components/modals/category-details-form/modal-category-details-form'
import { IconSelectionModal } from '@/components/modals/icon-selection'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon-by-name'
import { queryClient } from '@/data/trpc/query-client'
import { env } from '@/env'
import { NAV_THEME } from '@/lib/theme'
import { ModalAccountForm } from '@/modules/account/'
import { PowerSyncContextProvider } from '@/system/powersync/context'
import { PurchasesInitializer } from '@/system/purchases/purchases-initializer'
import { UserSessionInitializer } from '@/system/session-and-migration'
import { ClerkLoaded, ClerkProvider } from '@clerk/clerk-expo'
import { resourceCache } from '@clerk/clerk-expo/resource-cache'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { ThemeProvider } from '@react-navigation/native'
import { PortalHost } from '@rn-primitives/portal'
import * as Sentry from '@sentry/react-native'
import { QueryClientProvider } from '@tanstack/react-query'
import type { ErrorBoundaryProps } from 'expo-router'
import { router, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useColorScheme } from 'nativewind'
import * as React from 'react'
import { Platform, Pressable, Text, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import 'react-native-reanimated'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import './global.css'

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  React.useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <View
      style={{
        flex: 1,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: '600' }}>
        Something went wrong
      </Text>
      <Text style={{ marginTop: 8, opacity: 0.8 }}>
        {String(error?.message ?? error)}
      </Text>
      <Pressable
        onPress={retry}
        style={{
          marginTop: 16,
          paddingHorizontal: 16,
          paddingVertical: 10,
          backgroundColor: '#000',
          borderRadius: 8
        }}
      >
        <Text style={{ color: '#fff' }}>Try again</Text>
      </Pressable>
    </View>
  )
}

Sentry.init({
  dsn: env.EXPO_PUBLIC_SENTRY_DSN,
  sendDefaultPii: true
})

export default Sentry.wrap(function RootLayoutNative() {
  const hasMounted = React.useRef(false)
  const { colorScheme } = useColorScheme()
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false)

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) return

    if (Platform.OS === 'web') {
      // Prevent white background flash on overscroll (web).
      document.documentElement.classList.add('bg-background')
    }
    setIsColorSchemeLoaded(true)
    hasMounted.current = true
  }, [])

  if (!isColorSchemeLoaded) return null

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
          <ClerkProvider
            publishableKey={env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
            tokenCache={tokenCache}
            __experimental_resourceCache={resourceCache}
          >
            <ClerkLoaded>
              <UserSessionInitializer>
                <PurchasesInitializer />
                <PowerSyncContextProvider>
                  <GestureHandlerRootView className="flex-1">
                    <StatusBar
                      style={colorScheme === 'dark' ? 'light' : 'dark'}
                    />
                    <Stack
                      screenOptions={{
                        headerShown: false,
                        animation: 'none'
                      }}
                    >
                      <Stack.Screen name="(tabs)" />
                      <Stack.Screen name="transactions" />
                      <Stack.Screen name="accounts" />
                      <Stack.Screen name="categories" />
                      <Stack.Screen
                        name="paywall"
                        options={{
                          presentation: 'modal',
                          animation: 'slide_from_bottom'
                        }}
                      />
                      <Stack.Screen
                        name="test"
                        options={{
                          title: 'tRPC Connectivity Tester',
                          headerShown: true,
                          headerLeft: () => (
                            <Button
                              variant="ghost"
                              size="icon"
                              onPress={() => router.back()}
                            >
                              <Icon
                                name="ArrowLeft"
                                size={24}
                                className="text-foreground"
                              />
                            </Button>
                          )
                        }}
                      />
                      <Stack.Screen name="+not-found" />
                    </Stack>
                    <CategoryDetailsFormModal />
                    <IconSelectionModal />
                    <ModalAccountForm />
                    <PortalHost />
                  </GestureHandlerRootView>
                </PowerSyncContextProvider>
              </UserSessionInitializer>
            </ClerkLoaded>
          </ClerkProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  )
})

/* React-Native work-around for layout effect on web build */
const useIsomorphicLayoutEffect =
  Platform.OS === 'web' && typeof window === 'undefined'
    ? React.useEffect
    : React.useLayoutEffect
