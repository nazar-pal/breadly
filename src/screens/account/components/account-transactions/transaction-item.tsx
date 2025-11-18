import { GetAccountTransactionsItem } from '@/data/client/queries'
import React from 'react'
import { View } from 'react-native'
import { TransactionAmount } from './transaction-amount'
import { TransactionIconBadge } from './transaction-icon-badge'
import { TransactionMeta } from './transaction-meta'

export function TransactionItem({
  transaction
}: {
  transaction: GetAccountTransactionsItem
}) {
  return (
    <View className="flex-row items-start gap-3 py-3">
      <TransactionIconBadge txType={transaction.type} />
      <TransactionMeta transaction={transaction} />
      <TransactionAmount
        amount={transaction.amount}
        currencyId={transaction.currencyId}
        date={transaction.txDate}
      />
    </View>
  )
}
