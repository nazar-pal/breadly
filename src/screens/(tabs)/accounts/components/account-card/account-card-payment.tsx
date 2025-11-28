import { Icon } from '@/components/ui/icon-by-name'
import { GetAccountsResultItem } from '@/data/client/queries/get-accounts'
import React from 'react'
import { Pressable } from 'react-native'
import { AccountCardShell } from './account-card-shell'

type Props = React.ComponentProps<typeof Pressable> & {
  account: GetAccountsResultItem
}

export function AccountCardPayment({ account, ...rest }: Props) {
  const balanceAmount = account.balance || 0

  return (
    <AccountCardShell
      account={account}
      iconName="DollarSign"
      theme={{
        container: 'border-account-payment',
        iconWrapper: 'bg-account-payment/10',
        icon: 'text-account-payment',
        balanceText:
          balanceAmount >= 0 ? 'text-foreground' : 'text-account-debt'
      }}
      rightAccessory={
        balanceAmount < 0 ? (
          <Icon
            name="TrendingDown"
            size={12}
            className="text-account-debt mr-0.5"
          />
        ) : null
      }
      {...rest}
    />
  )
}
