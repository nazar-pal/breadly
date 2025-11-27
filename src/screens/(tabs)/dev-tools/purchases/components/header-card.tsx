import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import { router, type Href } from 'expo-router'
import { View } from 'react-native'

type HeaderCardProps = {
  appUserId: string | null
  isPremium: boolean
  isCustomerInfoFresh: boolean
  packageCount: number
  entitlementCount: number
  onRefresh: () => void
  onLogDebug: () => void
}

export function HeaderCard({
  appUserId,
  isPremium,
  isCustomerInfoFresh,
  packageCount,
  entitlementCount,
  onRefresh,
  onLogDebug
}: HeaderCardProps) {
  return (
    <Card className="mb-3">
      <CardContent className="gap-3 py-3">
        {/* Top row: User ID + Actions */}
        <View className="flex-row items-center justify-between">
          <View className="min-w-0 flex-1">
            {appUserId && (
              <Text
                className="font-mono text-xs text-muted-foreground"
                numberOfLines={1}
              >
                {appUserId}
              </Text>
            )}
          </View>
          <View className="flex-row gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onPress={onRefresh}
            >
              <Icon name="RefreshCw" size={16} className="text-foreground" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onPress={() => router.push('/paywall' as Href)}
            >
              <Icon name="CreditCard" size={16} className="text-foreground" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onPress={onLogDebug}
            >
              <Icon name="Bug" size={16} className="text-muted-foreground" />
            </Button>
          </View>
        </View>

        {/* Stats row */}
        <View className="flex-row gap-2">
          <Stat
            icon="Crown"
            value={isPremium ? 'Premium' : 'Free'}
            label="Plan"
            highlight={isPremium}
          />
          <Stat
            icon="Activity"
            value={isCustomerInfoFresh ? 'Fresh' : 'Cached'}
            label="Status"
          />
          <Stat icon="Package" value={packageCount} label="Packages" />
          <Stat icon="Key" value={entitlementCount} label="Entitlements" />
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
    <View className="flex-1 items-center rounded-lg bg-muted/50 px-2 py-2">
      <View className="flex-row items-center gap-1">
        <Icon
          name={icon}
          size={12}
          className={highlight ? 'text-amber-500' : 'text-muted-foreground'}
        />
        <Text
          className={`text-xs font-semibold ${highlight ? 'text-amber-600' : 'text-foreground'}`}
        >
          {value}
        </Text>
      </View>
      <Text className="text-[10px] text-muted-foreground">{label}</Text>
    </View>
  )
}

