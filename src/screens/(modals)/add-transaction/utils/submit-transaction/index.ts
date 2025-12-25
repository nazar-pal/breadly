import { lastParamsStore } from '@/lib/storage/last-transaction-params-store'
import { asyncTryCatch } from '@/lib/utils/index'
import { transactionParamsStore } from '../../store'
import { determineSubmitWorkflow } from './determine-submit-workflow'
import { submitExpenseIncomeAccount } from './submit-expense-income-account'
import { submitExpenseIncomeCurrency } from './submit-expense-income-currency'
import { submitTransfer } from './submit-transfer'
import {
  CalculatorInputs,
  Submitters,
  SubmitWorkflow,
  WorkflowMap
} from './types'

export { determineSubmitWorkflow }

// Submitters map delegates to the dedicated functions above
const submitters: Submitters = {
  transfer: submitTransfer,
  'expense-income:currency': submitExpenseIncomeCurrency,
  'expense-income:account': submitExpenseIncomeAccount
}

export async function submitTransaction(
  userId: string,
  calculatorInputs: CalculatorInputs
): Promise<[Error | null, void | null]> {
  if (calculatorInputs.amount <= 0) return [new Error('Invalid amount'), null]

  const params = transactionParamsStore.getState().state

  const workflow = determineSubmitWorkflow(params)
  if (!workflow) return [new Error('Invalid transaction parameters'), null]

  memorizeLastParams(workflow)

  // Generic dispatcher keyed by workflow kind
  function dispatch<K extends keyof WorkflowMap>(
    kind: K,
    args: WorkflowMap[K]
  ): Promise<void> {
    return submitters[kind](userId, args, calculatorInputs)
  }

  return await asyncTryCatch(dispatch(workflow.kind, workflow.args))
}

function memorizeLastParams(workflow: SubmitWorkflow) {
  if (workflow.kind === 'transfer') return
  const setLastParams = lastParamsStore.getState().setLastParams

  if (workflow.kind === 'expense-income:account') {
    const { accountId: id, type } = workflow.args
    setLastParams(type, { id, from: 'account' })
  } else if (workflow.kind === 'expense-income:currency') {
    const { currencyCode: id, type } = workflow.args
    setLastParams(type, { id, from: 'currency' })
  }
}
