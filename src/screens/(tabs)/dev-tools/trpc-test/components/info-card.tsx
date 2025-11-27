import { Card, CardContent } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { getBaseUrl } from '@/data/trpc/base-url'
import { Platform, View } from 'react-native'

export function InfoCard() {
  const baseUrl = getBaseUrl?.() ?? 'unknown'

  return (
    <Card className="mb-4">
      <CardContent className="gap-2 py-3">
        <InfoRow label="Base URL" value={baseUrl} mono />
        <InfoRow label="Platform" value={Platform.OS} />
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
  value: string
  mono?: boolean
}) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-sm text-muted-foreground">{label}</Text>
      <Text
        className={`text-sm text-foreground ${mono ? 'font-mono' : ''}`}
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  )
}

