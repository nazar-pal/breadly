import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { Mic } from 'lucide-react-native'
import React from 'react'
import { View } from 'react-native'

export default function VoiceScreen() {
  return (
    <View className="bg-background flex-1">
      <View className="flex-1 p-4">
        <Card>
          <CardContent className="h-[400px] items-center justify-center">
            <View className="mb-6 h-20 w-20 items-center justify-center rounded-full">
              <Mic size={48} color="#F59E0B" />
            </View>
            <Text className="text-foreground mb-2 text-center text-lg font-semibold">
              Tap the microphone and describe your expense
            </Text>
            <Text className="text-foreground mt-3 text-center italic">
              Example: &ldquo;I spent $42.50 on groceries at Whole Foods
              yesterday&rdquo;
            </Text>
          </CardContent>
        </Card>

        <Button variant="default" size="lg" className="mx-auto mt-6">
          <Mic size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text>Start Recording</Text>
        </Button>
      </View>
    </View>
  )
}
