import React from 'react'
import { Platform, View, ViewProps, ViewStyle } from 'react-native'

type CardVariant =
  | 'elevated'
  | 'outlined'
  | 'filled'
  | 'surface'
  | 'surfaceVariant'
  | 'primary'
  | 'secondary'

type CardSize = 'sm' | 'md' | 'lg' | 'xl'

interface CardProps extends ViewProps {
  children: React.ReactNode
  variant?: CardVariant
  size?: CardSize
  noPadding?: boolean
  padded?: boolean
  className?: string
}

export default function Card({
  children,
  style,
  variant = 'elevated',
  size = 'md',
  noPadding = false,
  padded,
  className = '',
  ...props
}: CardProps) {
  const getSizeClassName = () => {
    const shouldHavePadding = padded !== undefined ? padded : !noPadding
    if (!shouldHavePadding) return ''

    switch (size) {
      case 'sm':
        return 'p-2'
      case 'lg':
        return 'p-4'
      case 'xl':
        return 'p-6'
      default:
        return 'p-3'
    }
  }

  const getVariantClassName = () => {
    switch (variant) {
      case 'elevated':
        return 'bg-old-card shadow-md'
      case 'outlined':
        return 'bg-old-background border border-old-border'
      case 'filled':
        return 'bg-old-surface'
      case 'surface':
        return 'bg-old-surface'
      case 'surfaceVariant':
        return 'bg-old-surface-secondary'
      case 'primary':
        return 'bg-old-primary shadow-sm'
      case 'secondary':
        return 'bg-old-icon-bg-neutral shadow-sm'
      default:
        return 'bg-old-card shadow-md'
    }
  }

  const getCustomShadowStyle = (): ViewStyle | undefined => {
    if (Platform.OS === 'android') {
      switch (variant) {
        case 'elevated':
          return { elevation: 4 }
        case 'primary':
        case 'secondary':
          return { elevation: 2 }
        default:
          return undefined
      }
    }
    return undefined
  }

  const baseClassName =
    `rounded-md overflow-hidden w-full ${getSizeClassName()} ${getVariantClassName()} ${className}`.trim()

  return (
    <View
      className={baseClassName}
      style={[getCustomShadowStyle(), style]}
      {...props}
    >
      {children}
    </View>
  )
}
