import { createTransaction } from '@/data/client/mutations'
import { getAccount } from '@/data/client/queries'
import { CalculatorInputs, WorkflowMap } from './types'

export async function submitTransfer(
  userId: string,
  args: WorkflowMap['transfer'],
  inputs: CalculatorInputs
): Promise<void> {
  const fromAccount = await getAccount({
    userId,
    accountId: args.fromAccountId
  })
  if (!fromAccount) throw new Error('From account not found')

  const toAccount = await getAccount({ userId, accountId: args.toAccountId })
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
