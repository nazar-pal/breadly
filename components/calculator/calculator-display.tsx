import { Text } from '@/components/ui/text'
import { View } from 'react-native'

interface Props {
  comment: string
  expression: string[]
  currentInput: string
}

export function CalculatorDisplay({
  comment,
  expression,
  currentInput
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
        ${getDisplayExpression(expression, currentInput)}
      </Text>
      {comment && (
        <Text
          className="mt-2 text-right text-xs text-muted-foreground"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {comment}
        </Text>
      )}
    </View>
  )
}
