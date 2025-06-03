import { useTheme } from '@/context/ThemeContext';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface AccountsHeaderProps {
  title?: string;
}

export default function AccountsHeader({
  title = 'Accounts',
}: AccountsHeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.header}>
      <Text style={[styles.screenTitle, { color: colors.text }]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
});
