import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { Calendar, Mic, Tag } from '@/lib/icons'
import { useGetTransaction } from '@/lib/powersync/data/queries'
import { useUserSession } from '@/lib/user-session'
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

  // Placeholder for receipt image
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

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{
        padding: 16,
        paddingBottom: insets.bottom + 16
      }}
    >
      {/* Amount Card */}
      <Card className="mb-4 overflow-hidden">
        <CardContent className="items-center py-8">
          <Text className="mb-2 text-base text-muted-foreground">
            Total Amount
          </Text>
          <Text className="mb-1 text-[48px] font-extrabold tracking-tight text-primary">
            ${transaction.amount.toFixed(2)}
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
            icon={<Calendar size={20} className="text-primary" />}
            label="Date"
            value={transaction.txDate.toLocaleDateString()}
          />

          <DetailItem
            icon={<Tag size={20} className="text-primary" />}
            label="Category"
            value={transaction.category?.name ?? 'No category'}
          />

          <DetailItem
            icon={<Tag size={20} className="text-primary" />}
            label="Description"
            value={transaction.notes ?? 'No description provided'}
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
                <Mic size={20} className="text-primary" />
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
