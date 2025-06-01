import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Pencil, Camera, Mic } from 'lucide-react-native';

interface AddExpenseHeaderProps {
  currentMode: 'manual' | 'photo' | 'voice';
}

export default function AddExpenseHeader({ currentMode }: AddExpenseHeaderProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const tabs = [
    { id: 'manual', label: 'Manual', icon: Pencil, path: '/add' },
    { id: 'photo', label: 'Photo', icon: Camera, path: '/add/photo' },
    { id: 'voice', label: 'Voice', icon: Mic, path: '/add/voice' },
  ];

  const handleTabPress = (path: string) => {
    router.replace(path);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top,
        },
      ]}>
      <Text style={[styles.title, { color: colors.text }]}>Add Expense</Text>
      <View style={styles.tabs}>
        {tabs.map((tab) => {
          const isActive = currentMode === tab.id;
          const Icon = tab.icon;
          return (
            <Pressable
              key={tab.id}
              style={[
                styles.tab,
                isActive && {
                  borderBottomWidth: 2,
                  borderBottomColor: colors.primary,
                },
              ]}
              onPress={() => handleTabPress(tab.path)}>
              <Icon
                size={20}
                color={isActive ? colors.primary : colors.textSecondary}
                style={styles.icon}
              />
              <Text
                style={[
                  styles.tabText,
                  {
                    color: isActive ? colors.primary : colors.textSecondary,
                    fontWeight: isActive ? '600' : '400',
                  },
                ]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  icon: {
    marginRight: 8,
  },
  tabText: {
    fontSize: 16,
  },
});