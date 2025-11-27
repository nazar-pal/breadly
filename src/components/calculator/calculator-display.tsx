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
    <View className="min-h-[72px] justify-center rounded-2xl bg-card px-4 py-3 shadow-sm">
      <Text
        className="text-right text-4xl font-bold text-foreground"
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.5}
      >
        {getDisplayExpression(expression, currentInput)}
      </Text>
    </View>
  )
}
