import {
  useThemedStyles,
  type ThemedStylesProps,
} from '@/context/ThemeContext';
import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle | ViewStyle[];
}

const createStyles = ({ colors, spacing, borderRadius }: ThemedStylesProps) =>
  StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: borderRadius.md,
    } as ViewStyle,

    // Size variants
    sizeSmall: {
      height: 32,
      paddingHorizontal: spacing.md,
    } as ViewStyle,

    sizeMedium: {
      height: 40,
      paddingHorizontal: spacing.md,
    } as ViewStyle,

    sizeLarge: {
      height: 48,
      paddingHorizontal: spacing.lg,
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
      borderColor: colors.primary,
    } as ViewStyle,

    ghostButton: {
      backgroundColor: 'transparent',
    } as ViewStyle,

    destructiveButton: {
      backgroundColor: colors.button.destructiveBg,
    } as ViewStyle,

    disabledButton: {
      backgroundColor: colors.button.primaryBgDisabled,
      borderColor: colors.button.primaryBgDisabled,
    } as ViewStyle,

    // Text variants
    textSmall: {
      fontSize: 12,
      fontWeight: '600',
      textAlign: 'center',
    } as TextStyle,

    textMedium: {
      fontSize: 14,
      fontWeight: '600',
      textAlign: 'center',
    } as TextStyle,

    textLarge: {
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
    } as TextStyle,

    primaryText: {
      color: colors.button.primaryText,
    } as TextStyle,

    secondaryText: {
      color: colors.button.secondaryText,
    } as TextStyle,

    outlineText: {
      color: colors.primary,
    } as TextStyle,

    ghostText: {
      color: colors.text,
    } as TextStyle,

    destructiveText: {
      color: colors.button.destructiveText,
    } as TextStyle,

    disabledText: {
      color: colors.button.primaryTextDisabled,
    } as TextStyle,

    // Layout helpers
    fullWidth: {
      width: '100%',
    } as ViewStyle,

    contentContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    } as ViewStyle,

    iconLeft: {
      marginRight: spacing.xs,
    } as ViewStyle,

    iconRight: {
      marginLeft: spacing.xs,
    } as ViewStyle,
  });

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  children,
  fullWidth = false,
  style,
  disabled,
  ...props
}: ButtonProps) {
  const styles = useThemedStyles(createStyles);

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return styles.sizeSmall;
      case 'lg':
        return styles.sizeLarge;
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
      default:
        return styles.primaryButton;
    }
  };

  const getTextSizeStyle = () => {
    switch (size) {
      case 'sm':
        return styles.textSmall;
      case 'lg':
        return styles.textLarge;
      default:
        return styles.textMedium;
    }
  };

  const getTextVariantStyle = () => {
    if (disabled) return styles.disabledText;

    switch (variant) {
      case 'primary':
        return styles.primaryText;
      case 'secondary':
        return styles.secondaryText;
      case 'outline':
        return styles.outlineText;
      case 'ghost':
        return styles.ghostText;
      case 'destructive':
        return styles.destructiveText;
      default:
        return styles.primaryText;
    }
  };

  const getLoadingColor = () => {
    if (disabled) return styles.disabledText.color;

    switch (variant) {
      case 'primary':
        return styles.primaryText.color;
      case 'secondary':
        return styles.secondaryText.color;
      case 'outline':
        return styles.outlineText.color;
      case 'ghost':
        return styles.ghostText.color;
      case 'destructive':
        return styles.destructiveText.color;
      default:
        return styles.primaryText.color;
    }
  };

  const buttonStyles = [
    styles.button,
    getSizeStyle(),
    getVariantStyle(),
    fullWidth && styles.fullWidth,
    style,
  ];

  const textStyles = [getTextSizeStyle(), getTextVariantStyle()];

  return (
    <Pressable
      style={({ pressed }) => [
        ...buttonStyles,
        pressed && !disabled && { opacity: 0.8 },
      ]}
      disabled={disabled || loading}
      {...props}
    >
      <View style={styles.contentContainer}>
        {leftIcon && !loading && (
          <View style={styles.iconLeft}>{leftIcon}</View>
        )}

        {loading ? (
          <ActivityIndicator size="small" color={getLoadingColor()} />
        ) : (
          <Text style={textStyles}>{children}</Text>
        )}

        {rightIcon && !loading && (
          <View style={styles.iconRight}>{rightIcon}</View>
        )}
      </View>
    </Pressable>
  );
}
