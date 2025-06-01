import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Appearance, useColorScheme } from 'react-native';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ThemeProvider } from '@/context/ThemeContext';
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
      <ThemeProvider
        theme={activeTheme}
        updateTheme={updateTheme}
        themePreference={theme}
      >
        <StatusBar style={activeTheme === 'dark' ? 'light' : 'dark'} />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="expenses/[id]"
            options={{
              presentation: 'card',
              headerShown: true,
              title: 'Expense Details',
              headerBackTitle: 'Back',
            }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
