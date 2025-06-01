import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import { Pencil, Camera, Mic } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

const ICONS = { index: Pencil, photo: Camera, voice: Mic };

export default function AddExpenseTabBar({
  state,
  navigation,
}: MaterialTopTabBarProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.background }]}>
      {/* Title */}
      <Text style={[styles.title, { color: colors.text }]}>Add Expense</Text>

      {/* Mode selector */}
      <View style={styles.tabsRow}>
        {state.routes.map((route, i) => {
          const focused = state.index === i;
          const Icon = ICONS[route.name as keyof typeof ICONS];

          const onPress = () => {
            if (!focused) navigation.navigate(route.name);
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              style={styles.tab}
              onPress={onPress}
            >
              <Icon
                size={20}
                color={focused ? colors.primary : colors.textSecondary}
                style={{ marginRight: 4 }}
              />
              <Text
                style={[
                  styles.label,
                  {
                    color: focused ? colors.primary : colors.textSecondary,
                    fontWeight: focused ? '600' : '400',
                  },
                ]}
              >
                {route.name === 'index'
                  ? 'Manual'
                  : route.name.charAt(0).toUpperCase() + route.name.slice(1)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  tabsRow: {
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  label: {
    fontSize: 16,
  },
});
