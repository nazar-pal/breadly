import { router } from 'expo-router'
import React from 'react'
import { AccountDetails } from '../../data'
import { AccountHero } from './account-hero'
import { AccountInsights } from './account-insights'
import { AccountProgress } from './account-progress'
import { AccountTransactions } from './account-transactions'

export function AccountDetailsScreen({ account }: { account: AccountDetails }) {
  const handleOpenTransfer = () => {
    const params = new URLSearchParams({
      type: 'transfer',
      fromAccountId: account.id
    })
    router.push(`/transaction-modal?${params}`)
  }

  return (
    <>
      <AccountHero account={account} onTransfer={handleOpenTransfer} />

      <AccountProgress account={account} />

      <AccountInsights account={account} />

      <AccountTransactions accountId={account.id} />

      {/** Transfer now handled by /transaction-modal */}
    </>
  )
}
