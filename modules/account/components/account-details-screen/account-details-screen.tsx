import React from 'react'
import { AccountDetails } from '../../data'
import { AccountAddMoneyModal } from './account-add-money-modal'
import { AccountHero } from './account-hero'
import { AccountInsights } from './account-insights'
import { AccountProgress } from './account-progress'
import { AccountTransactions } from './account-transactions'
import { AccountTransferModal } from './account-transfer-modal'

export function AccountDetailsScreen({ account }: { account: AccountDetails }) {
  const [addVisible, setAddVisible] = React.useState(false)
  const [transferVisible, setTransferVisible] = React.useState(false)

  return (
    <>
      <AccountHero
        account={account}
        onAddMoney={() => setAddVisible(true)}
        onTransfer={() => setTransferVisible(true)}
      />

      <AccountProgress account={account} />

      <AccountInsights account={account} />

      <AccountTransactions accountId={account.id} />

      <AccountAddMoneyModal
        account={account}
        visible={addVisible}
        onClose={() => setAddVisible(false)}
      />
      <AccountTransferModal
        account={account}
        visible={transferVisible}
        onClose={() => setTransferVisible(false)}
      />
    </>
  )
}
