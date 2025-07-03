import { Text } from '@/components/ui/text'
import React from 'react'
import { Pressable } from 'react-native'
import { CalcButtonProps } from './types'

export function CalcButton({
  label,
  onPress,
  variant = 'default',
  isWide = false
}: CalcButtonProps) {
  const getButtonClasses = () => {
    const baseClasses =
      'h-[60px] items-center justify-center rounded-2xl shadow-sm'
    const widthClass = isWide ? 'flex-[2]' : 'flex-1'

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
        variantClasses = 'bg-card active:bg-muted'
    }

    return `${baseClasses} ${widthClass} ${variantClasses}`
  }

  const getTextClasses = () => {
    const baseClasses = 'text-xl font-semibold'

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
    <Pressable className={getButtonClasses()} onPress={onPress}>
      <Text className={getTextClasses()}>{label}</Text>
    </Pressable>
  )
}
