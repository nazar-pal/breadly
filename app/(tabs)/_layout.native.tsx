import { Icon, type IconName } from '@/components/icon'
import { Button } from '@/components/ui/button'
import { useTabsCategoriesSettingsModalActions } from '@/lib/storage/tabs-categories-settings-modal-store'
import { AccountsSettingsButton } from '@/modules/account'
import { router, Tabs, usePathname } from 'expo-router'
import React from 'react'

function TabBarIcon({ icon, focused }: { icon: IconName; focused: boolean }) {
  return (
    <Icon
      name={icon}
      size={32}
      className={focused ? 'text-primary' : 'text-muted-foreground'}
      strokeWidth={focused ? 2.5 : 2}
    />
  )
}

function SettingsDropdown() {
  const { open } = useTabsCategoriesSettingsModalActions()
  return (
    <Button variant="ghost" size="icon" className="mr-4" onPress={open}>
      <Icon name="Settings" size={24} className="text-foreground" />
    </Button>
  )
}

export default function TabLayout() {
  const pathname = usePathname()

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        tabBarStyle: {
          minHeight: 64,
          paddingTop: 8,
          paddingBottom: 8
        }
      })}
    >
      <Tabs.Screen
        name="(categories)"
        options={{
          headerRight: () => <SettingsDropdown />,
          title: 'Categories',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon icon="ChartBar" focused={focused} />
          )
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Operations',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon icon="Receipt" focused={focused} />
          )
        }}
      />
      <Tabs.Screen
        name="accounts"
        options={{
          headerRight: () => <AccountsSettingsButton />,
          title: 'Accounts',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon icon="Wallet" focused={focused} />
          )
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Profile & Preferences',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon icon="SlidersHorizontal" focused={focused} />
          )
        }}
      />

      <Tabs.Screen
        name="db"
        options={{
          href: !__DEV__ ? null : undefined,
          title: pathname?.includes('/table/')
            ? 'Table'
            : pathname?.includes('/view/')
              ? 'View'
              : 'Database',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon icon="Database" focused={focused} />
          ),
          headerLeft: () =>
            router.canGoBack() &&
            pathname.includes('db/') && (
              <Button variant="ghost" size="icon" onPress={() => router.back()}>
                <Icon name="ArrowLeft" size={24} className="text-foreground" />
              </Button>
            )
        }}
      />
    </Tabs>
  )
}
