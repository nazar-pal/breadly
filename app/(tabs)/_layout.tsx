import { useTheme } from '@/context/ThemeContext';
import { Tabs } from 'expo-router';
import { ChartBar as BarChart3, CircleDollarSign as Operations, CirclePlus as PlusCircle, Settings, Wallet, ChartLine as LineChart } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          height: 56 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
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
            <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
              <Operations size={24} color={color} strokeWidth={2} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: 'Statistics',
          tabBarIcon: ({ focused, color }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
              <LineChart size={24} color={color} strokeWidth={2} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="accounts"
        options={{
          title: 'Accounts',
          tabBarIcon: ({ focused, color }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
              <Wallet size={24} color={color} strokeWidth={2} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add',
          tabBarIcon: ({ focused, color }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
              <PlusCircle size={24} color={color} strokeWidth={2} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused, color }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
              <Settings size={24} color={color} strokeWidth={2} />
            </View>
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
  iconContainerFocused: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
});