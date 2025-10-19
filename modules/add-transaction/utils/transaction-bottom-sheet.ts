import { router } from 'expo-router'
import { transactionParamsStore } from '../store'
import type { SetExpenseIncomeParams, SetTransferParams } from '../types'

function openTransactionBottomSheetWithParams(
  params: SetTransferParams | SetExpenseIncomeParams
) {
  const setParams = transactionParamsStore.getState().actions
  if (params.type === 'transfer') setParams.setTransferParams(params)
  else setParams.setExpenseIncomeParams(params)
  router.push('/transaction-modal')
}

export const openTransferBottomSheet = (params: SetTransferParams) =>
  openTransactionBottomSheetWithParams(params)

export const openExpenseIncomeBottomSheet = (params: SetExpenseIncomeParams) =>
  openTransactionBottomSheetWithParams(params)

export const closeTransactionBottomSheet = () => {
  router.back()
  // transactionParamsStore.getState().actions.clearParams()
}
