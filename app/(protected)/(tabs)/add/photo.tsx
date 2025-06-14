import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { Camera, Upload } from '@/lib/icons'
import React from 'react'
import { View } from 'react-native'

export default function PhotoScreen() {
  return (
    <View className="flex-1 bg-background">
      <View className="flex-1 p-4">
        <Card>
          <CardContent className="h-[400px] items-center justify-center p-6">
            <View className="mb-6 h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <Camera size={48} className="text-primary" />
            </View>
            <Text className="mx-6 text-center text-base font-medium text-foreground">
              Take a photo of your receipt for automatic expense entry
            </Text>
          </CardContent>
        </Card>

        <View className="mt-4 flex-row gap-2">
          <Button className="flex-1">
            <Camera size={20} className="mr-2 text-primary-foreground" />
            <Text className="text-primary-foreground">Take Photo</Text>
          </Button>
          <Button variant="outline" className="flex-1">
            <Upload size={20} className="mr-2 text-foreground" />
            <Text className="text-foreground">Upload</Text>
          </Button>
        </View>
      </View>
    </View>
  )
}
