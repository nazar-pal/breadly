import React from 'react';
import { View, StyleSheet, ViewProps, Platform } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined' | 'filled';
  padded?: boolean;
}

export default function Card({
  children,
  style,
  variant = 'elevated',
  padded = true,
  ...props
}: CardProps) {
  const { colors, borderRadius, spacing } = useTheme();

  const getCardStyle = () => {
    const baseStyle = {
      backgroundColor: colors.card,
      borderRadius: borderRadius.md,
    };

    switch (variant) {
      case 'elevated':
        return Platform.select({
          android: {
            ...baseStyle,
            elevation: 4,
            backgroundColor: colors.card,
          },
          ios: {
            ...baseStyle,
            shadowColor: colors.isDark ? '#000000' : '#000000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: colors.isDark ? 0.5 : 0.1,
            shadowRadius: 6,
          },
          web: {
            ...baseStyle,
            shadowColor: colors.isDark ? '#000000' : '#000000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: colors.isDark ? 0.5 : 0.1,
            shadowRadius: 6,
          },
        });
      case 'outlined':
        return {
          ...baseStyle,
          borderColor: colors.border,
          borderWidth: 1,
        };
      case 'filled':
        return {
          ...baseStyle,
          backgroundColor: colors.secondary,
        };
      default:
        return baseStyle;
    }
  };

  return (
    <View
      style={[
        styles.card,
        getCardStyle(),
        padded && { padding: spacing.md },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    width: '100%',
  },
});
