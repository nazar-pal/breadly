import { useThemedStyles, type ThemedStylesProps } from '@/context/ThemeContext'
import React from 'react'
import { Platform, StyleSheet, View, ViewProps, ViewStyle } from 'react-native'

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
}

const createStyles = ({ colors, borderRadius, spacing }: ThemedStylesProps) =>
  StyleSheet.create({
    card: {
      borderRadius: borderRadius.md,
      overflow: 'hidden',
      width: '100%'
    } as ViewStyle,

    // Size variants
    sizeSmall: {
      padding: spacing.sm
    } as ViewStyle,

    sizeMedium: {
      padding: spacing.md
    } as ViewStyle,

    sizeLarge: {
      padding: spacing.lg
    } as ViewStyle,

    sizeExtraLarge: {
      padding: spacing.xl
    } as ViewStyle,

    // Background variants
    elevatedCard: {
      backgroundColor: colors.card,
      ...Platform.select({
        android: {
          elevation: 4
        },
        default: {
          boxShadow: `0px 2px 6px ${colors.shadow}1a`
        }
      })
    } as ViewStyle,

    outlinedCard: {
      backgroundColor: colors.background,
      borderColor: colors.border,
      borderWidth: 1
    } as ViewStyle,

    filledCard: {
      backgroundColor: colors.surface
    } as ViewStyle,

    surfaceCard: {
      backgroundColor: colors.surface
    } as ViewStyle,

    surfaceVariantCard: {
      backgroundColor: colors.surfaceSecondary
    } as ViewStyle,

    primaryCard: {
      backgroundColor: colors.primary
    } as ViewStyle,

    secondaryCard: {
      backgroundColor: colors.iconBackground.neutral
    } as ViewStyle,

    // Elevated variants with different shadow levels
    elevatedLight: {
      ...Platform.select({
        android: {
          elevation: 2
        },
        default: {
          boxShadow: `0px 1px 3px ${colors.shadowLight}`
        }
      })
    } as ViewStyle,

    elevatedMedium: {
      ...Platform.select({
        android: {
          elevation: 4
        },
        default: {
          boxShadow: `0px 2px 6px ${colors.shadow}1a`
        }
      })
    } as ViewStyle,

    elevatedHigh: {
      ...Platform.select({
        android: {
          elevation: 8
        },
        default: {
          boxShadow: `0px 4px 12px ${colors.shadowStrong}`
        }
      })
    } as ViewStyle,

    noPadding: {
      padding: 0
    } as ViewStyle
  })

export default function Card({
  children,
  style,
  variant = 'elevated',
  size = 'md',
  noPadding = false,
  padded,
  ...props
}: CardProps) {
  const styles = useThemedStyles(createStyles)

  const getSizeStyle = () => {
    const shouldHavePadding = padded !== undefined ? padded : !noPadding
    if (!shouldHavePadding) return styles.noPadding

    switch (size) {
      case 'sm':
        return styles.sizeSmall
      case 'lg':
        return styles.sizeLarge
      case 'xl':
        return styles.sizeExtraLarge
      default:
        return styles.sizeMedium
    }
  }

  const getVariantStyle = () => {
    switch (variant) {
      case 'elevated':
        return [styles.elevatedCard, styles.elevatedMedium]
      case 'outlined':
        return styles.outlinedCard
      case 'filled':
        return styles.filledCard
      case 'surface':
        return styles.surfaceCard
      case 'surfaceVariant':
        return styles.surfaceVariantCard
      case 'primary':
        return [styles.primaryCard, styles.elevatedLight]
      case 'secondary':
        return [styles.secondaryCard, styles.elevatedLight]
      default:
        return [styles.elevatedCard, styles.elevatedMedium]
    }
  }

  const cardStyles = [styles.card, getVariantStyle(), getSizeStyle(), style]

  return (
    <View style={cardStyles} {...props}>
      {children}
    </View>
  )
}
