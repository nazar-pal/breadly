import { useTheme } from '@/context/ThemeContext';
import { Plus } from 'lucide-react-native';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

interface AddAccountButtonProps {
  onPress: () => void;
  label?: string;
}

export default function AddAccountButton({
  onPress,
  label = 'Add Account',
}: AddAccountButtonProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      style={[
        styles.container,
        {
          backgroundColor: colors.secondary,
          borderStyle: 'dashed',
          borderWidth: 2,
          borderColor: colors.primary + '40',
        },
      ]}
      onPress={onPress}
    >
      <View style={styles.content}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: colors.primary + '20' },
          ]}
        >
          <Plus size={16} color={colors.primary} />
        </View>
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 12,
    borderRadius: 12,
    minHeight: 60, // Reduced height for single column
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
    }),
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
