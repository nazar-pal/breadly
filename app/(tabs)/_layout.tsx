import {
  ChartBar,
  ChartLine,
  CirclePlus,
  List,
  Settings,
  Wallet
} from '@/lib/icons'
import { Tabs } from 'expo-router'
import type { LucideIcon } from 'lucide-react-native'

function TabBarIcon({ Icon, focused }: { Icon: LucideIcon; focused: boolean }) {
  return (
    <Icon
      className={focused ? 'text-primary' : 'text-muted-foreground'}
      strokeWidth={2}
    />
  )
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500'
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Operations',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon Icon={List} focused={focused} />
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
            <TabBarIcon Icon={ChartLine} focused={focused} />
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
            <TabBarIcon Icon={CirclePlus} focused={focused} />
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
  )
}
