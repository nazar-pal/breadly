import { Text } from '@/components/ui/text'
import { cn, formatCurrency } from '@/lib/utils'
import React from 'react'
import { View } from 'react-native'

export function TransactionAmount({
  amount,
  currencyId,
  date
}: {
  amount: number
  currencyId?: string
  date?: Date
}) {
  const isPositive = amount > 0
  const txDateLabel = date
    ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : undefined
  return (
    <View className="ml-auto items-end pl-3">
      <Text
        className={cn(
          'text-base font-semibold',
          isPositive ? 'text-success' : 'text-destructive'
        )}
      >
        {isPositive ? '+' : ''}
        {formatCurrency(amount, currencyId || 'USD')}
      </Text>
      {txDateLabel ? (
        <Text className="text-muted-foreground mt-0.5 text-[11px]">
          {txDateLabel}
        </Text>
      ) : null}
    </View>
  )
}
