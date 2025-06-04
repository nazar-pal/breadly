import { useTheme } from '@/context/ThemeContext';
import { Tabs } from 'expo-router';
import {
  ChartBar as BarChart3,
  ChartLine as LineChart,
  List as ListIcon,
  CirclePlus as PlusCircle,
  Settings,
  Wallet,
} from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function TabBarIcon({
  Icon,
  focused,
  color,
  focusBackgroundColor,
}: {
  Icon: any;
  focused: boolean;
  color: string;
  focusBackgroundColor: string;
}) {
  return (
    <View
      style={[
        styles.iconContainer,
        focused && {
          backgroundColor: focusBackgroundColor,
        },
      ]}
    >
      <Icon size={24} color={color} strokeWidth={2} />
    </View>
  );
}

export default function TabLayout() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.tabBar.background,
          borderTopColor: colors.tabBar.border,
          height: 56 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarActiveTintColor: colors.tabBar.activeLabel,
        tabBarInactiveTintColor: colors.tabBar.inactiveLabel,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Operations',
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon
              Icon={ListIcon}
              focused={focused}
              color={
                focused ? colors.tabBar.activeIcon : colors.tabBar.inactiveIcon
              }
              focusBackgroundColor={colors.tabBar.focusBackground}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon
              Icon={BarChart3}
              focused={focused}
              color={
                focused ? colors.tabBar.activeIcon : colors.tabBar.inactiveIcon
              }
              focusBackgroundColor={colors.tabBar.focusBackground}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: 'Statistics',
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon
              Icon={LineChart}
              focused={focused}
              color={
                focused ? colors.tabBar.activeIcon : colors.tabBar.inactiveIcon
              }
              focusBackgroundColor={colors.tabBar.focusBackground}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="accounts"
        options={{
          title: 'Accounts',
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon
              Icon={Wallet}
              focused={focused}
              color={
                focused ? colors.tabBar.activeIcon : colors.tabBar.inactiveIcon
              }
              focusBackgroundColor={colors.tabBar.focusBackground}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add',
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon
              Icon={PlusCircle}
              focused={focused}
              color={
                focused ? colors.tabBar.activeIcon : colors.tabBar.inactiveIcon
              }
              focusBackgroundColor={colors.tabBar.focusBackground}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon
              Icon={Settings}
              focused={focused}
              color={
                focused ? colors.tabBar.activeIcon : colors.tabBar.inactiveIcon
              }
              focusBackgroundColor={colors.tabBar.focusBackground}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
