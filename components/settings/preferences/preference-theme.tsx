import { Icon } from '@/components/ui/icon-by-name'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useColorScheme } from 'nativewind'
import React from 'react'
import { PreferenceItem } from './preference-item'

function useThemePreferences() {
  const { colorScheme, setColorScheme } = useColorScheme()

  const setTheme = (targetTheme: 'light' | 'dark') => {
    setColorScheme(targetTheme)
  }

  return {
    currentTheme: colorScheme === 'light' ? 'light' : 'dark',
    setTheme
  }
}

export function ThemePreferences() {
  const { currentTheme, setTheme } = useThemePreferences()

  return (
    <>
      <PreferenceItem
        icon={<Icon name="Sun" size={20} className="text-primary" />}
        title="Theme"
        subtitle={currentTheme === 'light' ? 'Light' : 'Dark'}
        className="pb-0"
        rightElement={
          <Tabs
            value={currentTheme}
            onValueChange={value =>
              (value === 'light' || value === 'dark') && setTheme(value)
            }
            className="gap-0"
          >
            <TabsList className="mr-0">
              <TabsTrigger value="light" className="px-2 py-1.5">
                <Icon name="Sun" size={16} />
              </TabsTrigger>
              <TabsTrigger value="dark" className="px-2 py-1.5">
                <Icon name="Moon" size={16} />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        }
        showBorder={false}
      />
    </>
  )
}
