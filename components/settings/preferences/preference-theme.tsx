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
            <TabsList className="mr-0 h-10 border border-border/20 bg-muted/60">
              <TabsTrigger value="light" className="px-3 py-1.5">
                <Icon
                  name="Sun"
                  size={18}
                  className="text-amber-500 dark:text-amber-400"
                />
              </TabsTrigger>
              <TabsTrigger value="dark" className="px-3 py-1.5">
                <Icon
                  name="Moon"
                  size={18}
                  className="text-slate-600 dark:text-slate-300"
                />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        }
        showBorder={false}
      />
    </>
  )
}
