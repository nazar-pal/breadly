import { useState } from 'react'

export interface Account {
  id: string
  name: string
  description: string
  balance: number
  currency: string
  type: 'payment' | 'savings' | 'debt'
  targetAmount?: number
  initialAmount?: number
  dueDate?: string
  interestRate?: number
  institution?: string
  person?: string
  debtType?: 'owed' | 'owedTo'
}

export function useAccountManagement() {
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)

  const handleEditAccount = (account: Account) => {
    setSelectedAccount(account)
    setEditModalVisible(true)
  }

  const handleAddAccount = (type: 'payment' | 'savings' | 'debt') => {
    setSelectedAccount({ type } as Account)
    setEditModalVisible(true)
  }

  const handleSaveAccount = (account: Account) => {
    console.log('Save account:', account)
    // TODO: Implement actual save logic (API call, state update, etc.)
    setEditModalVisible(false)
    setSelectedAccount(null)
  }

  const handleCloseModal = () => {
    setEditModalVisible(false)
    setSelectedAccount(null)
  }

  return {
    editModalVisible,
    selectedAccount,
    handleEditAccount,
    handleAddAccount,
    handleSaveAccount,
    handleCloseModal
  }
}
