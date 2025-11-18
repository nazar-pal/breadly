import { CurrenciesList } from '@/components/currencies-list'
import { CurrencySelectSQLite } from '@/data/client/db-schema'
import { createOrUpdateUserPreferences } from '@/data/client/mutations'
import { getUserPreferences } from '@/data/client/queries'
import { DEFAULT_CURRENCY } from '@/lib/constants'
import { useDrizzleQuery } from '@/lib/hooks'
import { useUserSession } from '@/system/session-and-migration'
import { router } from 'expo-router'
import React from 'react'
import { ScrollView } from 'react-native'

export default function DefaultCurrencySelect() {
  const { userId } = useUserSession()
  const { data: userPreferences } = useDrizzleQuery(
    getUserPreferences({ userId })
  )

  // Get current currency with fallback to default
  const currentCurrency =
    userPreferences?.[0]?.defaultCurrency || DEFAULT_CURRENCY

  const handleCurrencySelect = async (currency: CurrencySelectSQLite) => {
    try {
      await createOrUpdateUserPreferences({
        userId,
        data: {
          defaultCurrency: currency.code
        }
      })
      router.back()
    } catch (error) {
      console.error('Failed to update currency preference:', error)
    }
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      className="p-4"
      contentContainerClassName="pb-12"
    >
      <CurrenciesList
        onSelect={handleCurrencySelect}
        selectedCurrency={currentCurrency}
      />
    </ScrollView>
  )
}
