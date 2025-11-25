import { createTransaction } from '@/data/client/mutations'
import { getCurrency } from '@/data/client/queries'
import { CalculatorInputs, WorkflowMap } from './types'

export async function submitExpenseIncomeCurrency(
  userId: string,
  args: WorkflowMap['expense-income:currency'],
  inputs: CalculatorInputs
): Promise<void> {
  const currencies = await getCurrency({ currencyCode: args.currencyCode })
  const currency = currencies.length > 0 ? currencies[0] : null
  if (!currency) throw new Error('Currency not found')

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
