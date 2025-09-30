import { Text } from '@/components/ui/text'
import { useUserSession } from '@/system/session-and-migration'
import React from 'react'
import { View } from 'react-native'
import { useGetAccountTransactions } from '../../../data'
import { TransactionItem } from './transaction-item'

export function AccountTransactions({ accountId }: { accountId: string }) {
  const { userId } = useUserSession()

  const { data: transactions, isLoading } = useGetAccountTransactions({
    userId,
    accountId,
    limit: 15
  })

  return (
    <View className="mt-8">
      <Text className="text-xl font-semibold text-foreground">
        Recent Transactions
      </Text>

      <View className="p-1">
        {transactions.map(tx => (
          <TransactionItem key={tx.id} transaction={tx} />
        ))}
        {transactions.length === 0 && !isLoading && (
          <Text className="text-center text-sm text-muted-foreground">
            No recent activity for this account
          </Text>
        )}
      </View>
    </View>
  )
}
