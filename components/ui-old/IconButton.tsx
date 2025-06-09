import React from 'react'
import { TouchableOpacity, TouchableOpacityProps, View } from 'react-native'

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

export default function IconButton({
  icon,
  variant = 'primary',
  size = 'md',
  style,
  disabled,
  className = '',
  ...props
}: IconButtonProps) {
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
    if (disabled) {
      return {
        backgroundColor: '#CBD5E0', // colors.button.primaryBgDisabled
        borderColor: '#CBD5E0'
      }
    }

    switch (variant) {
      case 'primary':
        return {
          backgroundColor: '#6366F1' // colors.button.primaryBg
        }
      case 'secondary':
        return {
          backgroundColor: 'transparent', // colors.button.secondaryBg
          borderWidth: 1,
          borderColor: '#E2E8F0' // colors.button.secondaryBorder
        }
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: '#E2E8F0' // colors.border
        }
      case 'ghost':
        return {
          backgroundColor: 'transparent'
        }
      case 'destructive':
        return {
          backgroundColor: '#EF4444' // colors.button.destructiveBg
        }
      case 'surface':
        return {
          backgroundColor: '#F1F5F9' // colors.iconBackground.neutral
        }
      default:
        return {
          backgroundColor: '#6366F1' // colors.button.primaryBg
        }
    }
  }

  const getIconColor = () => {
    if (disabled) return '#A0ADB8' // colors.button.primaryTextDisabled

    switch (variant) {
      case 'primary':
        return '#FFFFFF' // colors.button.primaryText
      case 'secondary':
        return '#4A5568' // colors.button.secondaryText
      case 'outline':
        return '#1A202C' // colors.text
      case 'ghost':
        return '#1A202C' // colors.text
      case 'destructive':
        return '#FFFFFF' // colors.button.destructiveText
      case 'surface':
        return '#1A202C' // colors.text
      default:
        return '#FFFFFF' // colors.button.primaryText
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
