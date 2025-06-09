import { CurrencyProvider } from '@/context/CurrencyContext'
import { ThemeProvider, useTheme } from '@/context/ThemeContext'
import { useFrameworkReady } from '@/hooks/useFrameworkReady'
import { queryClient } from '@/trpc/query-client'
import { ClerkProvider } from '@clerk/clerk-expo'
import { resourceCache } from '@clerk/clerk-expo/resource-cache'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { ThemeProvider as NavigationThemeProvider } from '@react-navigation/native'
import { QueryClientProvider } from '@tanstack/react-query'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import './global.css'

// Layout component that needs access to theme
function AppLayout() {
  const { isDark, navigationTheme, isReady } = useTheme()

  // To prevent hydration errors, we wait until the theme is ready on the client
  // before rendering the theme-dependent UI.
  if (!isReady) {
    return null
  }

  return (
    <NavigationThemeProvider value={navigationTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="expenses" />
        <Stack.Screen name="accounts" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </NavigationThemeProvider>
  )
}

export default function RootLayout() {
  useFrameworkReady()

  return (
    <ClerkProvider
      tokenCache={tokenCache}
      __experimental_resourceCache={resourceCache}
    >
      <GestureHandlerRootView className="flex-1">
        <QueryClientProvider client={queryClient}>
          <CurrencyProvider>
            <ThemeProvider>
              <AppLayout />
            </ThemeProvider>
          </CurrencyProvider>
        </QueryClientProvider>
      </GestureHandlerRootView>
    </ClerkProvider>
  )
}
