import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import { useState } from 'react'
import { Pressable, View } from 'react-native'
import { ConfirmationDialog } from './confirmation-dialog'

export function DeleteAllDataCard() {
  const [showConfirmation, setShowConfirmation] = useState(false)

  return (
    <>
      <Card className="mt-4 border-red-200 dark:border-red-900/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-red-600 dark:text-red-400">
            Danger Zone
          </CardTitle>
          <Text variant="muted">Irreversible actions</Text>
        </CardHeader>
        <CardContent className="pt-2">
          <Pressable
            className="flex-row items-center rounded-lg border border-red-200 bg-red-50 px-4 py-3 active:bg-red-100 dark:border-red-900/50 dark:bg-red-950/20 dark:active:bg-red-950/40"
            onPress={() => setShowConfirmation(true)}
          >
            <View className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <Icon
                name="Trash2"
                size={18}
                className="text-red-600 dark:text-red-400"
              />
            </View>
            <View className="flex-1">
              <Text className="text-base font-medium text-red-700 dark:text-red-300">
                Delete All My Data
              </Text>
              <Text className="text-sm text-red-600/80 dark:text-red-400/80">
                Permanently erase all accounts, transactions, and categories
              </Text>
            </View>
            <Icon
              name="ChevronRight"
              size={20}
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
