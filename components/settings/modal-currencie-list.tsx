import { Text } from '@/components/ui/text'
import { DEFAULT_CURRENCY } from '@/lib/constants'
import { RefreshCw } from '@/lib/icons'
import {
  useGetCurrencies,
  useGetUserPreferences
} from '@/lib/powersync/data/queries'
import { useUserSession } from '@/lib/user-session'
import React from 'react'
import { View } from 'react-native'
import { CurrencyItem } from './modal-currency-item'

interface CurrencyListProps {
  closeModal: () => void
}

// Extracted CurrencyList component for better reusability
export function CurrencyList({ closeModal }: CurrencyListProps) {
  const { data: currencies = [], isLoading } = useGetCurrencies()
  const { userId } = useUserSession()
  const { data: userPreferences } = useGetUserPreferences({ userId })

  console.log('userPreferences', userPreferences)

  // Get current currency with fallback to default
  const currentCurrency =
    userPreferences?.[0]?.defaultCurrency || DEFAULT_CURRENCY

  if (isLoading) {
    return (
      <View className="items-center justify-center py-12">
        <RefreshCw size={32} className="mb-3 animate-spin text-primary" />
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
        <CurrencyItem
          key={currency.code}
          currency={currency}
          isSelected={currency.code === currentCurrency.code}
          closeModal={closeModal}
        />
      ))}
    </View>
  )
}
