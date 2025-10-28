import type { TransactionParams } from '../../types'
import { SubmitWorkflow } from './types'

export function determineSubmitWorkflow(
  params: TransactionParams
): SubmitWorkflow | null {
  if (params.type === 'transfer') {
    const { fromAccountId, toAccountId } = params
    if (fromAccountId && toAccountId && fromAccountId !== toAccountId) {
      return { kind: 'transfer', args: { fromAccountId, toAccountId } }
    }
    return null
  }

  // expense | income
  if (!params.categoryId) return null
  const common = { type: params.type, categoryId: params.categoryId }

  if (params.accountId) {
    return {
      kind: 'expense-income:account',
      args: { ...common, accountId: params.accountId }
    }
  }
  if (params.currencyCode) {
    return {
      kind: 'expense-income:currency',
      args: { ...common, currencyCode: params.currencyCode }
    }
  }
  return null
}
