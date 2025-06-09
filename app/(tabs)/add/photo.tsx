import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { useTheme } from '@/context/ThemeContext'
import { Camera, Upload } from 'lucide-react-native'
import React from 'react'
import { Text, View } from 'react-native'

export default function PhotoScreen() {
  const { colors } = useTheme()

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <View className="flex-1 p-4">
        <Card className="h-[400px] items-center justify-center">
          <View
            className="mb-4 h-20 w-20 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.iconBackground.info }}
          >
            <Camera size={48} color={colors.info} />
          </View>
          <Text
            className="mx-6 text-center text-base font-medium"
            style={{ color: colors.textSecondary }}
          >
            Take a photo of your receipt for automatic expense entry
          </Text>
        </Card>

        <View className="mt-4 flex-row">
          <Button
            variant="primary"
            leftIcon={<Camera size={20} color={colors.textInverse} />}
            style={{ flex: 1, marginRight: 8 }}
          >
            Take Photo
          </Button>
          <Button
            variant="outline"
            leftIcon={<Upload size={20} color={colors.text} />}
            style={{ flex: 1 }}
          >
            Upload
          </Button>
        </View>
      </View>
    </View>
  )
}
