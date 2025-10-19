import { accounts } from '@/data/client/db-schema'
import { db } from '@/system/powersync/system'
import { and, eq } from 'drizzle-orm'
import { createTransaction } from '../create-transaction'
import { CalculatorInputs, WorkflowMap } from './types'

export async function submitTransfer(
  userId: string,
  args: WorkflowMap['transfer'],
  inputs: CalculatorInputs
): Promise<void> {
  const fromAccount = await db.query.accounts.findFirst({
    where: and(eq(accounts.id, args.fromAccountId), eq(accounts.userId, userId))
  })
  if (!fromAccount) throw new Error('From account not found')

  const toAccount = await db.query.accounts.findFirst({
    where: and(eq(accounts.id, args.toAccountId), eq(accounts.userId, userId))
  })
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
