import React from 'react'
import { View } from 'react-native'
import { AccountTransactionsItem } from '../../../data'
import { TransactionAmount } from './transaction-amount'
import { TransactionIconBadge } from './transaction-icon-badge'
import { TransactionMeta } from './transaction-meta'

export function TransactionItem({
  transaction
}: {
  transaction: AccountTransactionsItem
}) {
  return (
    <View className="flex-row items-start gap-3 py-3">
      <TransactionIconBadge txType={transaction.type} />
      <TransactionMeta transaction={transaction} />
      <TransactionAmount
        amount={transaction.amount}
        date={transaction.txDate}
      />
    </View>
  )
}
