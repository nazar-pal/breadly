import { Text } from '@/components/ui/text'
import { format, isToday } from 'date-fns'
import { View } from 'react-native'

interface Props {
  comment: string
  expression: string[]
  currentInput: string
  currencySymbol?: string
  selectedDate?: Date
}

export function CalculatorDisplay({
  comment,
  expression,
  currentInput,
  currencySymbol = '$',
  selectedDate
}: Props) {
  const getDisplayExpression = (
    expression: string[],
    currentInput: string
  ): string => {
    if (expression.length === 0) return currentInput
    return (
      expression.join(' ') + (currentInput !== '0' ? ` ${currentInput}` : '')
    )
  }

  return (
    <View className="mb-6 rounded-2xl bg-card p-4 shadow-sm">
      <Text className="text-right text-4xl font-bold text-foreground">
        {currencySymbol}
        {getDisplayExpression(expression, currentInput)}
      </Text>
      {(() => {
        const showDate = selectedDate ? !isToday(selectedDate) : false
        const dateLabel = showDate ? format(selectedDate!, 'MMM d, yyyy') : ''
        const bottomLine = showDate
          ? comment
            ? `${dateLabel} • ${comment}`
            : dateLabel
          : comment

        return bottomLine ? (
          <Text
            className="mt-2 text-right text-xs text-muted-foreground"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {bottomLine}
          </Text>
        ) : null
      })()}
    </View>
  )
}
