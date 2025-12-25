import { Text } from '@/components/ui/text'
import { getTransaction } from '@/data/client/queries'
import { useDrizzleQuery } from '@/lib/hooks'
import { useUserSession } from '@/system/session-and-migration'
import React from 'react'
import { ScrollView, View } from 'react-native'
import {
  ReceiptsCard,
  TransactionDetailsCard,
  TransactionHero,
  VoiceMemosCard
} from './components'
import type { TransactionAttachment } from './lib/types'

interface Props {
  id: string
}

export default function TransactionDetailsScreen({ id }: Props) {
  const { userId } = useUserSession()

  const {
    data: [transaction],
    isLoading
  } = useDrizzleQuery(getTransaction({ userId, transactionId: id }))

  // Extract attachments by type
  const receipts = (transaction?.transactionAttachments ?? [])
    .map(ta => ta.attachment)
    .filter((att): att is TransactionAttachment => att?.type === 'receipt')

  const voiceMemos = (transaction?.transactionAttachments ?? [])
    .map(ta => ta.attachment)
    .filter((att): att is TransactionAttachment => att?.type === 'voice')

  if (isLoading) return null

  if (!transaction) {
    return (
      <View className="bg-background flex-1 items-center justify-center">
        <Text className="text-muted-foreground text-lg">
          Transaction not found
        </Text>
      </View>
    )
  }

  return (
    <ScrollView
      className="bg-background flex-1"
      contentContainerClassName="pb-safe-offset-5 p-4"
      showsVerticalScrollIndicator={false}
    >
      <TransactionHero transaction={transaction} userId={userId} />
      <TransactionDetailsCard transaction={transaction} />
      <ReceiptsCard receipts={receipts} />
      <VoiceMemosCard voiceMemos={voiceMemos} />
    </ScrollView>
  )
}
