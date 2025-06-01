import React from 'react';
import { withLayoutContext } from 'expo-router';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTheme } from '@/context/ThemeContext';
import AddExpenseTabBar from '@/components/navigation/AddExpenseTabBar';

const { Navigator, Screen } = createMaterialTopTabNavigator();

// Wrap so Expo Router understands the navigator
const TopTabs = withLayoutContext(Navigator);

export default function AddLayout() {
  const { colors } = useTheme();

  return (
    <TopTabs
      screenOptions={{
        swipeEnabled: true,
        tabBarShowLabel: false, // labels handled in custom bar
        tabBarIndicatorStyle: { backgroundColor: colors.primary, height: 2 },
        tabBarStyle: { backgroundColor: colors.card },
        tabBar: (props) => <AddExpenseTabBar {...props} />,
      }}
    >
      <Screen name="index" options={{ title: 'Manual' }} />
      <Screen name="photo" options={{ title: 'Photo' }} />
      <Screen name="voice" options={{ title: 'Voice' }} />
    </TopTabs>
  );
}
