import { useTheme } from '@/context/ThemeContext';
import { Plus } from 'lucide-react-native';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

interface AddCategoryButtonProps {
  onPress: () => void;
  label?: string;
}

export default function AddCategoryButton({
  onPress,
  label = 'Add Category',
}: AddCategoryButtonProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      style={[
        styles.categoryCard,
        {
          backgroundColor: colors.secondary,
          borderStyle: 'dashed',
          borderWidth: 1,
          borderColor: colors.border,
        },
      ]}
      onPress={onPress}
    >
      <View style={styles.addButtonContent}>
        <Plus size={20} color={colors.text} />
        <Text style={[styles.addButtonText, { color: colors.text }]}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  categoryCard: {
    width: '47%',
    padding: 12,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  addButtonContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
