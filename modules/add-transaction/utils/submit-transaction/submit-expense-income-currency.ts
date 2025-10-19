import { currencies } from '@/data/client/db-schema'
import { db } from '@/system/powersync/system'
import { eq } from 'drizzle-orm'
import { createTransaction } from '../create-transaction'
import { CalculatorInputs, WorkflowMap } from './types'

export async function submitExpenseIncomeCurrency(
  userId: string,
  args: WorkflowMap['expense-income:currency'],
  inputs: CalculatorInputs
): Promise<void> {
  const currency = await db.query.currencies.findFirst({
    where: eq(currencies.code, args.currencyCode)
  })
  if (!currency) throw new Error('No currency found for selected currency')
  const [err] = await createTransaction({
    userId,
    data: {
      accountId: null,
      type: args.type,
      categoryId: args.categoryId,
      currencyId: currency.id,
      amount: inputs.amount,
      txDate: inputs.txDate ?? new Date(),
      notes: inputs.comment || undefined
    }
  })
  if (err) throw err
}
