import {
  ChartBar,
  ChartLine,
  CirclePlus,
  List,
  Settings,
  Wallet
} from '@/lib/icons'
import { Tabs } from 'expo-router'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

function TabBarIcon({ Icon, focused }: { Icon: any; focused: boolean }) {
  return (
    <View className={`h-10 w-10 items-center justify-center rounded-[20px]`}>
      <Icon size={24} color={focused ? '#6366F1' : '#718096'} strokeWidth={2} />
    </View>
  )
}

export default function TabLayout() {
  const insets = useSafeAreaInsets()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF', // colors.tabBar.background
          borderTopColor: '#E2E8F0', // colors.tabBar.border
          height: 56 + insets.bottom,
          paddingBottom: insets.bottom
        },
        tabBarActiveTintColor: '#6366F1', // colors.tabBar.activeLabel
        tabBarInactiveTintColor: '#718096', // colors.tabBar.inactiveLabel
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500'
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Operations',
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon Icon={List} focused={focused} />
          )
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon Icon={ChartBar} focused={focused} />
          )
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: 'Statistics',
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon Icon={ChartLine} focused={focused} />
          )
        }}
      />
      <Tabs.Screen
        name="accounts"
        options={{
          title: 'Accounts',
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon Icon={Wallet} focused={focused} />
          )
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add',
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon Icon={CirclePlus} focused={focused} />
          )
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon Icon={Settings} focused={focused} />
          )
        }}
      />
    </Tabs>
  )
}
