import { Text } from '@/components/ui/text'
import { getAccountTransactions } from '@/data/client/queries'
import { useDrizzleQuery } from '@/lib/hooks'
import { useUserSession } from '@/system-v2/session'
import React from 'react'
import { View } from 'react-native'
import { TransactionItem } from './transaction-item'

export function AccountTransactions({ accountId }: { accountId: string }) {
  const { userId } = useUserSession()

  const { data: transactions, isLoading } = useDrizzleQuery(
    getAccountTransactions({
      userId,
      accountId,
      limit: 15
    })
  )

  return (
    <View className="mt-8">
      <Text className="text-foreground text-xl font-semibold">
        Recent Transactions
      </Text>

      <View className="p-1">
        {transactions.map(tx => (
          <TransactionItem key={tx.id} transaction={tx} />
        ))}
        {transactions.length === 0 && !isLoading && (
          <Text className="text-muted-foreground text-center text-sm">
            No recent activity for this account
          </Text>
        )}
      </View>
    </View>
  )
}
