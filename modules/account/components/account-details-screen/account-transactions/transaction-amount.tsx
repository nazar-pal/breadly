import { Text } from '@/components/ui/text'
import { cn, formatCurrency } from '@/lib/utils'
import React from 'react'
import { View } from 'react-native'

export function TransactionAmount({
  amount,
  date
}: {
  amount: number
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
        {formatCurrency(amount)}
      </Text>
      {txDateLabel ? (
        <Text className="mt-0.5 text-[11px] text-muted-foreground">
          {txDateLabel}
        </Text>
      ) : null}
    </View>
  )
}
