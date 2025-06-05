import { useTheme, useThemedStyles } from '@/context/ThemeContext';
import React from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

interface CategoryCardProps {
  id: string;
  name: string;
  amount: number;
  icon: React.ReactNode;
  type: 'expense' | 'income';
  onPress: (categoryName: string) => void;
  isEditMode?: boolean;
}

export default function CategoryCard({
  id,
  name,
  amount,
  icon,
  type,
  onPress,
  isEditMode = false,
}: CategoryCardProps) {
  const { colors } = useTheme();

  const styles = useThemedStyles((theme) => ({
    categoryCard: {
      width: '47%' as const,
      padding: theme.spacing.sm * 1.5,
      borderRadius: theme.borderRadius.md * 2,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      backgroundColor: theme.colors.card,
      borderWidth: isEditMode ? 2 : 0,
      borderColor: isEditMode ? theme.colors.primary : 'transparent',
      ...Platform.select({
        ios: {
          shadowColor: theme.colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 1,
          shadowRadius: 4,
        },
        android: {
          elevation: 2,
        },
        web: {
          shadowColor: theme.colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 1,
          shadowRadius: 4,
        },
      }),
    },
    iconContainer: {
      width: 36,
      height: 36,
      borderRadius: theme.borderRadius.md + 2,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    categoryContent: {
      marginLeft: theme.spacing.sm * 1.5,
      flex: 1,
    },
    categoryName: {
      fontSize: 14,
      fontWeight: '600' as const,
      marginBottom: 2,
      color: theme.colors.text,
    },
    categoryAmount: {
      fontSize: 13,
    },
    editHint: {
      fontSize: 12,
      fontWeight: '600' as const,
      color: theme.colors.primary,
    },
  }));

  const getAmountColor = () => {
    if (type === 'income') {
      return amount > 0 ? colors.success : colors.textSecondary;
    }
    return amount > 0 ? colors.text : colors.textSecondary;
  };

  const getIconBackgroundColor = () => {
    if (isEditMode) {
      return colors.iconBackground.primary;
    }
    if (type === 'income') {
      return colors.iconBackground.success;
    }
    return colors.iconBackground.neutral;
  };

  return (
    <Pressable style={styles.categoryCard} onPress={() => onPress(name)}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: getIconBackgroundColor() },
        ]}
      >
        {icon}
      </View>
      <View style={styles.categoryContent}>
        <Text numberOfLines={1} style={styles.categoryName}>
          {name}
        </Text>
        {!isEditMode && (
          <Text style={[styles.categoryAmount, { color: getAmountColor() }]}>
            ${amount.toFixed(2)}
          </Text>
        )}
        {isEditMode && <Text style={styles.editHint}>Tap to edit</Text>}
      </View>
    </Pressable>
  );
}
