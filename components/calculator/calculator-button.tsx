import { Text } from '@/components/ui/text'
import React from 'react'
import { Pressable } from 'react-native'

interface Props {
  label: string | React.ReactNode
  onPress: () => void
  variant?:
    | 'default'
    | 'operation'
    | 'equal'
    | 'special'
    | 'success'
    | 'success-disabled'
    | 'control'
  accessibilityLabel?: string
  disabled?: boolean
}

export function CalculatorButton({
  label,
  onPress,
  variant = 'default',
  accessibilityLabel,
  disabled = false
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
      case 'success':
        variantClasses = 'bg-emerald-500 active:bg-emerald-600'
        break
      case 'success-disabled':
        variantClasses = 'bg-emerald-500/40'
        break
      default:
        variantClasses = 'bg-secondary/70 active:bg-muted'
    }

    const disabledClasses =
      disabled && variant !== 'success-disabled' ? ' opacity-50' : ''

    return `${baseClasses} ${variantClasses}${disabledClasses}`
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
      case 'success':
        colorClass = 'text-primary-foreground'
        break
      case 'success-disabled':
        colorClass = 'text-primary-foreground/60'
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
      disabled={disabled}
    >
      {typeof label === 'string' ? (
        <Text className={getTextClasses()}>{label}</Text>
      ) : (
        label
      )}
    </Pressable>
  )
}
