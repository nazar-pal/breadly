import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Pencil, Camera, Mic } from 'lucide-react-native';

type Mode = 'manual' | 'photo' | 'voice';

interface AddExpenseHeaderProps {
  currentMode: Mode;
}

export default function AddExpenseHeader({ currentMode }: AddExpenseHeaderProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const tabs: { id: Mode; label: string; icon: any; path: string }[] = [
    { id: 'manual', label: 'Manual', icon: Pencil, path: '/add' },
    { id: 'photo',  label: 'Photo',  icon: Camera, path: '/add/photo' },
    { id: 'voice',  label: 'Voice',  icon: Mic,    path: '/add/voice' },
  ];

  /** Navigate only when the tapped tab isn’t already active. */
  const handleTabPress = (path: string, isActive: boolean) => {
    if (!isActive) {
      router.navigate(path);           // stays inside the top-tab pager → animates
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          paddingTop: insets.top,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <Text style={[styles.title, { color: colors.text }]}>Add Expense</Text>

      <View style={styles.tabs}>
        {tabs.map(({ id, label, icon: Icon, path }) => {
          const isActive = currentMode === id;

          return (
            <Pressable
              key={id}
              style={[
                styles.tab,
                isActive && { borderBottomColor: colors.primary, borderBottomWidth: 2 },
              ]}
              android_ripple={{ color: colors.primary + '22' }}
              onPress={() => handleTabPress(path, isActive)}
            >
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
                ]}
              >
                {label}
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
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingVertical: 12,
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
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  icon: {
    marginRight: 8,
  },
  tabText: {
    fontSize: 16,
  },
});
