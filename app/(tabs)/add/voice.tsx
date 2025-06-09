import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { Mic } from '@/lib/icons'
import React from 'react'
import { View } from 'react-native'

export default function VoiceScreen() {
  return (
    <View className="flex-1 bg-background">
      <View className="flex-1 p-4">
        <Card>
          <CardContent className="h-[400px] items-center justify-center">
            <View className="mb-6 h-20 w-20 items-center justify-center rounded-full">
              <Mic size={48} color="#F59E0B" />
            </View>
            <Text className="mb-2 text-center text-lg font-semibold text-foreground">
              Tap the microphone and describe your expense
            </Text>
            <Text className="mt-3 text-center italic text-foreground">
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
