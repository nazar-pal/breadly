import { useState } from 'react'
import { Account } from './useAccounts'

export function useAccountsUI() {
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const [selectedAccountType, setSelectedAccountType] = useState<
    'saving' | 'payment' | 'debt'
  >('payment')

  const handleEditAccount = (account: Account) => {
    setSelectedAccount(account)
    setEditModalVisible(true)
  }

  const handleAddAccount = (type: 'saving' | 'payment' | 'debt') => {
    setSelectedAccountType(type)
    setSelectedAccount(null) // null indicates this is a new account
    setEditModalVisible(true)
  }

  const handleCloseModal = () => {
    setEditModalVisible(false)
    setSelectedAccount(null)
  }

  return {
    editModalVisible,
    selectedAccount,
    selectedAccountType,
    handleEditAccount,
    handleAddAccount,
    handleCloseModal
  }
}
