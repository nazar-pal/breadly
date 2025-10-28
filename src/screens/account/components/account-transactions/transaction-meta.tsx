import { Badge } from '@/components/ui/badge'
import { Text } from '@/components/ui/text'
import React from 'react'
import { View } from 'react-native'
import { AccountTransactionsItem } from '../../hooks/use-get-account-transactions'

export function TransactionMeta({
  transaction
}: {
  transaction: AccountTransactionsItem
}) {
  const parentCategoryName = transaction.category?.parent?.name
  const categoryName = transaction.category?.name

  const hasNotes = !!transaction.notes && transaction.notes.trim().length > 0

  return (
    <View className="min-w-0 flex-1">
      <View className="flex-row flex-wrap items-center gap-2">
        {parentCategoryName ? (
          <>
            <Badge variant="secondary" className="max-w-[52%] px-2 py-0.5">
              <Text numberOfLines={1}>{parentCategoryName}</Text>
            </Badge>
            <Badge variant="outline" className="max-w-[38%] px-2 py-0.5">
              <Text numberOfLines={1}>{categoryName}</Text>
            </Badge>
          </>
        ) : (
          <Badge variant="secondary" className="max-w-[70%] px-2 py-0.5">
            <Text numberOfLines={1}>{categoryName ?? 'Uncategorized'}</Text>
          </Badge>
        )}
      </View>

      {hasNotes ? (
        <Text
          className="mt-1 pr-4 text-xs text-muted-foreground"
          numberOfLines={1}
        >
          {transaction.notes}
        </Text>
      ) : null}
    </View>
  )
}
