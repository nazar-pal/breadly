import { Icon, IconName } from '@/components/ui/lucide-icon-by-name'
import { cn } from '@/lib/utils'
import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions
} from '@react-navigation/material-top-tabs'
import { ParamListBase, TabNavigationState } from '@react-navigation/native'
import { withLayoutContext } from 'expo-router'
import React from 'react'
import { View } from 'react-native'

const { Navigator } = createMaterialTopTabNavigator()
const TopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator)

export default function DevOnlyLayout() {
  if (!__DEV__) return null
  return (
    <View className="pt-safe flex-1">
      <TopTabs
        screenOptions={{
          tabBarItemStyle: { flexDirection: 'row' },
          tabBarScrollEnabled: true
        }}
      >
        <TopTabs.Screen
          name="index"
          options={{
            title: 'Local Store',
            tabBarIcon: ({ focused }) => (
              <TabBarIcon icon="Store" focused={focused} />
            )
          }}
        />
        <TopTabs.Screen
          name="trpc-test"
          options={{
            title: 'trpc Test',
            tabBarIcon: ({ focused }) => (
              <TabBarIcon icon="Test" focused={focused} />
            )
          }}
        />
        <TopTabs.Screen
          name="db"
          options={{
            title: 'Database',
            tabBarIcon: ({ focused }) => (
              <TabBarIcon icon="Database" focused={focused} />
            )
          }}
        />
        <TopTabs.Screen
          name="purchases"
          options={{
            title: 'Purchases',
            tabBarIcon: ({ focused }) => (
              <TabBarIcon icon="CreditCard" focused={focused} />
            )
          }}
        />
      </TopTabs>
    </View>
  )
}

function TabBarIcon({ icon, focused }: { icon: IconName; focused: boolean }) {
  const className = cn('text-muted-foreground', focused && 'text-primary')
  return <Icon name={icon} size={20} className={className} />
}
