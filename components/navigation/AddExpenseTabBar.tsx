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
      <View style={styles.header}>
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
                style={[
                  styles.tab,
                  focused && { borderBottomWidth: 2, borderBottomColor: colors.primary }
                ]}
                onPress={onPress}
              >
                <Icon
                  size={20}
                  color={focused ? colors.primary : colors.textSecondary}
                  style={{ marginRight: 6 }}
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
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  tabsRow: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
    marginLeft: 24,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginLeft: 8,
  },
  label: {
    fontSize: 15,
  },
});