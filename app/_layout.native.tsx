import { Icon } from '@/components/icon'
import { CategoryDetailsFormModal } from '@/components/modals/category-details-form/modal-category-details-form'
import { IconSelectionModal } from '@/components/modals/icon-selection'
import { Button } from '@/components/ui/button'
import { PowerSyncContextProvider } from '@/data/client/powersync/context'
import { queryClient } from '@/data/trpc/query-client'
import { env } from '@/env'
import { NAV_THEME } from '@/lib/constants'
import { useColorScheme } from '@/lib/hooks'
import { ModalAccountForm } from '@/modules/account/'
import { UserSessionInitializer } from '@/modules/session-and-migration'
import { ClerkLoaded, ClerkProvider } from '@clerk/clerk-expo'
import { resourceCache } from '@clerk/clerk-expo/resource-cache'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider
} from '@react-navigation/native'
import { PortalHost } from '@rn-primitives/portal'
import { QueryClientProvider } from '@tanstack/react-query'
import { router, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import * as React from 'react'
import { Platform } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import './global.css'

const LIGHT_THEME: Theme = { ...DefaultTheme, colors: NAV_THEME.light }
const DARK_THEME: Theme = { ...DarkTheme, colors: NAV_THEME.dark }

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router'

export default function RootLayout() {
  const hasMounted = React.useRef(false)
  const { isDarkColorScheme } = useColorScheme()
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
        <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
          <ClerkProvider
            publishableKey={env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
            tokenCache={tokenCache}
            __experimental_resourceCache={resourceCache}
          >
            <ClerkLoaded>
              <UserSessionInitializer>
                <PowerSyncContextProvider>
                  <GestureHandlerRootView className="flex-1">
                    <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
                    <Stack
                      screenOptions={{ headerShown: false, animation: 'none' }}
                    >
                      <Stack.Screen name="(tabs)" />
                      <Stack.Screen name="transactions" />
                      <Stack.Screen name="accounts" />
                      <Stack.Screen name="categories" />
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
}

/* React-Native work-around for layout effect on web build */
const useIsomorphicLayoutEffect =
  Platform.OS === 'web' && typeof window === 'undefined'
    ? React.useEffect
    : React.useLayoutEffect
