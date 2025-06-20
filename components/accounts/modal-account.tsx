import { useAccountModalStore } from '@/components/accounts/lib/account-modal-store'
import React from 'react'
import UnifiedAccountModal from './UnifiedAccountModal'

export function AccountModal() {
  const { visible, account, accountType, close } = useAccountModalStore()

  return (
    <UnifiedAccountModal
      visible={visible}
      account={account}
      accountType={accountType}
      onClose={close}
    />
  )
}
