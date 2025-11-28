import { GestureHandlerRootView } from '@/components/ui/gesture-handler-root-view'
import { queryClient } from '@/data/trpc/query-client'
import { env } from '@/env'
import { useNavTheme } from '@/lib/hooks'
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
import { isRunningInExpoGo } from 'expo'
import type { ErrorBoundaryProps } from 'expo-router'
import { Stack, useNavigationContainerRef } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import * as React from 'react'
import { useEffect } from 'react'
import { Platform, Pressable, Text, useColorScheme, View } from 'react-native'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import 'react-native-reanimated'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import '../global.css'

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

const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: !isRunningInExpoGo()
})

Sentry.init({
  dsn: env.EXPO_PUBLIC_SENTRY_DSN,
  sendDefaultPii: true,
  enabled: env.EXPO_PUBLIC_APP_VARIANT !== 'development',
  environment: env.EXPO_PUBLIC_APP_VARIANT
})

export const unstable_settings = {
  anchor: '(tabs)'
}

function RootLayoutNative() {
  const hasMounted = React.useRef(false)
  const colorScheme = useColorScheme()
  const navTheme = useNavTheme()
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

  const ref = useNavigationContainerRef()
  useEffect(() => {
    if (ref?.current) {
      navigationIntegration.registerNavigationContainer(ref)
    }
  }, [ref])

  if (!isColorSchemeLoaded) return null

  return (
    <SafeAreaProvider>
      <KeyboardProvider>
        <QueryClientProvider client={queryClient}>
        <ThemeProvider value={navTheme}>
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
                    <StackRoutes />
                    <PortalHost />
                  </GestureHandlerRootView>
                </PowerSyncContextProvider>
              </UserSessionInitializer>
            </ClerkLoaded>
          </ClerkProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </KeyboardProvider>
    </SafeAreaProvider>
  )
}

function StackRoutes() {
  return (
    <Stack screenOptions={{ headerBackButtonDisplayMode: 'minimal' }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="edit-categories/index"
        options={{ animation: 'fade' }}
      />
      <Stack.Screen
        name="edit-categories/[id]"
        options={{ title: 'Edit Category' }}
      />
      <Stack.Screen
        name="accounts/[id]"
        options={{ title: 'Account Details' }}
      />
      <Stack.Screen
        name="transactions/[id]"
        options={{ title: 'Transaction Details' }}
      />
      <Stack.Screen name="import" options={{ title: 'Import Data' }} />
      <Stack.Screen
        name="(modals)/paywall"
        options={{ headerShown: false, presentation: 'modal' }}
      />
      <Stack.Screen
        name="(modals)/add-transaction"
        options={{
          headerShown: false,
          presentation: 'formSheet',
          sheetAllowedDetents: 'fitToContents',
          sheetCornerRadius: 16
        }}
      />
      <Stack.Screen
        name="(modals)/categories-transactions-date-range"
        options={{
          headerShown: false,
          presentation: 'formSheet',
          sheetAllowedDetents: 'fitToContents',
          sheetCornerRadius: 16
        }}
      />
      <Stack.Screen
        name="(modals)/categories-transactions-date-range-custom"
        options={{
          headerShown: false,
          presentation: 'formSheet',
          sheetAllowedDetents: 'fitToContents',
          sheetCornerRadius: 16
        }}
      />
      <Stack.Screen
        name="(modals)/category-details"
        options={{ title: 'Category Details', presentation: 'pageSheet' }}
      />
      <Stack.Screen
        name="(modals)/default-currency-select"
        options={{ title: 'Default Currency', presentation: 'pageSheet' }}
      />
      <Stack.Screen
        name="(modals)/category-icon-select"
        options={{ title: 'Category Icon', presentation: 'pageSheet' }}
      />
      <Stack.Screen
        name="(modals)/category-info-form"
        options={{ title: 'Category Details', presentation: 'pageSheet' }}
      />
      <Stack.Screen
        name="(modals)/account-form"
        options={({ route }) => {
          const title =
            typeof route.params === 'object' &&
            route.params !== null &&
            'title' in route.params &&
            typeof (route.params as { title?: unknown }).title === 'string'
              ? (route.params as { title: string }).title
              : 'Account'

          return { title, presentation: 'pageSheet' }
        }}
      />

      <Stack.Screen name="+not-found" />
    </Stack>
  )
}

export default Sentry.wrap(RootLayoutNative)

/* React-Native work-around for layout effect on web build */
const useIsomorphicLayoutEffect =
  Platform.OS === 'web' && typeof window === 'undefined'
    ? React.useEffect
    : React.useLayoutEffect
