import { createTransaction } from '@/data/client/mutations'
import { getAccount } from '@/data/client/queries'
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
      amount: inputs.amount,
      txDate: inputs.txDate ?? new Date(),
      notes: inputs.comment || undefined
    }
  })
  if (err) throw err
}
