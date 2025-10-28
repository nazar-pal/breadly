import { Text } from '@/components/ui/text'
import { AccountDetails } from '@/data/client/queries/use-get-account'
import { formatCurrency } from '@/lib/utils'
import { useUserSession } from '@/system/session-and-migration'
import { startOfMonth } from 'date-fns'
import React from 'react'
import { View } from 'react-native'
import { useGetAccountTransactions } from '../hooks/use-get-account-transactions'

export function AccountInsights({ account }: { account: AccountDetails }) {
  const { userId } = useUserSession()
  const currencyCode = account.currency?.code ?? account.currencyId ?? 'USD'

  const dateFrom = startOfMonth(new Date())

  const { data: transactions = [], isLoading } = useGetAccountTransactions({
    userId,
    accountId: account.id,
    dateFrom
  })

  let inflow = 0
  let outflow = 0
  for (const tx of transactions) {
    if (tx.type === 'income' && tx.accountId === account.id) {
      inflow += tx.amount || 0
    } else if (tx.type === 'expense' && tx.accountId === account.id) {
      outflow += tx.amount || 0
    } else if (tx.type === 'transfer') {
      if (tx.accountId === account.id) outflow += tx.amount || 0
      else if (tx.counterAccountId === account.id) inflow += tx.amount || 0
    }
  }
  const net = inflow - outflow
  const count = transactions.length

  if (isLoading) return null

  return (
    <View>
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="text-base font-medium text-foreground">
          This month
        </Text>
        <Text className="text-xs text-muted-foreground">
          {count} transactions
        </Text>
      </View>

      <View className="flex-row items-stretch gap-3">
        <InsightTile
          label="Inflow"
          value={formatCurrency(inflow, currencyCode)}
          tone="positive"
        />
        <InsightTile
          label="Outflow"
          value={formatCurrency(outflow, currencyCode)}
          tone="negative"
        />
        <InsightTile
          label="Net"
          value={formatCurrency(net, currencyCode)}
          tone={net >= 0 ? 'positive' : 'negative'}
        />
      </View>
    </View>
  )
}

function InsightTile({
  label,
  value,
  tone
}: {
  label: string
  value: string
  tone: 'positive' | 'negative'
}) {
  const bgClass = tone === 'positive' ? 'bg-emerald-500/10' : 'bg-rose-500/10'
  const textClass = tone === 'positive' ? 'text-emerald-600' : 'text-rose-600'

  return (
    <View className={`flex-1 rounded-2xl ${bgClass} px-3 py-3`}>
      <Text className="text-xs text-muted-foreground">{label}</Text>
      <Text className={`mt-1 text-lg font-semibold ${textClass}`}>{value}</Text>
    </View>
  )
}
