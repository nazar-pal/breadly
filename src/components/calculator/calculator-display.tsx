import { Text } from '@/components/ui/text'
import { View } from 'react-native'

interface Props {
  displayValue: string
}

export function CalculatorDisplay({ displayValue }: Props) {
  return (
    <View className="min-h-[72px] justify-center rounded-2xl bg-card px-4 py-3 shadow-sm">
      <Text
        className="text-right text-4xl font-bold text-foreground"
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.5}
      >
        {displayValue}
      </Text>
    </View>
  )
}
