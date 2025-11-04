import { Icon } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import { type CurrencySelectSQLite } from '@/data/client/db-schema'
import { useGetCurrencies } from '@/data/client/queries'
import { cn } from '@/lib/utils'
import React from 'react'
import { View } from 'react-native'
import { CurrenciesListItem } from './currencies-list-item'

interface Props {
  onSelect: (currency: CurrencySelectSQLite) => void
  selectedCurrency?: CurrencySelectSQLite | string
  className?: string
  itemClassName?: string
}

export function CurrenciesList({
  onSelect,
  selectedCurrency,
  className,
  itemClassName
}: Props) {
  const { data: currencies = [], isLoading, error } = useGetCurrencies()

  if (isLoading) {
    return (
      <View className="items-center justify-center py-12">
        <Icon
          name="RefreshCw"
          size={32}
          className="mb-3 animate-spin text-primary"
        />
        <Text className="text-center text-base text-muted-foreground">
          Loading currencies...
        </Text>
      </View>
    )
  }

  if (error) {
    return (
      <View className="items-center justify-center py-12">
        <View className="mb-4 rounded-full bg-muted p-4">
          <Icon name="AlertCircle" size={24} className="text-destructive" />
        </View>
        <Text className="mb-1 text-center text-base font-medium text-foreground">
          Failed to load currencies
        </Text>
        <Text className="text-center text-sm text-muted-foreground">
          Please try again later
        </Text>
      </View>
    )
  }

  if (!currencies.length) {
    return (
      <View className="items-center justify-center py-12">
        <View className="mb-4 rounded-full bg-muted p-4">
          <Text className="text-2xl">💱</Text>
        </View>
        <Text className="mb-1 text-center text-base font-medium text-foreground">
          No currencies available
        </Text>
        <Text className="text-center text-sm text-muted-foreground">
          No currencies found in the database
        </Text>
      </View>
    )
  }

  // Normalize selectedCurrency to a code string
  const currentCurrencyCode =
    typeof selectedCurrency === 'string'
      ? selectedCurrency
      : selectedCurrency?.code

  return (
    <View className={cn('gap-1', className)}>
      {currencies.map(currency => (
        <CurrenciesListItem
          key={currency.code}
          className={itemClassName}
          currency={currency}
          isSelected={currency.code === currentCurrencyCode}
          onPress={() => onSelect(currency)}
        />
      ))}
    </View>
  )
}
