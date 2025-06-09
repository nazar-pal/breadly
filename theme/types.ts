import { darkColors, lightColors } from './colors'
import { spacing } from './tokens'

// Theme preference type
export type ThemePreference = 'light' | 'dark' | 'system'

// Theme mode type (actual resolved theme)
export type ThemeMode = 'light' | 'dark'

// Colors type that represents both light and dark themes
export type Colors = typeof lightColors | typeof darkColors

// Type helper for theme-aware components
export type ThemedStylesProps = {
  colors: Colors
  spacing: typeof spacing
  isDark: boolean
}
