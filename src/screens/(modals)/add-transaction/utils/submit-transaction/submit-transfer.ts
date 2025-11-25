import { createTransaction } from '@/data/client/mutations'
import { getAccount } from '@/data/client/queries'
import { CalculatorInputs, WorkflowMap } from './types'

export async function submitTransfer(
  userId: string,
  args: WorkflowMap['transfer'],
  inputs: CalculatorInputs
): Promise<void> {
  const fromAccounts = await getAccount({
    userId,
    accountId: args.fromAccountId
  })
  const fromAccount = fromAccounts.length > 0 ? fromAccounts[0] : null
  if (!fromAccount) throw new Error('From account not found')

  const toAccounts = await getAccount({ userId, accountId: args.toAccountId })
  const toAccount = toAccounts.length > 0 ? toAccounts[0] : null
  if (!toAccount) throw new Error('To account not found')

  const [err] = await createTransaction({
    userId,
    data: {
      accountId: fromAccount.id,
      counterAccountId: toAccount.id,
      type: 'transfer',
      currencyId: fromAccount.currencyId,
      amount: inputs.amount,
      txDate: inputs.txDate ?? new Date(),
      notes: inputs.comment || undefined
    }
  })
  if (err) throw err
}
