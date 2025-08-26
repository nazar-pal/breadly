import { AccountType } from '@/data/client/db-schema'
import { create } from 'zustand'
import { useShallow } from 'zustand/shallow'
import { AccountDetails, AccountItem } from '../data'

type Account = AccountItem | AccountDetails

type AccountModalState = {
  isAccountModalVisible: boolean
  account: Account | null
  accountType: Account['type']
}

type AccountModalActions = {
  openAccountModalForCreate: (accountType: AccountType) => void
  openAccountModalForEdit: (account: Account) => void
  closeAccountModal: () => void
}

type AccountModalStore = AccountModalState & {
  actions: AccountModalActions
}

const INITIAL_STATE: AccountModalState = {
  isAccountModalVisible: false,
  account: null,
  accountType: 'payment'
}

const accountModalStore = create<AccountModalStore>(set => ({
  ...INITIAL_STATE,

  actions: {
    openAccountModalForCreate: accountType =>
      set({
        isAccountModalVisible: true,
        account: null,
        accountType
      }),

    openAccountModalForEdit: account =>
      set({
        isAccountModalVisible: true,
        account,
        accountType: account.type
      }),

    closeAccountModal: () => set(INITIAL_STATE)
  }
}))

export const useAccountModalState = () => {
  return accountModalStore(
    useShallow(state => ({
      isAccountModalVisible: state.isAccountModalVisible,
      account: state.account,
      accountType: state.accountType
    }))
  )
}

export const useAccountModalActions = () =>
  accountModalStore(state => state.actions)
