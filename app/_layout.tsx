import { CurrencyProvider } from '@/context/CurrencyContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  useFrameworkReady();
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [activeTheme, setActiveTheme] = useState<'light' | 'dark'>(
    colorScheme || 'light',
  );

  useEffect(() => {
    if (theme === 'system') {
      setActiveTheme(colorScheme || 'light');
    } else {
      setActiveTheme(theme);
    }
  }, [theme, colorScheme]);

  const updateTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <CurrencyProvider>
        <ThemeProvider
          theme={activeTheme}
          updateTheme={updateTheme}
          themePreference={theme}
        >
          <StatusBar style={activeTheme === 'dark' ? 'light' : 'dark'} />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="expenses" options={{ headerShown: false }} />
            <Stack.Screen name="accounts" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </ThemeProvider>
      </CurrencyProvider>
    </GestureHandlerRootView>
  );
}
