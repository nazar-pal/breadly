import { Icon } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import { type CurrencySelectSQLite } from '@/data/client/db-schema'
import { cn } from '@/lib/utils'
import React from 'react'
import { Pressable, PressableProps, View } from 'react-native'

interface Props extends PressableProps {
  currency: CurrencySelectSQLite
  isSelected: boolean
}

// Extracted CurrencyItem for better separation of concerns
export function CurrenciesListItem({
  currency,
  isSelected,
  className,
  ...rest
}: Props) {
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
          <View className="min-w-[44px] items-center rounded-lg bg-muted p-2">
            <Text className="text-lg font-bold text-popover-foreground">
              {currency.symbol}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold text-popover-foreground">
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
