import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import { sessionPersistentStore } from '@/lib/storage/user-session-persistent-store'
import * as Clipboard from 'expo-clipboard'
import { useState } from 'react'
import { View } from 'react-native'

type StoreItem = {
  label: string
  value: string
  mono?: boolean
  copyable?: boolean
}

export function SessionStoreCard() {
  const state = sessionPersistentStore.getState()

  const items: StoreItem[] = [
    {
      label: 'Guest ID',
      value: state.guestId || 'null',
      mono: true,
      copyable: !!state.guestId
    },
    {
      label: 'Replace Guest Data',
      value: state.needToReplaceGuestWithAuthUserId ? 'true' : 'false'
    },
    {
      label: 'Seed Default Data',
      value: state.needToSeedDefaultDataForGuestUser ? 'true' : 'false'
    },
    { label: 'Sync Enabled', value: state.syncEnabled ? 'true' : 'false' }
  ]

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <View className="flex-row items-center gap-2">
          <Icon name="UserCog" size={14} className="text-primary" />
          <CardTitle className="text-sm">Session Store</CardTitle>
        </View>
      </CardHeader>
      <CardContent className="pt-0">
        <View className="rounded-lg border border-border bg-muted/30">
          {items.map((item, idx) => (
            <StoreItemRow
              key={item.label}
              item={item}
              isLast={idx === items.length - 1}
            />
          ))}
        </View>
      </CardContent>
    </Card>
  )
}

function StoreItemRow({
  item,
  isLast
}: {
  item: StoreItem
  isLast: boolean
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await Clipboard.setStringAsync(item.value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <View
      className={`flex-row items-center justify-between gap-2 px-3 py-2 ${
        !isLast ? 'border-b border-border' : ''
      }`}
    >
      <Text className="shrink-0 text-xs text-muted-foreground">
        {item.label}
      </Text>
      <View className="min-w-0 shrink flex-row items-center gap-1">
        <Text
          className={`min-w-0 shrink text-xs ${item.mono ? 'font-mono' : 'font-medium'} text-foreground`}
          numberOfLines={1}
        >
          {item.value}
        </Text>
        {item.copyable && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0"
            onPress={handleCopy}
          >
            <Icon
              name={copied ? 'Check' : 'Copy'}
              size={12}
              className={copied ? 'text-green-600' : 'text-muted-foreground'}
            />
          </Button>
        )}
      </View>
    </View>
  )
}
