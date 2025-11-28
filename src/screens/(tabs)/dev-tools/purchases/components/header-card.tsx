import { Card, CardContent } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import * as Clipboard from 'expo-clipboard'
import { useState } from 'react'
import { Pressable, View } from 'react-native'

type HeaderCardProps = {
  appUserId: string | null
  isPremium: boolean
  isCustomerInfoFresh: boolean
  packageCount: number
  entitlementCount: number
}

export function HeaderCard({
  appUserId,
  isPremium,
  isCustomerInfoFresh,
  packageCount,
  entitlementCount
}: HeaderCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyUserId = async () => {
    if (!appUserId) return
    try {
      await Clipboard.setStringAsync(appUserId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Silently fail
    }
  }

  return (
    <Card className="mb-3">
      <CardContent className="gap-2.5 py-2.5">
        {/* User ID row with copy button */}
        {appUserId && (
          <Pressable
            onPress={handleCopyUserId}
            className="bg-muted/50 flex-row items-center gap-2 rounded-md px-2.5 py-1.5"
          >
            <Text
              className="text-muted-foreground min-w-0 flex-1 font-mono text-[11px]"
              numberOfLines={1}
            >
              {appUserId}
            </Text>
            <Icon
              name={copied ? 'Check' : 'Copy'}
              size={12}
              className={copied ? 'text-green-600' : 'text-muted-foreground'}
            />
          </Pressable>
        )}

        {/* Stats grid - 2x2 layout */}
        <View className="flex-row gap-2">
          <View className="flex-1 gap-2">
            <Stat
              icon="Crown"
              value={isPremium ? 'Premium' : 'Free'}
              label="Plan"
              highlight={isPremium}
            />
            <Stat icon="Package" value={packageCount} label="Packages" />
          </View>
          <View className="flex-1 gap-2">
            <Stat
              icon="Activity"
              value={isCustomerInfoFresh ? 'Fresh' : 'Cached'}
              label="Status"
            />
            <Stat icon="Key" value={entitlementCount} label="Entitlements" />
          </View>
        </View>
      </CardContent>
    </Card>
  )
}

function Stat({
  icon,
  value,
  label,
  highlight
}: {
  icon: string
  value: string | number
  label: string
  highlight?: boolean
}) {
  return (
    <View className="bg-muted/40 flex-row items-center justify-between rounded-lg px-2.5 py-2">
      <View className="flex-row items-center gap-1.5">
        <Icon
          name={icon}
          size={12}
          className={highlight ? 'text-amber-500' : 'text-muted-foreground'}
        />
        <Text className="text-muted-foreground text-[10px]">{label}</Text>
      </View>
      <Text
        className={`text-xs font-semibold ${highlight ? 'text-amber-600' : 'text-foreground'}`}
      >
        {value}
      </Text>
    </View>
  )
}
