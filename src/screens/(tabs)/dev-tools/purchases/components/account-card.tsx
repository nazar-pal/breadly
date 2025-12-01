import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Icon } from '@/components/ui/lucide-icon-by-name'
import { Text } from '@/components/ui/text'
import { View } from 'react-native'
import type { CustomerInfo } from 'react-native-purchases'

type AccountCardProps = {
  customerInfo: CustomerInfo
  appUserId: string | null
  isPremium: boolean
}

export function AccountCard({
  customerInfo,
  appUserId,
  isPremium
}: AccountCardProps) {
  const memberSince = customerInfo.firstSeen
    ? new Date(customerInfo.firstSeen).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : null

  const activeEntitlements = Object.keys(
    customerInfo.entitlements?.active || {}
  )

  return (
    <Card className="mb-3">
      <CardHeader className="flex-row items-center justify-between pb-2">
        <View className="flex-row items-center gap-2">
          <Icon name="User" size={14} className="text-primary" />
          <CardTitle className="text-sm">Account</CardTitle>
        </View>
        <View
          className={`rounded-full px-2 py-0.5 ${isPremium ? 'bg-amber-500/10' : 'bg-muted'}`}
        >
          <Text
            className={`text-[10px] font-medium ${isPremium ? 'text-amber-600' : 'text-muted-foreground'}`}
          >
            {isPremium ? 'Premium' : 'Free'}
          </Text>
        </View>
      </CardHeader>
      <CardContent className="pt-0">
        <View className="border-border bg-muted/30 rounded-lg border p-2">
          <InfoRow label="App User ID" value={appUserId} mono />
          <InfoRow
            label="Original ID"
            value={customerInfo.originalAppUserId}
            mono
          />
          <InfoRow label="Member Since" value={memberSince} />
          <InfoRow
            label="Active Entitlements"
            value={
              activeEntitlements.length > 0
                ? activeEntitlements.join(', ')
                : 'None'
            }
          />
        </View>
      </CardContent>
    </Card>
  )
}

function InfoRow({
  label,
  value,
  mono
}: {
  label: string
  value: string | null | undefined
  mono?: boolean
}) {
  return (
    <View className="flex-row items-center justify-between py-1">
      <Text className="text-muted-foreground text-xs">{label}</Text>
      <Text
        className={`max-w-[60%] text-xs ${mono ? 'font-mono' : 'font-medium'} text-foreground`}
        numberOfLines={1}
      >
        {value ?? '—'}
      </Text>
    </View>
  )
}
