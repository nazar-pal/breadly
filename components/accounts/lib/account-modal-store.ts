import { AccountSelectSQLite } from '@/powersync/schema/table_6_accounts'
import { create } from 'zustand'

type AccountType = 'saving' | 'payment' | 'debt'

interface AccountModalState {
  visible: boolean
  account: AccountSelectSQLite | null
  accountType: AccountType
  isEditing: boolean
}

interface AccountModalActions {
  openForCreate: (accountType: AccountType) => void
  openForEdit: (account: AccountSelectSQLite) => void
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

  openForEdit: (account: AccountSelectSQLite) =>
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
