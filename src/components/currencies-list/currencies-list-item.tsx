import { Icon } from '@/components/ui/lucide-icon-by-name'
import { Text } from '@/components/ui/text'
import { type CurrencySelectSQLite } from '@/data/client/db-schema'
import { cn, getCurrencyInfo } from '@/lib/utils'
import React from 'react'
import { Pressable, PressableProps, View } from 'react-native'

interface Props extends PressableProps {
  currency: CurrencySelectSQLite
  isSelected: boolean
}

export function CurrenciesListItem({
  currency,
  isSelected,
  className,
  ...rest
}: Props) {
  const currencyInfo = getCurrencyInfo(currency.code)

  return (
    <Pressable
      className={cn(
        'mb-2 flex-row items-center justify-between rounded-xl border p-4 transition-colors',
        isSelected
          ? 'border-primary bg-primary/10'
          : 'border-border/20 bg-popover active:bg-muted',
        className
      )}
      {...rest}
    >
      <View className="flex-1">
        <View className="flex-row items-center gap-3">
          <View className="bg-muted min-w-[44px] items-center rounded-lg p-2">
            <Text className="text-popover-foreground text-lg font-bold">
              {currencyInfo?.symbol}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-popover-foreground text-base font-semibold">
              {currencyInfo?.currency}
            </Text>
            <Text className="text-muted-foreground text-sm">
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
