import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { useTheme } from '@/context/ThemeContext'
import { Mic } from 'lucide-react-native'
import React from 'react'
import { Text, View } from 'react-native'

export default function VoiceScreen() {
  const { colors } = useTheme()

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <View className="flex-1 p-4">
        <Card className="h-[400px] items-center justify-center">
          <View
            className="mb-6 h-20 w-20 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.iconBackground.warning }}
          >
            <Mic size={48} color={colors.warning} />
          </View>
          <Text
            className="mb-2 text-center text-lg font-semibold"
            style={{ color: colors.text }}
          >
            Tap the microphone and describe your expense
          </Text>
          <Text
            className="mt-3 text-center italic"
            style={{ color: colors.textSecondary }}
          >
            Example: &ldquo;I spent $42.50 on groceries at Whole Foods
            yesterday&rdquo;
          </Text>
        </Card>

        <Button
          variant="primary"
          leftIcon={<Mic size={20} color={colors.textInverse} />}
          style={{ alignSelf: 'center', marginTop: 24 }}
        >
          Start Recording
        </Button>
      </View>
    </View>
  )
}
