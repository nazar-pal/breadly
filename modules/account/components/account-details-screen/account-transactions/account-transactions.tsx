import { Text } from '@/components/ui/text'
import { useUserSession } from '@/modules/session-and-migration'
import React from 'react'
import { View } from 'react-native'
import { useGetAccountTransactions } from '../../../data'
import { TransactionItem } from './transaction-item'

export function AccountTransactions({ accountId }: { accountId: string }) {
  const { userId } = useUserSession()

  const { data: transactions, isLoading } = useGetAccountTransactions({
    userId,
    accountId
  })

  return (
    <View className="mt-8">
      <Text className="mb-2 text-xl font-semibold text-foreground">
        Recent Transactions
      </Text>

      <View className="rounded-xl bg-card/50 p-2">
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
