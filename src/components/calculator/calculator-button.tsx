import { Text } from '@/components/ui/text'
import { Pressable } from 'react-native'

type ButtonVariant = 'default' | 'operation' | 'success' | 'success-disabled'

interface Props {
  label: string | React.ReactNode
  onPress: () => void
  onLongPress?: () => void
  variant?: ButtonVariant
  accessibilityLabel?: string
  disabled?: boolean
}

export function CalculatorButton({
  label,
  onPress,
  onLongPress,
  variant = 'default',
  accessibilityLabel,
  disabled = false
}: Props) {
  const baseClasses =
    'h-[48px] min-w-[48px] flex-1 items-center justify-center rounded-xl shadow-sm active:scale-95 transition-all duration-150'

  const getButtonClasses = () => {
    let variantClasses = ''
    switch (variant) {
      case 'operation':
        variantClasses = 'bg-primary active:bg-primary/90'
        break
      case 'success':
        variantClasses = 'bg-emerald-500 active:bg-emerald-600'
        break
      case 'success-disabled':
        variantClasses = 'bg-emerald-500/30'
        break
      default:
        variantClasses = 'bg-secondary/70 dark:bg-muted/60 active:bg-muted'
    }

    const disabledClasses =
      disabled && variant !== 'success-disabled' ? ' opacity-50' : ''

    return `${baseClasses} ${variantClasses}${disabledClasses}`
  }

  const getTextClasses = () => {
    const textBase = 'text-lg font-semibold'

    switch (variant) {
      case 'operation':
      case 'success':
        return `${textBase} text-primary-foreground`
      case 'success-disabled':
        return `${textBase} text-primary-foreground/60`
      default:
        return `${textBase} text-foreground`
    }
  }

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      className={getButtonClasses()}
      onPress={onPress}
      onLongPress={onLongPress}
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
