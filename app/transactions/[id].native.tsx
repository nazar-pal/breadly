import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import { useGetTransaction } from '@/data/client/queries'
import { formatCurrencyWithSign } from '@/lib/utils/format-currency'
import { useUserSession } from '@/system/session-and-migration'
import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import { Image, ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface DetailItemProps {
  icon: React.ReactNode
  label: string
  value: string
  showBorder?: boolean
}

function DetailItem({
  icon,
  label,
  value,
  showBorder = true
}: DetailItemProps) {
  return (
    <>
      <View className="flex-row items-center py-3">
        <View className="mr-3 h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
          {icon}
        </View>
        <View className="flex-1">
          <Text className="mb-1 text-sm text-muted-foreground">{label}</Text>
          <Text className="text-base font-medium text-foreground">{value}</Text>
        </View>
      </View>
      {showBorder && <View className="h-px w-full bg-border" />}
    </>
  )
}

export default function TransactionDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const insets = useSafeAreaInsets()
  const { userId } = useUserSession()
  // Find the expense with the matching ID
  const transactions = useGetTransaction({
    userId,
    transactionId: id
  })

  const transaction = transactions.data?.[0]

  // Placeholder for receipt image (first attachment if available, fall back image)
  const receiptImageUrl =
    'https://images.pexels.com/photos/3943723/pexels-photo-3943723.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'

  if (!transaction) {
    return (
      <View className="flex-1 bg-background">
        <Text className="mt-10 text-center text-lg text-destructive">
          Transaction not found
        </Text>
      </View>
    )
  }

  // Derive category path (Parent > Child) where available
  const categoryPath = (() => {
    const cat = transaction.category
    if (!cat) return 'No category'
    if (cat.parent) return `${cat.parent.name} · ${cat.name}`
    return cat.name
  })()

  // Currency-aware amount
  const currencyCode =
    transaction.currencyId || transaction.account?.currencyId || 'USD'
  const amountDisplay = formatCurrencyWithSign(
    transaction.type === 'expense' ? -transaction.amount : transaction.amount,
    currencyCode
  )

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{
        padding: 16,
        paddingBottom: insets.bottom + 16
      }}
    >
      {/* Amount Summary */}
      <Card className="mb-4 overflow-hidden">
        <CardContent className="items-center py-8">
          <View className="mb-3 rounded-full bg-primary/10 px-3 py-1">
            <Text className="text-xs font-medium text-primary">
              {transaction.type.toUpperCase()}
            </Text>
          </View>
          <Text className="mb-1 text-[44px] font-extrabold tracking-tight text-foreground">
            {amountDisplay}
          </Text>
          <Text className="text-sm text-muted-foreground">
            {transaction.txDate.toLocaleDateString()}
          </Text>
        </CardContent>
      </Card>

      {/* Details Card */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Transaction Details</CardTitle>
        </CardHeader>
        <CardContent>
          <DetailItem
            icon={<Icon name="Wallet" size={20} className="text-primary" />}
            label="Account"
            value={transaction.account?.name ?? '—'}
          />

          <DetailItem
            icon={<Icon name="Repeat" size={20} className="text-primary" />}
            label="Counter Account"
            value={transaction.counterAccount?.name ?? '—'}
          />

          <DetailItem
            icon={<Icon name="Tag" size={20} className="text-primary" />}
            label="Category"
            value={categoryPath}
          />

          <DetailItem
            icon={<Icon name="Calendar" size={20} className="text-primary" />}
            label="Date"
            value={transaction.txDate.toLocaleDateString()}
          />

          <DetailItem
            icon={
              <Icon name="TextAlignStart" size={20} className="text-primary" />
            }
            label="Notes"
            value={transaction.notes ?? 'No notes'}
            showBorder={false}
          />
        </CardContent>
      </Card>

      {/* Receipt Photo */}
      {transaction.transactionAttachments.length > 0 && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Receipt Photo</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="overflow-hidden rounded-lg bg-secondary">
              <Image
                source={{ uri: receiptImageUrl }}
                className="h-[250px] w-full"
                resizeMode="cover"
              />
            </View>
          </CardContent>
        </Card>
      )}

      {/* Voice Memo */}
      {transaction.transactionAttachments.length > 0 && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Voice Memo</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="flex-row items-center rounded-lg bg-secondary/50 p-4">
              <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Icon name="Mic" size={20} className="text-primary" />
              </View>
              <View>
                <Text className="text-base font-medium text-foreground">
                  Voice Memo
                </Text>
                <Text className="text-sm text-muted-foreground">
                  Duration: 00:12
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>
      )}
    </ScrollView>
  )
}
