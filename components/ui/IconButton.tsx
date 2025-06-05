import {
  useThemedStyles,
  type ThemedStylesProps,
} from '@/context/ThemeContext';
import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native';

export type IconButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive'
  | 'surface';

export type IconButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface IconButtonProps extends TouchableOpacityProps {
  icon: React.ReactNode;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
}

const createStyles = ({ colors, borderRadius }: ThemedStylesProps) =>
  StyleSheet.create({
    button: {
      alignItems: 'center',
      justifyContent: 'center',
    } as ViewStyle,

    // Size variants
    sizeExtraSmall: {
      width: 24,
      height: 24,
    } as ViewStyle,

    sizeSmall: {
      width: 32,
      height: 32,
    } as ViewStyle,

    sizeMedium: {
      width: 40,
      height: 40,
    } as ViewStyle,

    sizeLarge: {
      width: 48,
      height: 48,
    } as ViewStyle,

    sizeExtraLarge: {
      width: 56,
      height: 56,
    } as ViewStyle,

    // Background variants
    primaryButton: {
      backgroundColor: colors.button.primaryBg,
    } as ViewStyle,

    secondaryButton: {
      backgroundColor: colors.button.secondaryBg,
      borderWidth: 1,
      borderColor: colors.button.secondaryBorder,
    } as ViewStyle,

    outlineButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.border,
    } as ViewStyle,

    ghostButton: {
      backgroundColor: 'transparent',
    } as ViewStyle,

    destructiveButton: {
      backgroundColor: colors.button.destructiveBg,
    } as ViewStyle,

    surfaceButton: {
      backgroundColor: colors.iconBackground.neutral,
    } as ViewStyle,

    disabledButton: {
      backgroundColor: colors.button.primaryBgDisabled,
      borderColor: colors.button.primaryBgDisabled,
    } as ViewStyle,

    iconContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    } as ViewStyle,
  });

export default function IconButton({
  icon,
  variant = 'primary',
  size = 'md',
  style,
  disabled,
  ...props
}: IconButtonProps) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useThemedStyles(({ colors }) => ({ colors }));

  const getSizeStyle = () => {
    switch (size) {
      case 'xs':
        return styles.sizeExtraSmall;
      case 'sm':
        return styles.sizeSmall;
      case 'lg':
        return styles.sizeLarge;
      case 'xl':
        return styles.sizeExtraLarge;
      default:
        return styles.sizeMedium;
    }
  };

  const getVariantStyle = () => {
    if (disabled) return styles.disabledButton;

    switch (variant) {
      case 'primary':
        return styles.primaryButton;
      case 'secondary':
        return styles.secondaryButton;
      case 'outline':
        return styles.outlineButton;
      case 'ghost':
        return styles.ghostButton;
      case 'destructive':
        return styles.destructiveButton;
      case 'surface':
        return styles.surfaceButton;
      default:
        return styles.primaryButton;
    }
  };

  const getIconColor = () => {
    if (disabled) return colors.button.primaryTextDisabled;

    switch (variant) {
      case 'primary':
        return colors.button.primaryText;
      case 'secondary':
        return colors.button.secondaryText;
      case 'outline':
        return colors.text;
      case 'ghost':
        return colors.text;
      case 'destructive':
        return colors.button.destructiveText;
      case 'surface':
        return colors.text;
      default:
        return colors.button.primaryText;
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'xs':
        return 12;
      case 'sm':
        return 16;
      case 'lg':
        return 24;
      case 'xl':
        return 28;
      default:
        return 20;
    }
  };

  const buttonStyles = [
    styles.button,
    getSizeStyle(),
    getVariantStyle(),
    style,
  ];

  // Clone the icon with the appropriate color and size
  const iconWithProps = React.isValidElement(icon)
    ? React.cloneElement(icon, {
        ...(icon.props || {}),
        color: getIconColor(),
        size: getIconSize(),
      } as any)
    : icon;

  return (
    <TouchableOpacity
      style={buttonStyles}
      disabled={disabled}
      activeOpacity={disabled ? 1 : 0.8}
      {...props}
    >
      <View style={styles.iconContainer}>{iconWithProps}</View>
    </TouchableOpacity>
  );
}
