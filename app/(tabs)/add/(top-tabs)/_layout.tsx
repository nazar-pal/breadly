import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { withLayoutContext } from 'expo-router';
import AddExpenseHeader from '@/components/navigation/AddExpenseHeader';
import { useTheme } from '@/context/ThemeContext';

const { Navigator } = createMaterialTopTabNavigator();

// Wrap the Navigator to make it work with Expo Router
const MaterialTopTabs = withLayoutContext(Navigator);

export default function AddPagerLayout() {
  const { colors } = useTheme();

  return (
    <MaterialTopTabs
      screenOptions={{
        swipeEnabled: true,
        animationEnabled: true,
        tabBarStyle: { display: 'none' },
        // Customize the swipe animation
        tabBarIndicatorStyle: { backgroundColor: colors.primary },
      }}
    >
      <MaterialTopTabs.Screen
        name="index"
        options={{ header: () => <AddExpenseHeader currentMode="manual" /> }}
      />
      <MaterialTopTabs.Screen
        name="photo"
        options={{ header: () => <AddExpenseHeader currentMode="photo" /> }}
      />
      <MaterialTopTabs.Screen
        name="voice"
        options={{ header: () => <AddExpenseHeader currentMode="voice" /> }}
      />
    </MaterialTopTabs>
  );
}