import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import { sessionPersistentStore } from '@/lib/storage/user-session-persistent-store'
import * as Clipboard from 'expo-clipboard'
import { useState } from 'react'
import { Pressable, View } from 'react-native'

type StoreItem = {
  label: string
  value: string
  mono?: boolean
  copyable?: boolean
}

export function SessionStoreCard() {
  const [expanded, setExpanded] = useState(false)
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
    <View className="mb-3 rounded-lg border border-border bg-card">
      {/* Header - Pressable to toggle */}
      <Pressable
        onPress={() => setExpanded(prev => !prev)}
        className="flex-row items-center justify-between px-2.5 py-1.5"
      >
        <View className="flex-row items-center gap-1.5">
          <Icon name="UserCog" size={12} className="text-primary" />
          <Text className="text-xs font-semibold">Session Store</Text>
        </View>
        <Icon
          name={expanded ? 'ChevronUp' : 'ChevronDown'}
          size={14}
          className="text-muted-foreground"
        />
      </Pressable>

      {/* Items - only visible when expanded */}
      {expanded && (
        <View className="border-t border-border">
          {items.map((item, idx) => (
            <StoreItemRow
              key={item.label}
              item={item}
              isLast={idx === items.length - 1}
            />
          ))}
        </View>
      )}
    </View>
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
      className={`flex-row items-center justify-between gap-2 px-2.5 py-1 ${
        !isLast ? 'border-b border-border' : ''
      }`}
    >
      <Text className="shrink-0 text-[11px] text-muted-foreground">
        {item.label}
      </Text>
      <View className="min-w-0 shrink flex-row items-center gap-0.5">
        <Text
          className={`min-w-0 shrink text-[11px] ${item.mono ? 'font-mono' : 'font-medium'} text-foreground`}
          numberOfLines={1}
        >
          {item.value}
        </Text>
        {item.copyable && (
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 shrink-0"
            onPress={handleCopy}
          >
            <Icon
              name={copied ? 'Check' : 'Copy'}
              size={10}
              className={copied ? 'text-green-600' : 'text-muted-foreground'}
            />
          </Button>
        )}
      </View>
    </View>
  )
}
