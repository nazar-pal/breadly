import { useThemedStyles, type ThemedStylesProps } from '@/context/ThemeContext'
import React from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle
} from 'react-native'

export type IconButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive'
  | 'surface'

export type IconButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface IconButtonProps extends TouchableOpacityProps {
  icon: React.ReactNode
  variant?: IconButtonVariant
  size?: IconButtonSize
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
      borderColor: colors.border
    } as ViewStyle,

    ghostButton: {
      backgroundColor: 'transparent'
    } as ViewStyle,

    destructiveButton: {
      backgroundColor: colors.button.destructiveBg
    } as ViewStyle,

    surfaceButton: {
      backgroundColor: colors.iconBackground.neutral
    } as ViewStyle,

    disabledButton: {
      backgroundColor: colors.button.primaryBgDisabled,
      borderColor: colors.button.primaryBgDisabled
    } as ViewStyle
  })

export default function IconButton({
  icon,
  variant = 'primary',
  size = 'md',
  style,
  disabled,
  className = '',
  ...props
}: IconButtonProps) {
  const styles = useThemedStyles(createStyles)
  const { colors } = useThemedStyles(({ colors }) => ({ colors }))

  const getSizeClassName = () => {
    switch (size) {
      case 'xs':
        return 'w-6 h-6'
      case 'sm':
        return 'w-8 h-8'
      case 'lg':
        return 'w-12 h-12'
      case 'xl':
        return 'w-14 h-14'
      default:
        return 'w-10 h-10'
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
      case 'surface':
        return styles.surfaceButton
      default:
        return styles.primaryButton
    }
  }

  const getIconColor = () => {
    if (disabled) return colors.button.primaryTextDisabled

    switch (variant) {
      case 'primary':
        return colors.button.primaryText
      case 'secondary':
        return colors.button.secondaryText
      case 'outline':
        return colors.text
      case 'ghost':
        return colors.text
      case 'destructive':
        return colors.button.destructiveText
      case 'surface':
        return colors.text
      default:
        return colors.button.primaryText
    }
  }

  const getIconSize = () => {
    switch (size) {
      case 'xs':
        return 12
      case 'sm':
        return 16
      case 'lg':
        return 24
      case 'xl':
        return 28
      default:
        return 20
    }
  }

  const baseClassName =
    `items-center justify-center ${getSizeClassName()} ${className}`.trim()

  // Clone the icon with the appropriate color and size
  const iconWithProps = React.isValidElement(icon)
    ? React.cloneElement(icon, {
        ...(icon.props || {}),
        color: getIconColor(),
        size: getIconSize()
      } as any)
    : icon

  return (
    <TouchableOpacity
      className={baseClassName}
      style={[getVariantStyle(), style]}
      disabled={disabled}
      activeOpacity={disabled ? 1 : 0.8}
      {...props}
    >
      <View className="items-center justify-center">{iconWithProps}</View>
    </TouchableOpacity>
  )
}
