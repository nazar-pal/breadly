import { Icon, type IconName } from '@/components/icon'
import { SidebarMenu, SidebarTrigger } from '@/components/sidebar-menu'
import { Button } from '@/components/ui/button'
import { useTabsCategoriesSettingsModalActions } from '@/lib/storage/tabs-categories-settings-modal-store'
import { Tabs } from 'expo-router'
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
  return (
    <>
      <Tabs
        screenOptions={({ route }) => ({
          tabBarShowLabel: false,
          tabBarStyle: {
            minHeight: 64,
            paddingTop: 8,
            paddingBottom: 8
          },

          headerLeft: () => <SidebarTrigger />
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
            title: 'Accounts',
            tabBarIcon: ({ focused }) => (
              <TabBarIcon icon="Wallet" focused={focused} />
            )
          }}
        />

        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ focused }) => (
              <TabBarIcon icon="Settings" focused={focused} />
            )
          }}
        />
      </Tabs>

      <SidebarMenu />
    </>
  )
}
