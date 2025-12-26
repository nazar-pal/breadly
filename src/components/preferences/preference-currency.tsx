import { Icon } from '@/components/ui/lucide-icon-by-name'
import { Text } from '@/components/ui/text'
import { getUserPreferences } from '@/data/client/queries'
import { DEFAULT_CURRENCY } from '@/lib/constants'
import { useDrizzleQuery } from '@/lib/hooks'
import { getCurrencyInfo } from '@/lib/utils/'
import { useUserSession } from '@/system/session-and-migration'
import { router } from 'expo-router'
import React from 'react'
import { Pressable, View } from 'react-native'

export function CurrencyPreference() {
  const { userId } = useUserSession()
  const {
    data: [userPreferences]
  } = useDrizzleQuery(getUserPreferences({ userId }))

  // Get current currency with fallback to default
  const currentCurrency = userPreferences?.defaultCurrency || DEFAULT_CURRENCY
  const currencyInfo = getCurrencyInfo(currentCurrency.code)

  return (
    <Pressable
      className="flex-row items-center py-3 active:opacity-70"
      onPress={() => router.push('/default-currency-select')}
    >
      <View className="bg-muted mr-3 h-10 w-10 items-center justify-center rounded-full">
        <Icon name="DollarSign" size={18} className="text-primary" />
      </View>
      <View className="flex-1">
        <Text className="font-medium">Default Currency</Text>
        <Text className="text-muted-foreground text-sm">
          {currencyInfo?.currency} ({currencyInfo?.symbol})
        </Text>
      </View>
      <Icon name="ChevronRight" size={18} className="text-muted-foreground" />
    </Pressable>
  )
}
