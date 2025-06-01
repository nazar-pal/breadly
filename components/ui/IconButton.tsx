import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface IconButtonProps extends TouchableOpacityProps {
  icon: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export default function IconButton({
  icon,
  variant = 'primary',
  size = 'md',
  style,
  disabled,
  ...props
}: IconButtonProps) {
  const { colors, borderRadius } = useTheme();

  const getBackgroundColor = () => {
    if (disabled) return colors.secondary;

    switch (variant) {
      case 'primary':
        return colors.primary;
      case 'secondary':
        return colors.secondary;
      case 'ghost':
        return 'transparent';
      default:
        return colors.primary;
    }
  };

  const getIconColor = () => {
    if (disabled) return colors.textSecondary;

    switch (variant) {
      case 'primary':
        return '#FFFFFF';
      case 'secondary':
      case 'ghost':
        return colors.text;
      default:
        return '#FFFFFF';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { width: 32, height: 32 };
      case 'lg':
        return { width: 48, height: 48 };
      default:
        return { width: 40, height: 40 };
    }
  };

  const buttonStyles = [
    styles.button,
    {
      backgroundColor: getBackgroundColor(),
      borderRadius: borderRadius.md,
      ...getSizeStyles(),
    },
    style,
  ];

  // Clone the icon with the appropriate color
  const iconWithColor = React.cloneElement(icon as React.ReactElement, {
    color: getIconColor(),
    size: size === 'sm' ? 16 : size === 'lg' ? 24 : 20,
  });

  return (
    <TouchableOpacity style={buttonStyles} disabled={disabled} {...props}>
      <View style={styles.iconContainer}>{iconWithColor}</View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
