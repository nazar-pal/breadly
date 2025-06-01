import React from 'react';
import { withLayoutContext } from 'expo-router';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTheme } from '@/context/ThemeContext';
import AddExpenseTabBar from '@/components/navigation/AddExpenseTabBar';

const { Navigator, Screen } = createMaterialTopTabNavigator();
const TopTabs = withLayoutContext(Navigator);

export default function AddLayout() {
  const { colors } = useTheme();

  return (
    <TopTabs
      /* 👇 put the custom component here */
      tabBar={(props) => <AddExpenseTabBar {...props} />}
      /* general options */
      screenOptions={{
        swipeEnabled: true,
        tabBarIndicatorStyle: { backgroundColor: colors.primary, height: 2 },
        tabBarStyle: { backgroundColor: colors.card },
      }}
    >
      <Screen name="index" options={{ title: 'Manual' }} />
      <Screen name="photo" options={{ title: 'Photo' }} />
      <Screen name="voice" options={{ title: 'Voice' }} />
    </TopTabs>
  );
}
