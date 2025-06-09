import { useThemedStyles, type ThemedStylesProps } from '@/context/ThemeContext'
import React from 'react'
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native'

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends Omit<PressableProps, 'style'> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  children: React.ReactNode
  fullWidth?: boolean
  style?: ViewStyle | ViewStyle[]
  className?: string
}

const createStyles = ({ colors }: ThemedStylesProps) =>
  StyleSheet.create({
    // Background variants
    primaryButton: {
      backgroundColor: colors.button.primaryBg
    } as ViewStyle,

    secondaryButton: {
      backgroundColor: colors.button.secondaryBg,
      borderWidth: 1,
      borderColor: colors.button.secondaryBorder
    } as ViewStyle,

    outlineButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.primary
    } as ViewStyle,

    ghostButton: {
      backgroundColor: 'transparent'
    } as ViewStyle,

    destructiveButton: {
      backgroundColor: colors.button.destructiveBg
    } as ViewStyle,

    disabledButton: {
      backgroundColor: colors.button.primaryBgDisabled,
      borderColor: colors.button.primaryBgDisabled
    } as ViewStyle,

    // Text color variants
    primaryText: {
      color: colors.button.primaryText
    } as TextStyle,

    secondaryText: {
      color: colors.button.secondaryText
    } as TextStyle,

    outlineText: {
      color: colors.primary
    } as TextStyle,

    ghostText: {
      color: colors.text
    } as TextStyle,

    destructiveText: {
      color: colors.button.destructiveText
    } as TextStyle,

    disabledText: {
      color: colors.button.primaryTextDisabled
    } as TextStyle
  })

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
  className = '',
  ...props
}: ButtonProps) {
  const styles = useThemedStyles(createStyles)

  const getSizeClassName = () => {
    switch (size) {
      case 'sm':
        return 'h-8 px-3'
      case 'lg':
        return 'h-12 px-4'
      default:
        return 'h-10 px-3'
    }
  }

  const getTextSizeClassName = () => {
    switch (size) {
      case 'sm':
        return 'text-xs'
      case 'lg':
        return 'text-base'
      default:
        return 'text-sm'
    }
  }

  const getVariantStyle = () => {
    if (disabled) return styles.disabledButton

    switch (variant) {
      case 'primary':
        return styles.primaryButton
      case 'secondary':
        return styles.secondaryButton
      case 'outline':
        return styles.outlineButton
      case 'ghost':
        return styles.ghostButton
      case 'destructive':
        return styles.destructiveButton
      default:
        return styles.primaryButton
    }
  }

  const getTextVariantStyle = () => {
    if (disabled) return styles.disabledText

    switch (variant) {
      case 'primary':
        return styles.primaryText
      case 'secondary':
        return styles.secondaryText
      case 'outline':
        return styles.outlineText
      case 'ghost':
        return styles.ghostText
      case 'destructive':
        return styles.destructiveText
      default:
        return styles.primaryText
    }
  }

  const getLoadingColor = () => {
    if (disabled) return styles.disabledText.color

    switch (variant) {
      case 'primary':
        return styles.primaryText.color
      case 'secondary':
        return styles.secondaryText.color
      case 'outline':
        return styles.outlineText.color
      case 'ghost':
        return styles.ghostText.color
      case 'destructive':
        return styles.destructiveText.color
      default:
        return styles.primaryText.color
    }
  }

  const baseClassName =
    `flex-row items-center justify-center rounded-md ${getSizeClassName()} ${fullWidth ? 'w-full' : ''} ${className}`.trim()

  return (
    <Pressable
      className={baseClassName}
      style={({ pressed }) => [
        getVariantStyle(),
        pressed && !disabled && { opacity: 0.8 },
        style
      ]}
      disabled={disabled || loading}
      {...props}
    >
      <View className="flex-row items-center justify-center">
        {leftIcon && !loading && <View className="mr-1">{leftIcon}</View>}

        {loading ? (
          <ActivityIndicator size="small" color={getLoadingColor()} />
        ) : (
          <Text
            className={`${getTextSizeClassName()} text-center font-semibold`}
            style={getTextVariantStyle()}
          >
            {children}
          </Text>
        )}

        {rightIcon && !loading && <View className="ml-1">{rightIcon}</View>}
      </View>
    </Pressable>
  )
}
