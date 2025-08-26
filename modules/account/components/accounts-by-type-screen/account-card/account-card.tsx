import React from 'react'
import { Pressable } from 'react-native'
import { type AccountItem } from '../../../data'
import { AccountCardDebt } from './account-card-debt'
import { AccountCardPayment } from './account-card-payment'
import { AccountCardSaving } from './account-card-saving'

type Props = React.ComponentProps<typeof Pressable> & {
  account: AccountItem
}

export function AccountCard(props: Props) {
  switch (props.account.type) {
    case 'payment':
      return <AccountCardPayment {...props} />
    case 'saving':
      return <AccountCardSaving {...props} />
    case 'debt':
      return <AccountCardDebt {...props} />
    default:
      return <AccountCardPayment {...props} />
  }
}
