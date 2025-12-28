import { createTransaction } from '@/data/client/mutations'
import { getAccount } from '@/data/client/queries'
import { toSmallestUnit } from '@/lib/utils/currency-info'
import { startOfToday } from 'date-fns'
import { CalculatorInputs, WorkflowMap } from './types'

export async function submitExpenseIncomeAccount(
  userId: string,
  args: WorkflowMap['expense-income:account'],
  inputs: CalculatorInputs
): Promise<void> {
  const account = await getAccount({ userId, accountId: args.accountId })
  if (!account) throw new Error('Account not found')

  const [err] = await createTransaction({
    userId,
    data: {
      accountId: account.id,
      type: args.type,
      categoryId: args.categoryId,
      currencyId: account.currencyId,
      amount: toSmallestUnit(inputs.amount, account.currencyId),
      txDate: inputs.txDate ?? startOfToday(),
      notes: inputs.comment || undefined
    }
  })
  if (err) throw err
}
