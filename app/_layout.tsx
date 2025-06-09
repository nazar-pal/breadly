import { CurrencyProvider } from '@/context/CurrencyContext'
import { NAV_THEME } from '@/lib/constants'
import { useColorScheme } from '@/lib/useColorScheme'
import { queryClient } from '@/trpc/query-client'
import { ClerkProvider } from '@clerk/clerk-expo'
import { resourceCache } from '@clerk/clerk-expo/resource-cache'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider
} from '@react-navigation/native'
import { QueryClientProvider } from '@tanstack/react-query'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { Platform } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import './global.css'

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light
}
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark
}

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router'

export default function RootLayout() {
  const hasMounted = React.useRef(false)
  const { isDarkColorScheme } = useColorScheme()
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false)

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return
    }

    if (Platform.OS === 'web') {
      // Adds the background color to the html element to prevent white background on overscroll.
      document.documentElement.classList.add('bg-background')
    }
    setIsColorSchemeLoaded(true)
    hasMounted.current = true
  }, [])

  if (!isColorSchemeLoaded) {
    return null
  }

  return (
    <ClerkProvider
      tokenCache={tokenCache}
      __experimental_resourceCache={resourceCache}
    >
      <GestureHandlerRootView className="flex-1">
        <QueryClientProvider client={queryClient}>
          <CurrencyProvider>
            <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
              <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="expenses" />
                <Stack.Screen name="accounts" />
                <Stack.Screen name="+not-found" />
              </Stack>
            </ThemeProvider>
          </CurrencyProvider>
        </QueryClientProvider>
      </GestureHandlerRootView>
    </ClerkProvider>
  )
}

const useIsomorphicLayoutEffect =
  Platform.OS === 'web' && typeof window === 'undefined'
    ? React.useEffect
    : React.useLayoutEffect
