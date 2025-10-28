import { accounts } from '@/data/client/db-schema'
import { db } from '@/system/powersync/system'
import { and, eq } from 'drizzle-orm'
import { createTransaction } from '../create-transaction'
import { CalculatorInputs, WorkflowMap } from './types'

export async function submitExpenseIncomeAccount(
  userId: string,
  args: WorkflowMap['expense-income:account'],
  inputs: CalculatorInputs
): Promise<void> {
  const account = await db.query.accounts.findFirst({
    where: and(eq(accounts.id, args.accountId), eq(accounts.userId, userId))
  })
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
