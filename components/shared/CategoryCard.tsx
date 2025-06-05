import { useTheme, useThemedStyles } from '@/context/ThemeContext';
import React, { useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

interface CategoryCardProps {
  id: string;
  name: string;
  amount: number;
  icon: React.ReactNode;
  type: 'expense' | 'income';
  onPress: (categoryName: string) => void;
  onLongPress?: (categoryId: string, categoryName: string) => void;
}

export default function CategoryCard({
  id,
  name,
  amount,
  icon,
  type,
  onPress,
  onLongPress,
}: CategoryCardProps) {
  const { colors } = useTheme();
  const [isPressed, setIsPressed] = useState(false);

  const styles = useThemedStyles((theme) => ({
    categoryCard: {
      width: '47%' as const,
      padding: theme.spacing.sm * 1.5,
      borderRadius: theme.borderRadius.md * 2,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      backgroundColor: theme.colors.card,
      opacity: isPressed ? 0.7 : 1,
      transform: [{ scale: isPressed ? 0.98 : 1 }],
      ...Platform.select({
        ios: {
          shadowColor: theme.colors.shadow,
          shadowOffset: { width: 0, height: isPressed ? 1 : 2 },
          shadowOpacity: isPressed ? 0.5 : 1,
          shadowRadius: isPressed ? 2 : 4,
        },
        android: {
          elevation: isPressed ? 1 : 2,
        },
        web: {
          shadowColor: theme.colors.shadow,
          shadowOffset: { width: 0, height: isPressed ? 1 : 2 },
          shadowOpacity: isPressed ? 0.5 : 1,
          shadowRadius: isPressed ? 2 : 4,
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
  }));

  const getAmountColor = () => {
    if (type === 'income') {
      return amount > 0 ? colors.success : colors.textSecondary;
    }
    return amount > 0 ? colors.text : colors.textSecondary;
  };

  const getIconBackgroundColor = () => {
    if (type === 'income') {
      return colors.iconBackground.success;
    }
    return colors.iconBackground.neutral;
  };

  const handleLongPress = () => {
    if (onLongPress) {
      onLongPress(id, name);
    }
  };

  const handlePressIn = () => {
    setIsPressed(true);
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };

  return (
    <Pressable
      style={styles.categoryCard}
      onPress={() => onPress(name)}
      onLongPress={handleLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      delayLongPress={500}
    >
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
        <Text style={[styles.categoryAmount, { color: getAmountColor() }]}>
          ${amount.toFixed(2)}
        </Text>
      </View>
    </Pressable>
  );
}
