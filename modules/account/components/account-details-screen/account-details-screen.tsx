import React from 'react'
import { AccountDetails } from '../../data'
import { AccountBalance } from './account-balance'
import { AccountHeader } from './account-header'
import { AccountMetaInfo } from './account-meta-info'
import { AccountProgress } from './account-progress'
import { AccountTransactions } from './account-transactions'

export function AccountDetailsScreen({ account }: { account: AccountDetails }) {
  return (
    <>
      <AccountHeader account={account} />

      <AccountBalance account={account} />

      <AccountMetaInfo account={account} />

      <AccountProgress account={account} />

      <AccountTransactions accountId={account.id} />
    </>
  )
}
