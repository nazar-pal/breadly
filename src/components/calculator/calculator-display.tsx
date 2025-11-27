import { Text } from '@/components/ui/text'
import { View } from 'react-native'

interface Props {
  expression: string[]
  currentInput: string
}

export function CalculatorDisplay({ expression, currentInput }: Props) {
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
    <View className="rounded-2xl bg-card p-4 shadow-sm">
      <Text className="text-right text-4xl font-bold text-foreground">
        {getDisplayExpression(expression, currentInput)}
      </Text>
    </View>
  )
}
