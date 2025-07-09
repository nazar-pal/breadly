import type { Operation } from '@/components/accounts/operation-list-item'

interface TransactionWithRelations {
  id: string
  type: 'expense' | 'income' | 'transfer'
  amount: number
  txDate: Date
  notes: string | null
  account: {
    id: string
    name: string
    type: string
  }
  counterAccount?: {
    id: string
    name: string
    type: string
  } | null
  category?: {
    id: string
    name: string
    type: string
    icon: string
  } | null
}

// Transform database transaction to Operation type expected by OperationListItem
export const transformTransactionToOperation = (
  tx: TransactionWithRelations
): Operation => {
  const baseOperation = {
    id: tx.id,
    amount: tx.amount,
    category: tx.category?.name || 'Uncategorized',
    date: tx.txDate.toISOString().split('T')[0], // Convert to YYYY-MM-DD format
    description: tx.notes || `${tx.type} transaction`,
    hasPhoto: false, // TODO: Check for attachments in future
    hasVoice: false // TODO: Check for attachments in future
  }

  switch (tx.type) {
    case 'expense':
      return {
        ...baseOperation,
        type: 'expense' as const
      }
    case 'income':
      return {
        ...baseOperation,
        type: 'income' as const
      }
    case 'transfer':
      return {
        ...baseOperation,
        type: 'other' as const,
        transactionType: 'exchange' as const,
        description: tx.counterAccount
          ? `Transfer from ${tx.account.name} to ${tx.counterAccount.name}`
          : `Transfer from ${tx.account.name}`
      }
    default:
      return {
        ...baseOperation,
        type: 'expense' as const
      }
  }
}

export const transformTransactionsToOperations = (
  transactions: TransactionWithRelations[]
): Operation[] => {
  return transactions.map(transformTransactionToOperation)
}

export const filterOperationsByType = (
  operations: Operation[],
  type: string
) => {
  switch (type) {
    case 'expense':
      return operations.filter(op => op.type === 'expense')
    case 'income':
      return operations.filter(op => op.type === 'income')
    case 'transfer':
      return operations.filter(
        op =>
          op.type === 'other' &&
          'transactionType' in op &&
          op.transactionType === 'exchange'
      )
    default:
      return operations
  }
}

export const getTodaysOperations = (operations: Operation[]): Operation[] => {
  const today = new Date().toISOString().split('T')[0]
  return operations.filter(operation => operation.date === today)
}

export const calculateTotals = (operations: Operation[]) => {
  const expenses = filterOperationsByType(operations, 'expense')
  const incomes = filterOperationsByType(operations, 'income')

  const totalExpenses = expenses.reduce((sum, op) => sum + op.amount, 0)
  const totalIncome = incomes.reduce((sum, op) => sum + op.amount, 0)
  const netAmount = totalIncome - totalExpenses

  return {
    expenses: totalExpenses,
    income: totalIncome,
    net: netAmount,
    count: operations.length
  }
}

export type { TransactionWithRelations }
