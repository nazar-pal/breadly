import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native'
import { useColorScheme } from 'react-native'
import { useCSSVariable } from 'uniwind'



/**
 * Hook that returns React Navigation theme colors using Uniwind's CSS variables.
 * This hook automatically updates when the theme changes.
 *
 * @returns A Theme object compatible with React Navigation's ThemeProvider
 */
export function useNavTheme(): Theme {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'

  // Access CSS variables using Uniwind's useCSSVariable hook
  const background = String(useCSSVariable('--color-background'))
  const border = String(useCSSVariable('--color-border'))
  const card = String(useCSSVariable('--color-card'))
  const notification = String(useCSSVariable('--color-destructive'))
  const primary = String(useCSSVariable('--color-primary'))
  const text = String(useCSSVariable('--color-foreground'))

  return {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: { background, border, card, notification, primary, text }
  }
}
