import { Icon, type IconName } from '@/components/ui/lucide-icon-by-name'
import { AccountsSettingsDropdown } from '@/screens/(tabs)/accounts'
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

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarShowLabel: false }}>
      <Tabs.Screen
        name="index"
        options={{
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
          headerRight: () => <AccountsSettingsDropdown />,
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
        name="dev-tools"
        options={{
          href: !__DEV__ ? null : undefined,
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon icon="ToolCase" focused={focused} />
          )
        }}
      />
    </Tabs>
  )
}
