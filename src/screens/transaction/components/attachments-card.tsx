import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Icon } from '@/components/ui/lucide-icon-by-name'
import { Text } from '@/components/ui/text'
import React from 'react'
import { Image, View } from 'react-native'
import type { TransactionAttachment } from '../lib/types'
import { formatDuration } from '../lib/utils'

interface ReceiptsCardProps {
  receipts: TransactionAttachment[]
}

export function ReceiptsCard({ receipts }: ReceiptsCardProps) {
  if (receipts.length === 0) return null

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="flex-row items-center gap-2">
          <Icon name="Receipt" size={18} className="text-muted-foreground" />
          <Text className="text-lg font-semibold">Receipts</Text>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <View className="flex-row flex-wrap gap-3">
          {receipts.map(receipt => (
            <ReceiptItem key={receipt.id} receipt={receipt} />
          ))}
        </View>
      </CardContent>
    </Card>
  )
}

function ReceiptItem({ receipt }: { receipt: TransactionAttachment }) {
  return (
    <View className="bg-secondary/50 w-[48%] overflow-hidden rounded-xl">
      <Image
        source={{ uri: receipt.bucketPath || undefined }}
        className="h-36 w-full"
        resizeMode="cover"
      />
      <View className="px-3 py-2">
        <Text numberOfLines={1} className="text-muted-foreground text-xs">
          {receipt.fileName}
        </Text>
      </View>
    </View>
  )
}

interface VoiceMemosCardProps {
  voiceMemos: TransactionAttachment[]
}

export function VoiceMemosCard({ voiceMemos }: VoiceMemosCardProps) {
  if (voiceMemos.length === 0) return null

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="flex-row items-center gap-2">
          <Icon name="Mic" size={18} className="text-muted-foreground" />
          <Text className="text-lg font-semibold">Voice Memos</Text>
        </CardTitle>
      </CardHeader>
      <CardContent className="gap-2">
        {voiceMemos.map(memo => (
          <VoiceMemoItem key={memo.id} memo={memo} />
        ))}
      </CardContent>
    </Card>
  )
}

function VoiceMemoItem({ memo }: { memo: TransactionAttachment }) {
  return (
    <View className="bg-secondary/40 flex-row items-center rounded-xl p-3">
      <View className="bg-primary/10 mr-3 h-10 w-10 items-center justify-center rounded-full">
        <Icon name="Play" size={18} className="text-primary" />
      </View>
      <View className="flex-1">
        <Text numberOfLines={1} className="text-foreground text-sm font-medium">
          {memo.fileName}
        </Text>
        <Text className="text-muted-foreground mt-0.5 text-xs">
          {formatDuration(memo.duration)}
        </Text>
      </View>
    </View>
  )
}
