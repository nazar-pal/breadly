import { Text } from '@/components/ui/text'
import { useSumTransactions } from '@/data/client/queries'
import { useCategoriesDateRangeState } from '@/lib/storage/categories-date-range-store'
import { formatCurrencyWithSign } from '@/lib/utils'
import { useUserSession } from '@/system/session-and-migration'
import { View } from 'react-native'

export function TabsCategoriesNetBalance() {
  const { userId } = useUserSession()

  // Use enhanced date range state from categories store
  const { dateRange } = useCategoriesDateRangeState()

  const totalExpensesResult = useSumTransactions({
    userId,
    type: 'expense',
    transactionsFrom: dateRange.start ?? undefined,
    transactionsTo: dateRange.end ?? undefined
  })
  const totalIncomeResult = useSumTransactions({
    userId,
    type: 'income',
    transactionsFrom: dateRange.start ?? undefined,
    transactionsTo: dateRange.end ?? undefined
  })

  const expenses = (totalExpensesResult.data ?? [])
    .map(row => ({
      currencyId: String(row.currencyId ?? ''),
      totalAmount: Number(row.totalAmount ?? 0)
    }))
    .filter(r => r.totalAmount > 0)

  const incomes = (totalIncomeResult.data ?? [])
    .map(row => ({
      currencyId: String(row.currencyId ?? ''),
      totalAmount: Number(row.totalAmount ?? 0)
    }))
    .filter(r => r.totalAmount > 0)

  const netMap = new Map<string, number>()
  for (const e of expenses) {
    netMap.set(e.currencyId, (netMap.get(e.currencyId) ?? 0) - e.totalAmount)
  }
  for (const i of incomes) {
    netMap.set(i.currencyId, (netMap.get(i.currencyId) ?? 0) + i.totalAmount)
  }

  const netByCurrency = Array.from(netMap.entries())
    .map(([currencyId, amount]) => ({ currencyId, amount }))
    .filter(item => item.amount !== 0)
    .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))

  const renderNetPieces = () => {
    if (netByCurrency.length === 0) return [<Text key="zero">0</Text>]
    return netByCurrency.flatMap((n, idx) => {
      const piece = (
        <Text
          key={`${n.currencyId}-${idx}`}
          className={n.amount < 0 ? 'text-destructive' : 'text-primary'}
        >
          {formatCurrencyWithSign(n.amount, n.currencyId)}
        </Text>
      )
      return idx === 0
        ? [piece]
        : [
            <Text key={`sep-${idx}`} className="text-foreground">
              {', '}
            </Text>,
            piece
          ]
    })
  }

  return (
    <View className="flex-1">
      <Text className="mb-0.5 text-xs text-muted-foreground">Net Balance</Text>
      <Text numberOfLines={1} className="text-2xl font-bold">
        {renderNetPieces()}
      </Text>
    </View>
  )
}
