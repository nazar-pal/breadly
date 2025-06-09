import Button from '@/components/ui-old/Button'
import Card from '@/components/ui-old/Card'
import { Mic } from 'lucide-react-native'
import React from 'react'
import { Text, View } from 'react-native'

export default function VoiceScreen() {
  return (
    <View className="flex-1 bg-old-background">
      <View className="flex-1 p-4">
        <Card className="h-[400px] items-center justify-center">
          <View className="mb-6 h-20 w-20 items-center justify-center rounded-full bg-old-icon-bg-warning">
            <Mic size={48} color="#F59E0B" />
          </View>
          <Text className="mb-2 text-center text-lg font-semibold text-old-text">
            Tap the microphone and describe your expense
          </Text>
          <Text className="mt-3 text-center italic text-old-text-secondary">
            Example: &ldquo;I spent $42.50 on groceries at Whole Foods
            yesterday&rdquo;
          </Text>
        </Card>

        <Button
          variant="primary"
          leftIcon={<Mic size={20} color="#FFFFFF" />}
          style={{ alignSelf: 'center', marginTop: 24 }}
        >
          Start Recording
        </Button>
      </View>
    </View>
  )
}
