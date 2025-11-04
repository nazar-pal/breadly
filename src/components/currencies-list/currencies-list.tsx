import { Icon } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import { type CurrencySelectSQLite } from '@/data/client/db-schema'
import { useGetCurrencies } from '@/data/client/queries'
import React from 'react'
import { View } from 'react-native'
import { CurrenciesListItem } from './currencies-list-item'

interface Props {
  onSelect: (currency: CurrencySelectSQLite) => void
  currentCurrency: CurrencySelectSQLite
}

// Extracted CurrencyList component for better reusability
export function CurrenciesList({ onSelect, currentCurrency }: Props) {
  const { data: currencies = [], isLoading } = useGetCurrencies()

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
          Please check your connection and try again
        </Text>
      </View>
    )
  }

  return (
    <View className="gap-1">
      {currencies.map(currency => (
        <CurrenciesListItem
          key={currency.code}
          currency={currency}
          isSelected={currency.code === currentCurrency.code}
          onPress={() => onSelect(currency)}
        />
      ))}
    </View>
  )
}
