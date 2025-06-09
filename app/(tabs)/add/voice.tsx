import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { Mic } from '@/lib/icons'
import React from 'react'
import { View } from 'react-native'

export default function VoiceScreen() {
  return (
    <View className="bg-background flex-1">
      <View className="flex-1 p-4">
        <Card>
          <CardContent className="h-[400px] items-center justify-center p-6">
            <View className="bg-primary/10 mb-6 h-20 w-20 items-center justify-center rounded-full">
              <Mic size={48} className="text-primary" />
            </View>
            <Text className="text-foreground mb-2 text-center text-lg font-semibold">
              Tap the microphone and describe your expense
            </Text>
            <Text className="text-muted-foreground mt-3 text-center italic">
              Example: &ldquo;I spent $42.50 on groceries at Whole Foods
              yesterday&rdquo;
            </Text>
          </CardContent>
        </Card>

        <Button size="lg" className="mx-auto mt-6">
          <Mic size={20} className="text-primary-foreground mr-2" />
          <Text className="text-primary-foreground">Start Recording</Text>
        </Button>
      </View>
    </View>
  )
}
