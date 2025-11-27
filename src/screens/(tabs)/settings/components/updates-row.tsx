import { Icon } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import * as Updates from 'expo-updates'
import { Pressable, View } from 'react-native'

export function UpdatesRow() {
  const updates = Updates.useUpdates()
  const isDisabled = __DEV__ || !Updates.isEnabled

  if (isDisabled) return null

  const { isUpdateAvailable, isUpdatePending } = updates

  const getUpdateStatus = () => {
    if (isUpdatePending) return { label: 'Restart to update', color: 'green' }
    if (isUpdateAvailable) return { label: 'Update available', color: 'blue' }
    return { label: 'Up to date', color: 'gray' }
  }

  const status = getUpdateStatus()

  const handlePress = async () => {
    if (isUpdatePending) {
      await Updates.reloadAsync()
    } else if (isUpdateAvailable) {
      await Updates.fetchUpdateAsync()
    } else {
      await Updates.checkForUpdateAsync()
    }
  }

  return (
    <Pressable
      className="flex-row items-center justify-between border-b border-border/30 py-3 active:opacity-70"
      onPress={handlePress}
    >
      <View className="flex-row items-center">
        <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-muted">
          <Icon name="RefreshCw" size={18} className="text-primary" />
        </View>
        <Text className="font-medium">App Updates</Text>
      </View>
      <View className="flex-row items-center gap-2">
        <View
          className={`h-2 w-2 rounded-full ${
            status.color === 'green'
              ? 'bg-green-500'
              : status.color === 'blue'
                ? 'bg-blue-500'
                : 'bg-gray-400'
          }`}
        />
        <Text className="text-sm text-muted-foreground">{status.label}</Text>
      </View>
    </Pressable>
  )
}

