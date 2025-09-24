import { Text } from '@/components/ui/text'
import React from 'react'
import { Pressable } from 'react-native'

interface Props {
  label: string | React.ReactNode
  onPress: () => void
  variant?: 'default' | 'operation' | 'equal' | 'special'
  accessibilityLabel?: string
}

export function CalculatorButton({
  label,
  onPress,
  variant = 'default',
  accessibilityLabel
}: Props) {
  const baseClasses =
    'h-[48px] min-w-[48px] flex-1 items-center justify-center rounded-xl shadow-sm'

  const getButtonClasses = () => {
    let variantClasses = ''
    switch (variant) {
      case 'operation':
        variantClasses = 'bg-primary/80 active:bg-primary/20'
        break
      case 'equal':
        variantClasses = 'bg-primary active:bg-primary/90'
        break
      case 'special':
        variantClasses = 'bg-orange-500/80 active:bg-orange-500/20'
        break
      default:
        variantClasses = 'bg-secondary/70 active:bg-muted'
    }

    return `${baseClasses} ${variantClasses}`
  }

  const getTextClasses = () => {
    const baseClasses = 'text-lg font-semibold'

    let colorClass = ''
    switch (variant) {
      case 'equal':
        colorClass = 'text-primary-foreground'
        break
      case 'operation':
        colorClass = 'text-primary-foreground'
        break
      case 'special':
        colorClass = 'text-primary-foreground'
        break
      default:
        colorClass = 'text-foreground'
    }

    return `${baseClasses} ${colorClass}`
  }

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      className={getButtonClasses()}
      onPress={onPress}
    >
      {typeof label === 'string' ? (
        <Text className={getTextClasses()}>{label}</Text>
      ) : (
        label
      )}
    </Pressable>
  )
}
