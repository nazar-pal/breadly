import Button from '@/components/ui-old/Button'
import Card from '@/components/ui-old/Card'
import { Camera, Upload } from 'lucide-react-native'
import React from 'react'
import { Text, View } from 'react-native'

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
          <Button
            variant="primary"
            leftIcon={<Camera size={20} color="#FFFFFF" />}
            style={{ flex: 1, marginRight: 8 }}
          >
            Take Photo
          </Button>
          <Button
            variant="outline"
            leftIcon={<Upload size={20} color="#1A202C" />}
            style={{ flex: 1 }}
          >
            Upload
          </Button>
        </View>
      </View>
    </View>
  )
}
