import { Icon, type IconName } from '@/components/icon'
import { Text } from '@/components/ui/text'
import { cn, formatCurrency } from '@/lib/utils'
import React from 'react'
import { Pressable, View } from 'react-native'
import { type AccountItem } from '../../../data'

type AccountCardTheme = {
  container: string
  iconWrapper: string
  icon: string
  balanceText: string
}

type Props = React.ComponentProps<typeof Pressable> & {
  account: AccountItem
  iconName: IconName
  theme: AccountCardTheme
  rightAccessory?: React.ReactNode
  footerContent?: React.ReactNode
}

export function AccountCardShell({
  account,
  iconName,
  theme,
  rightAccessory,
  footerContent,
  ...rest
}: Props) {
  const balanceAmount = account.balance || 0

  const formatBalance = (amount: number) => {
    const currency = account.currencyId || 'USD'
    return formatCurrency(amount, currency)
  }

  return (
    <Pressable
      className={cn(
        'mb-3 w-full rounded-xl border-l-[4px] bg-card p-3 shadow-sm shadow-slate-500/40 active:bg-muted/30',
        theme.container
      )}
      {...rest}
    >
      <View className="mb-2 flex-row items-start">
        <View
          className={cn(
            'mr-3 h-7 w-7 items-center justify-center rounded-md',
            theme.iconWrapper
          )}
        >
          <Icon name={iconName} size={16} className={cn(theme.icon)} />
        </View>
        <View className="min-w-0 flex-1">
          <Text
            className="mb-px text-base font-semibold text-foreground"
            numberOfLines={1}
          >
            {account.name}
          </Text>
          <View className="flex-row items-center gap-2">
            <Text className="text-xs capitalize text-muted-foreground">
              {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
            </Text>
            <View className="rounded-full bg-secondary px-2 py-0.5">
              <Text className="text-[10px] font-medium text-muted-foreground">
                {account.currencyId || 'USD'}
              </Text>
            </View>
            {account.isArchived ? (
              <View className="rounded-full bg-border px-2 py-0.5">
                <Text className="text-[10px] font-medium text-muted-foreground">
                  Archived
                </Text>
              </View>
            ) : null}
          </View>
        </View>
        <View className="flex-row items-center">
          {rightAccessory}
          <Text className={cn('text-base font-bold', theme.balanceText)}>
            {formatBalance(balanceAmount)}
          </Text>
        </View>
      </View>

      {account.description ? (
        <View className="mb-2">
          <Text className="text-sm text-muted-foreground" numberOfLines={2}>
            {account.description}
          </Text>
        </View>
      ) : null}
      {footerContent}
    </Pressable>
  )
}
