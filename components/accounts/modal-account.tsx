import { Account } from '@/hooks/useAccounts'
import React from 'react'
import PaymentAccountModal from './moda-account-payment'
import DebtAccountModal from './modal-account-dept'
import SavingAccountModal from './modal-account-saving'

interface AccountModalProps {
  visible: boolean
  account: Account | null
  accountType: 'saving' | 'payment' | 'debt'
  onClose: () => void
}

export default function AccountModal({
  visible,
  account,
  accountType,
  onClose
}: AccountModalProps) {
  const currentType = account?.type || accountType

  switch (currentType) {
    case 'saving':
      return (
        <SavingAccountModal
          visible={visible}
          account={account}
          onClose={onClose}
        />
      )
    case 'debt':
      return (
        <DebtAccountModal
          visible={visible}
          account={account}
          onClose={onClose}
        />
      )
    case 'payment':
    default:
      return (
        <PaymentAccountModal
          visible={visible}
          account={account}
          onClose={onClose}
        />
      )
  }
}
