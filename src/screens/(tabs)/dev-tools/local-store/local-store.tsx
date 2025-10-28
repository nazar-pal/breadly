import { Text } from '@/components/ui/text'
import { storage } from '@/lib/storage/mmkv'
import { View } from 'react-native'

export default function LocalStoreScreen() {
  const keys = storage.getAllKeys()

  const formatValue = (value: string | undefined) => {
    if (!value) return 'undefined'

    try {
      const parsed = JSON.parse(value)
      return JSON.stringify(parsed, null, 2)
    } catch {
      // If it's not valid JSON, return the original value
      return value
    }
  }

  return (
    <View className="flex-1 px-4">
      {keys.map(key => {
        const value = storage.getString(key)
        return (
          <View key={key}>
            <Text className="font-semibold">{key}:</Text>
            <Text className="ml-2 font-mono text-sm">{formatValue(value)}</Text>
          </View>
        )
      })}
    </View>
  )
}
