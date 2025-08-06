import { Icon } from '@/components/icon'
import { Text } from '@/components/ui/text'
import { type CurrencySelectSQLite } from '@/data/client/db-schema'
import { createOrUpdateUserPreferences } from '@/data/client/mutations'
import { cn } from '@/lib/utils'
import { useUserSession } from '@/modules/session-and-migration'
import React from 'react'
import { Pressable, View } from 'react-native'

// Extracted CurrencyItem for better separation of concerns
export function CurrencyItem({
  currency,
  isSelected,
  closeModal
}: {
  currency: CurrencySelectSQLite
  isSelected: boolean
  closeModal: () => void
}) {
  const { userId } = useUserSession()

  const handleCurrencySelect = async (currency: CurrencySelectSQLite) => {
    try {
      await createOrUpdateUserPreferences({
        userId,
        data: {
          defaultCurrency: currency.code
        }
      })
      closeModal()
    } catch (error) {
      console.error('Failed to update currency preference:', error)
    }
  }

  return (
    <Pressable
      className={cn(
        'mb-2 flex-row items-center justify-between rounded-xl border p-4 transition-colors',
        isSelected
          ? 'border-primary bg-primary/10'
          : 'border-border bg-card active:bg-muted'
      )}
      onPress={() => handleCurrencySelect(currency)}
    >
      <View className="flex-1">
        <View className="flex-row items-center gap-3">
          <View className="min-w-[44px] items-center rounded-lg bg-muted p-2">
            <Text className="text-lg font-bold text-foreground">
              {currency.symbol}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold text-foreground">
              {currency.name}
            </Text>
            <Text className="text-sm text-muted-foreground">
              {currency.code}
            </Text>
          </View>
        </View>
      </View>

      {isSelected && (
        <View className="ml-3">
          <Icon name="Check" size={20} className="text-primary" />
        </View>
      )}
    </Pressable>
  )
}
