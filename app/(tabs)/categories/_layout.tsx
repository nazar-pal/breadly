import React from 'react';
import { withLayoutContext } from 'expo-router';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTheme } from '@/context/ThemeContext';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { Navigator, Screen } = createMaterialTopTabNavigator();
const TopTabs = withLayoutContext(Navigator);

export default function CategoriesLayout() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Categories</Text>
      </View>
      <TopTabs
        screenOptions={{
          tabBarStyle: { backgroundColor: colors.card },
          tabBarIndicatorStyle: { backgroundColor: colors.primary },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarLabelStyle: {
            textTransform: 'none',
            fontSize: 16,
            fontWeight: '600',
          },
        }}
      >
        <Screen 
          name="expenses" 
          options={{ 
            title: 'Expenses',
          }} 
        />
        <Screen 
          name="incomes" 
          options={{ 
            title: 'Income',
          }} 
        />
      </TopTabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
});