import { Switch } from '@/components/ui/switch'
import { useColorScheme } from '@/lib/hooks/useColorScheme'
import { Moon, Sun } from '@/lib/icons'
import React from 'react'
import { PreferenceItem } from './preference-item'

function useThemePreferences() {
  const { colorScheme, setColorScheme } = useColorScheme()

  const toggleTheme = React.useCallback(
    (targetTheme: 'light' | 'dark') => {
      setColorScheme(targetTheme)
    },
    [setColorScheme]
  )

  return {
    currentTheme: colorScheme,
    isLightMode: colorScheme === 'light',
    isDarkMode: colorScheme === 'dark',
    toggleToLight: () => toggleTheme('light'),
    toggleToDark: () => toggleTheme('dark')
  }
}

export function ThemePreferences() {
  const { isLightMode, isDarkMode, toggleToLight, toggleToDark } =
    useThemePreferences()

  return (
    <>
      <PreferenceItem
        icon={<Sun size={20} className="text-primary" />}
        title="Light Mode"
        rightElement={
          <Switch
            checked={isLightMode}
            onCheckedChange={checked => checked && toggleToLight()}
          />
        }
      />
      <PreferenceItem
        icon={<Moon size={20} className="text-primary" />}
        title="Dark Mode"
        className="pb-0"
        rightElement={
          <Switch
            checked={isDarkMode}
            onCheckedChange={checked => checked && toggleToDark()}
          />
        }
        showBorder={false}
      />
    </>
  )
}
