import Card from '@/components/ui-old/Card'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { Camera, Upload } from 'lucide-react-native'
import React from 'react'
import { View } from 'react-native'

export default function PhotoScreen() {
  return (
    <View className="flex-1 bg-old-background">
      <View className="flex-1 p-4">
        <Card className="h-[400px] items-center justify-center">
          <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-old-icon-bg-info">
            <Camera size={48} color="#3B82F6" />
          </View>
          <Text className="mx-6 text-center text-base font-medium text-old-text-secondary">
            Take a photo of your receipt for automatic expense entry
          </Text>
        </Card>

        <View className="mt-4 flex-row">
          <Button variant="default" className="mr-2 flex-1">
            <Camera size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text>Take Photo</Text>
          </Button>
          <Button variant="outline" className="flex-1">
            <Upload size={20} color="#1A202C" style={{ marginRight: 8 }} />
            <Text>Upload</Text>
          </Button>
        </View>
      </View>
    </View>
  )
}
