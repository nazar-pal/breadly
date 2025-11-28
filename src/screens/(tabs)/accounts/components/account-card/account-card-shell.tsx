import { Icon, type IconName } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import { GetAccountsResultItem } from '@/data/client/queries/get-accounts'
import { cn, formatCurrency } from '@/lib/utils'
import React from 'react'
import { Pressable, View } from 'react-native'

type AccountCardTheme = {
  container: string
  iconWrapper: string
  icon: string
  balanceText: string
}

type Props = React.ComponentProps<typeof Pressable> & {
  account: GetAccountsResultItem
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
        'bg-card active:bg-muted/30 mb-3 w-full rounded-xl border-l-[4px] p-3 shadow-sm shadow-slate-500/40',
        theme.container,
        account.isArchived ? 'border-border bg-muted/20' : ''
      )}
      {...rest}
    >
      <View className="mb-2 flex-row items-start">
        <View
          className={cn(
            'mr-3 h-7 w-7 items-center justify-center rounded-md',
            theme.iconWrapper,
            account.isArchived ? 'bg-border/50' : ''
          )}
        >
          <Icon
            name={iconName}
            size={16}
            className={cn(
              theme.icon,
              account.isArchived ? 'text-muted-foreground' : ''
            )}
          />
        </View>
        <View className="min-w-0 flex-1">
          <Text
            className={cn(
              'text-foreground mb-px text-base font-semibold',
              account.isArchived ? 'text-muted-foreground' : ''
            )}
            numberOfLines={1}
          >
            {account.name}
          </Text>
          <View className="flex-row items-center gap-2">
            <Text className="text-muted-foreground text-xs capitalize">
              {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
            </Text>
            <View className="bg-secondary rounded-full px-2 py-0.5">
              <Text className="text-muted-foreground text-[10px] font-medium">
                {account.currencyId || 'USD'}
              </Text>
            </View>
            {account.isArchived ? (
              <View className="bg-border rounded-full px-2 py-0.5">
                <Text className="text-muted-foreground text-[10px] font-medium">
                  Archived
                </Text>
              </View>
            ) : null}
          </View>
        </View>
        <View className="flex-row items-center">
          {rightAccessory}
          <Text
            className={cn(
              'text-base font-bold',
              theme.balanceText,
              account.isArchived ? 'text-muted-foreground' : ''
            )}
          >
            {formatBalance(balanceAmount)}
          </Text>
        </View>
      </View>

      {account.description ? (
        <View className="mb-2">
          <Text className="text-muted-foreground text-sm" numberOfLines={2}>
            {account.description}
          </Text>
        </View>
      ) : null}
      {footerContent}
    </Pressable>
  )
}
