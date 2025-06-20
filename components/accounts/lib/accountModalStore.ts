import { create } from 'zustand'
import { Account } from './useAccounts'

type AccountType = 'saving' | 'payment' | 'debt'

interface AccountModalState {
  visible: boolean
  account: Account | null
  accountType: AccountType
  isEditing: boolean
}

interface AccountModalActions {
  openForCreate: (accountType: AccountType) => void
  openForEdit: (account: Account) => void
  close: () => void
}

type AccountModalStore = AccountModalState & AccountModalActions

export const useAccountModalStore = create<AccountModalStore>(set => ({
  // Initial state
  visible: false,
  account: null,
  accountType: 'payment',
  isEditing: false,

  // Actions
  openForCreate: (accountType: AccountType) =>
    set({
      visible: true,
      account: null,
      accountType,
      isEditing: false
    }),

  openForEdit: (account: Account) =>
    set({
      visible: true,
      account,
      accountType: account.type,
      isEditing: true
    }),

  close: () =>
    set({
      visible: false,
      account: null,
      accountType: 'payment',
      isEditing: false
    })
}))
