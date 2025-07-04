import { SidebarModal } from '@/components/sidebar-menu'
import { SettingsDropdown } from '@/components/tabs-header/settings-dropdown'
import { SidebarTrigger } from '@/components/tabs-header/sidebar-trigger'
import {
  Camera,
  ChartBar,
  Receipt,
  Settings,
  TrendingUp,
  Wallet
} from '@/lib/icons'
import { Tabs } from 'expo-router'
import type { LucideIcon } from 'lucide-react-native'
import React from 'react'

function TabBarIcon({ Icon, focused }: { Icon: LucideIcon; focused: boolean }) {
  return (
    <Icon
      size={32}
      className={focused ? 'text-primary' : 'text-muted-foreground'}
      strokeWidth={focused ? 2.5 : 2}
    />
  )
}

export default function TabLayout() {
  return (
    <>
      <Tabs
        screenOptions={({ route }) => ({
          headerShadowVisible: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            minHeight: 64,
            paddingTop: 8,
            paddingBottom: 8
          },

          headerLeft: () => <SidebarTrigger />,
          headerRight: () => {
            // Only show settings dropdown on categories tab
            if (route.name === 'categories') {
              return <SettingsDropdown />
            }
            return null
          }
        })}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Operations',
            tabBarIcon: ({ focused }) => (
              <TabBarIcon Icon={Receipt} focused={focused} />
            )
          }}
        />
        <Tabs.Screen
          name="categories"
          options={{
            title: 'Categories',
            tabBarIcon: ({ focused }) => (
              <TabBarIcon Icon={ChartBar} focused={focused} />
            )
          }}
        />
        <Tabs.Screen
          name="statistics"
          options={{
            title: 'Statistics',
            tabBarIcon: ({ focused }) => (
              <TabBarIcon Icon={TrendingUp} focused={focused} />
            )
          }}
        />
        <Tabs.Screen
          name="accounts"
          options={{
            title: 'Accounts',
            tabBarIcon: ({ focused }) => (
              <TabBarIcon Icon={Wallet} focused={focused} />
            )
          }}
        />
        <Tabs.Screen
          name="ai"
          options={{
            title: 'AI',
            tabBarIcon: ({ focused }) => (
              <TabBarIcon Icon={Camera} focused={focused} />
            )
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ focused }) => (
              <TabBarIcon Icon={Settings} focused={focused} />
            )
          }}
        />
      </Tabs>

      <SidebarModal />
    </>
  )
}
