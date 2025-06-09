import AsyncStorage from '@react-native-async-storage/async-storage'
import React, {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState
} from 'react'
import { useColorScheme } from 'react-native'
import {
  Colors,
  darkColors,
  lightColors,
  ThemedStylesProps,
  ThemeMode,
  ThemePreference
} from '../theme'

// AsyncStorage key for theme persistence
const THEME_STORAGE_KEY = '@breadly_theme_preference'

// Define context type
type ThemeContextType = {
  // Current theme mode (resolved from preference + system)
  mode: ThemeMode
  // User's theme preference
  preference: ThemePreference
  // Whether we're currently using dark mode
  isDark: boolean
  // Color palette for current theme
  colors: Colors
  // Whether theme is still loading from storage
  isLoading: boolean
  // Whether theme system is ready (no flashing)
  isReady: boolean
  // Function to update theme preference
  setThemePreference: (preference: ThemePreference) => Promise<void>
}

// Create the context with default values
const ThemeContext = createContext<ThemeContextType | null>(null)

// Provider props
type ThemeProviderProps = {
  children: React.ReactNode
  // Optional fallback theme to use during loading
  fallbackTheme?: ThemeMode
}

// Helper function to resolve theme mode from preference and system
const resolveThemeMode = (
  preference: ThemePreference,
  systemTheme: 'light' | 'dark' | null | undefined
): ThemeMode => {
  if (preference === 'system') {
    return systemTheme === 'dark' ? 'dark' : 'light'
  }
  return preference
}

// Create the provider component
export const ThemeProvider = ({
  children,
  fallbackTheme = 'light'
}: ThemeProviderProps) => {
  const systemColorScheme = useColorScheme()

  // State for theme preference (what user selected)
  const [preference, setPreference] = useState<ThemePreference>('system')

  // State for loading and ready status
  const [isLoading, setIsLoading] = useState(true)
  const [isReady, setIsReady] = useState(false)

  // Resolved theme mode (actual theme to use)
  const mode = useMemo(
    () => resolveThemeMode(preference, systemColorScheme),
    [preference, systemColorScheme]
  )

  // Computed values (memoized for performance)
  const isDark = mode === 'dark'

  // Memoize colors to prevent unnecessary re-renders
  const colors = useMemo(() => (isDark ? darkColors : lightColors), [isDark])

  // Load theme preference from storage on mount using useLayoutEffect to prevent flashing
  useLayoutEffect(() => {
    let isMounted = true

    const loadThemePreference = async () => {
      try {
        const savedPreference = await AsyncStorage.getItem(THEME_STORAGE_KEY)

        // Only update state if component is still mounted
        if (!isMounted) return

        if (
          savedPreference &&
          ['light', 'dark', 'system'].includes(savedPreference)
        ) {
          setPreference(savedPreference as ThemePreference)
        }
      } catch (error) {
        console.warn('Failed to load theme preference:', error)
        // Keep default 'system' preference on error
        // Optionally report to error tracking service
        if (__DEV__) {
          console.error('Theme loading error details:', error)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
          // Add a small delay to ensure smooth transition
          setTimeout(() => {
            if (isMounted) {
              setIsReady(true)
            }
          }, 16) // One frame delay
        }
      }
    }

    loadThemePreference()

    // Cleanup function
    return () => {
      isMounted = false
    }
  }, [])

  // Function to update theme preference (memoized to prevent unnecessary re-renders)
  const setThemePreference = useCallback(
    async (newPreference: ThemePreference) => {
      const previousPreference = preference

      try {
        // Update state first for immediate UI feedback
        setPreference(newPreference)

        // Persist to storage
        await AsyncStorage.setItem(THEME_STORAGE_KEY, newPreference)
      } catch (error) {
        console.warn('Failed to save theme preference:', error)
        // Revert state on error
        setPreference(previousPreference)

        // Optionally show user-friendly error message
        if (__DEV__) {
          console.error('Theme saving error details:', error)
        }

        throw error
      }
    },
    [preference]
  )

  // Context value (memoized to prevent unnecessary re-renders)
  const contextValue = useMemo<ThemeContextType>(
    () => ({
      mode,
      preference,
      isDark,
      colors,
      isLoading,
      isReady,
      setThemePreference
    }),
    [mode, preference, isDark, colors, isLoading, isReady, setThemePreference]
  )

  // Use fallback theme during loading to prevent flashing
  const loadingContextValue = useMemo<ThemeContextType>(() => {
    const fallbackIsDark = fallbackTheme === 'dark'
    const fallbackColors = fallbackIsDark ? darkColors : lightColors

    return {
      mode: fallbackTheme,
      preference: 'system',
      isDark: fallbackIsDark,
      colors: fallbackColors,
      isLoading: true,
      isReady: false,
      setThemePreference: async () => {}
    }
  }, [fallbackTheme])

  return (
    <ThemeContext.Provider value={isReady ? contextValue : loadingContextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}

// Export theme constants for direct access when needed
export const THEME_CONSTANTS = {
  STORAGE_KEY: THEME_STORAGE_KEY,
  LIGHT_COLORS: lightColors,
  DARK_COLORS: darkColors
} as const

// Utility function to get colors for a specific theme mode
export const getThemeColors = (mode: ThemeMode) => {
  return mode === 'dark' ? darkColors : lightColors
}

// Hook for accessing theme-aware styles
export const useThemedStyles = <T,>(
  styleFactory: (theme: ThemedStylesProps) => T
) => {
  const { colors, isDark } = useTheme()

  return useMemo(
    () => styleFactory({ colors, isDark }),
    [colors, isDark, styleFactory]
  )
}

// Re-export types for convenience
export type { Colors, ThemedStylesProps, ThemeMode, ThemePreference }
