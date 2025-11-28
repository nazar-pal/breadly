import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import type {
  PurchasesOffering,
  PurchasesPackage
} from 'react-native-purchases'
import { View } from 'react-native'

type OfferingCardProps = {
  offering: PurchasesOffering
}

export function OfferingCard({ offering }: OfferingCardProps) {
  const packages = offering.availablePackages

  return (
    <Card className="mb-3">
      <CardHeader className="flex-row items-center justify-between pb-2">
        <View className="flex-row items-center gap-2">
          <Icon name="Package" size={14} className="text-primary" />
          <CardTitle className="text-sm">Current Offering</CardTitle>
        </View>
        <Text className="text-muted-foreground text-xs">
          {packages.length} {packages.length === 1 ? 'plan' : 'plans'}
        </Text>
      </CardHeader>
      <CardContent className="gap-2 pt-0">
        {packages.map((pkg, idx) => (
          <PackageItem
            key={pkg.identifier}
            pkg={pkg}
            isLast={idx === packages.length - 1}
          />
        ))}
      </CardContent>
    </Card>
  )
}

function PackageItem({
  pkg,
  isLast
}: {
  pkg: PurchasesPackage
  isLast: boolean
}) {
  return (
    <View
      className={`border-border bg-muted/30 rounded-lg border p-3 ${!isLast ? 'mb-1' : ''}`}
    >
      <View className="flex-row items-start justify-between">
        <View className="min-w-0 flex-1">
          <Text className="text-foreground text-sm font-semibold">
            {pkg.product.title}
          </Text>
          <Text className="text-muted-foreground mt-0.5 text-xs">
            {pkg.product.description || 'No description'}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-primary text-lg font-bold">
            {pkg.product.priceString}
          </Text>
          <Text className="text-muted-foreground text-[10px]">
            {pkg.product.subscriptionPeriod ?? 'one-time'}
          </Text>
        </View>
      </View>

      <View className="bg-background mt-2 rounded-md p-2">
        <InfoRow label="Product ID" value={pkg.product.identifier} mono />
        <InfoRow label="Package ID" value={pkg.identifier} mono />
        <InfoRow
          label="Period"
          value={pkg.product.subscriptionPeriod ?? 'N/A'}
        />
      </View>
    </View>
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
    <View className="flex-row items-center justify-between py-0.5">
      <Text className="text-muted-foreground text-[10px]">{label}</Text>
      <Text
        className={`text-[10px] ${mono ? 'font-mono' : 'font-medium'} text-foreground`}
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  )
}
