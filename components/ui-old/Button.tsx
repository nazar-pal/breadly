import React from 'react'
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  Text,
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

  const getVariantClassName = () => {
    if (disabled) {
      return 'bg-old-button-primary-bg-disabled border-old-button-primary-bg-disabled'
    }

    switch (variant) {
      case 'primary':
        return 'bg-old-button-primary-bg'
      case 'secondary':
        return 'bg-old-button-secondary-bg border border-old-button-secondary-border'
      case 'outline':
        return 'bg-transparent border border-old-primary'
      case 'ghost':
        return 'bg-transparent'
      case 'destructive':
        return 'bg-old-button-destructive-bg'
      default:
        return 'bg-old-button-primary-bg'
    }
  }

  const getTextVariantClassName = () => {
    if (disabled) {
      return 'text-old-button-primary-text-disabled'
    }

    switch (variant) {
      case 'primary':
        return 'text-old-button-primary-text'
      case 'secondary':
        return 'text-old-button-secondary-text'
      case 'outline':
        return 'text-old-primary'
      case 'ghost':
        return 'text-old-text'
      case 'destructive':
        return 'text-old-button-destructive-text'
      default:
        return 'text-old-button-primary-text'
    }
  }

  const getLoadingColor = () => {
    if (disabled) return '#A0ADB8' // old-button-primary-text-disabled

    switch (variant) {
      case 'primary':
        return '#FFFFFF' // old-button-primary-text
      case 'secondary':
        return '#4A5568' // old-button-secondary-text
      case 'outline':
        return '#6366F1' // old-primary
      case 'ghost':
        return '#1A202C' // old-text
      case 'destructive':
        return '#FFFFFF' // old-button-destructive-text
      default:
        return '#FFFFFF' // old-button-primary-text
    }
  }

  const baseClassName =
    `flex-row items-center justify-center rounded-md ${getSizeClassName()} ${getVariantClassName()} ${fullWidth ? 'w-full' : ''} ${className}`.trim()

  return (
    <Pressable
      className={baseClassName}
      style={({ pressed }) => [pressed && !disabled && { opacity: 0.8 }, style]}
      disabled={disabled || loading}
      {...props}
    >
      <View className="flex-row items-center justify-center">
        {leftIcon && !loading && <View className="mr-1">{leftIcon}</View>}

        {loading ? (
          <ActivityIndicator size="small" color={getLoadingColor()} />
        ) : (
          <Text
            className={`${getTextSizeClassName()} ${getTextVariantClassName()} text-center font-semibold`}
          >
            {children}
          </Text>
        )}

        {rightIcon && !loading && <View className="ml-1">{rightIcon}</View>}
      </View>
    </Pressable>
  )
}
