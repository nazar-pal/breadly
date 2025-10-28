import React from 'react'
import { useTransactionParamsActions } from '../../../store'
import type { TransactionParams } from '../../../types'
import { CategoriesList } from '../lists/categories-list'

export function ExpenseIncomeCategory({
  params,
  closeModal
}: {
  params: Extract<TransactionParams, { type: 'expense' | 'income' }>
  closeModal: () => void
}) {
  const { setExpenseIncomeParams } = useTransactionParamsActions()

  const { type, accountId, currencyCode } = params

  const handleSelectCategory = (categoryId: string) => {
    if (accountId !== undefined)
      setExpenseIncomeParams({
        type,
        categoryId,
        accountId
      })
    else
      setExpenseIncomeParams({
        type,
        categoryId,
        currencyCode
      })

    closeModal()
  }
  return <CategoriesList listType={type} onSelect={handleSelectCategory} />
}
