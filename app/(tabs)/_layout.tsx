import { Tabs } from 'expo-router'
import {
  ChartBar as BarChart3,
  ChartLine as LineChart,
  List as ListIcon,
  CirclePlus as PlusCircle,
  Settings,
  Wallet
} from 'lucide-react-native'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

function TabBarIcon({ Icon, focused }: { Icon: any; focused: boolean }) {
  return (
    <View
      className={`h-10 w-10 items-center justify-center rounded-[20px] ${
        focused ? 'bg-old-tab-bar-focus-background' : ''
      }`}
    >
      <Icon
        size={24}
        color={focused ? '#6366F1' : '#718096'} // old-tab-bar-active-icon : old-tab-bar-inactive-icon
        strokeWidth={2}
      />
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
            <TabBarIcon Icon={ListIcon} focused={focused} />
          )
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon Icon={BarChart3} focused={focused} />
          )
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: 'Statistics',
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon Icon={LineChart} focused={focused} />
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
            <TabBarIcon Icon={PlusCircle} focused={focused} />
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
