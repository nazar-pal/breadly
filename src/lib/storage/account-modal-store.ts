import { AccountType } from '@/data/client/db-schema'
import { GetAccountResultItem } from '@/data/client/queries/get-account'
import { GetAccountsResultItem } from '@/data/client/queries/get-accounts'
import { router } from 'expo-router'
import { create } from 'zustand'
import { useShallow } from 'zustand/shallow'

type Account = GetAccountsResultItem | GetAccountResultItem

type AccountModalState = {
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
  account: null,
  accountType: 'payment'
}

const accountModalStore = create<AccountModalStore>(set => ({
  ...INITIAL_STATE,

  actions: {
    openAccountModalForCreate: accountType => {
      router.push({
        pathname: '/account-form',
        params: { title: 'Create Account' }
      })
      set({
        account: null,
        accountType
      })
    },

    openAccountModalForEdit: account => {
      router.push({
        pathname: '/account-form',
        params: { title: 'Edit Account' }
      })
      set({
        account,
        accountType: account.type
      })
    },

    closeAccountModal: () => {
      router.back()
      set(INITIAL_STATE)
    }
  }
}))

export const useAccountModalState = () => {
  return accountModalStore(
    useShallow(state => ({
      account: state.account,
      accountType: state.accountType
    }))
  )
}

export const useAccountModalActions = () =>
  accountModalStore(state => state.actions)
