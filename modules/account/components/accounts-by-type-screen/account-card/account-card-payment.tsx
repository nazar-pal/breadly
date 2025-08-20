import { Icon } from '@/components/icon'
import React from 'react'
import { Pressable } from 'react-native'
import { type AccountItem } from '../../../data'
import { AccountCardShell } from './account-card-shell'

type Props = React.ComponentProps<typeof Pressable> & {
  account: AccountItem
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
            className="mr-0.5 text-account-debt"
          />
        ) : null
      }
      {...rest}
    />
  )
}
