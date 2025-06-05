import { CurrencyProvider } from '@/context/CurrencyContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Layout component that needs access to theme
function AppLayout() {
  const { isDark, navigationTheme } = useTheme();

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
  );
}

export default function RootLayout() {
  useFrameworkReady();

  return (
    <ClerkProvider tokenCache={tokenCache}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <CurrencyProvider>
          <ThemeProvider>
            <AppLayout />
          </ThemeProvider>
        </CurrencyProvider>
      </GestureHandlerRootView>
    </ClerkProvider>
  );
}
