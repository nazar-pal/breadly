import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Icon, type IconName } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import { useCategoryType } from '@/lib/hooks/use-category-type'
import { AccountsSettingsButton } from '@/modules/account'
import { Link, Tabs } from 'expo-router'
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
  const categoryType = useCategoryType()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="mr-4">
          <Icon name="Settings" size={24} className="text-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem closeOnPress={true} asChild>
          <Link href={`/categories/${categoryType}`}>
            <Text>Edit Categories</Text>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function TabLayout() {
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
        name="dev-only"
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
