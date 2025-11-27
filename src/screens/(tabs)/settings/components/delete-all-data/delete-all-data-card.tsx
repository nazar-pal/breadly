import { Card, CardContent } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import { useState } from 'react'
import { Pressable, View } from 'react-native'
import { ConfirmationDialog } from './confirmation-dialog'

export function DeleteAllDataCard() {
  const [showConfirmation, setShowConfirmation] = useState(false)

  return (
    <>
      <Card className="border-red-200/50 dark:border-red-900/30">
        <CardContent className="py-2">
          <Pressable
            className="flex-row items-center py-3 active:opacity-70"
            onPress={() => setShowConfirmation(true)}
          >
            <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <Icon
                name="Trash2"
                size={18}
                className="text-red-600 dark:text-red-400"
              />
            </View>
            <View className="flex-1">
              <Text className="font-medium text-red-700 dark:text-red-300">
                Delete All My Data
              </Text>
              <Text className="text-sm text-red-600/80 dark:text-red-400/80">
                Permanently erase everything
              </Text>
            </View>
            <Icon
              name="ChevronRight"
              size={18}
              className="text-red-400 dark:text-red-500"
            />
          </Pressable>
        </CardContent>
      </Card>

      <ConfirmationDialog
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
      />
    </>
  )
}
