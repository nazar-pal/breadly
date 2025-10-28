import { create } from 'zustand'
import { useShallow } from 'zustand/shallow'
import type {
  SetExpenseIncomeParams,
  SetTransferParams,
  TransactionParams
} from './types'

type TransactionParamsActions = {
  setTransferParams: (params: SetTransferParams) => void
  setExpenseIncomeParams: (params: SetExpenseIncomeParams) => void
  clearParams: () => void
}

type TransactionParamsStore = {
  state: TransactionParams
  actions: TransactionParamsActions
}

const INITIAL_STATE: TransactionParams = {
  type: 'expense',
  categoryId: null,
  currencyCode: null,
  accountId: undefined,
  fromAccountId: undefined,
  toAccountId: undefined
}

export const transactionParamsStore = create<TransactionParamsStore>(set => ({
  state: INITIAL_STATE,

  actions: {
    setTransferParams: params => set({ state: params }),
    setExpenseIncomeParams: params => set({ state: params }),
    clearParams: () => set({ state: INITIAL_STATE })
  }
}))

export const useTransactionParamsState = () =>
  transactionParamsStore(useShallow(state => state.state))

export const useTransactionParamsActions = () =>
  transactionParamsStore(({ actions }) => actions)
