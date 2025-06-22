import type { Operation } from '@/components/accounts/operation-list-item'
import { usePowerSync } from '@/lib/powersync/context'
import { transactions } from '@/lib/powersync/schema/table_7_transactions'
import { asyncTryCatch } from '@/lib/utils/index'
import { useUser } from '@clerk/clerk-expo'
import { toCompilableQuery } from '@powersync/drizzle-driver'
import { useQuery } from '@powersync/react'
import { and, desc, eq, gte, lte } from 'drizzle-orm'
import { useCallback, useMemo } from 'react'
import { Alert } from 'react-native'

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

interface CreateTransactionInput {
  type: 'expense' | 'income' | 'transfer'
  accountId: string
  counterAccountId?: string
  categoryId: string
  amount: number
  currencyId: string
  txDate: Date
  notes?: string
}

interface UpdateTransactionInput {
  id: string
  type?: 'expense' | 'income' | 'transfer'
  accountId?: string
  counterAccountId?: string
  categoryId?: string
  amount?: number
  currencyId?: string
  txDate?: Date
  notes?: string
}

// Transform database transaction to Operation type expected by OperationListItem
const transformTransactionToOperation = (
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

interface UseTransactionsOptions {
  accountId?: string
  type?: 'expense' | 'income' | 'transfer'
  dateFrom?: Date
  dateTo?: Date
  categoryId?: string
  limit?: number
}

export function useTransactions(options: UseTransactionsOptions = {}) {
  const { db } = usePowerSync()
  const { user } = useUser()

  const { accountId, type, dateFrom, dateTo, categoryId, limit } = options

  // Build where conditions
  const whereConditions = useMemo(() => {
    const conditions = []

    if (user?.id) {
      conditions.push(eq(transactions.userId, user.id))
    }

    if (accountId) {
      conditions.push(eq(transactions.accountId, accountId))
    }

    if (type) {
      conditions.push(eq(transactions.type, type))
    }

    if (dateFrom) {
      conditions.push(gte(transactions.txDate, dateFrom))
    }

    if (dateTo) {
      conditions.push(lte(transactions.txDate, dateTo))
    }

    if (categoryId) {
      conditions.push(eq(transactions.categoryId, categoryId))
    }

    return conditions.length > 0 ? and(...conditions) : undefined
  }, [user?.id, accountId, type, dateFrom, dateTo, categoryId])

  // Query transactions with related data
  const {
    data: transactionsData = [],
    isLoading,
    error
  } = useQuery(
    toCompilableQuery(
      db.query.transactions.findMany({
        where: whereConditions,
        with: {
          account: true,
          counterAccount: true,
          category: true
        },
        orderBy: [desc(transactions.txDate)],
        ...(limit && { limit })
      })
    )
  )

  // Transform transactions to operations
  const operations = useMemo(() => {
    if (!transactionsData) return []

    return transactionsData.map(transformTransactionToOperation)
  }, [transactionsData])

  // Filter operations by type for convenience
  const expenses = useMemo(
    () => operations.filter(op => op.type === 'expense'),
    [operations]
  )

  const incomes = useMemo(
    () => operations.filter(op => op.type === 'income'),
    [operations]
  )

  const transfers = useMemo(
    () =>
      operations.filter(
        op =>
          op.type === 'other' &&
          'transactionType' in op &&
          op.transactionType === 'exchange'
      ),
    [operations]
  )

  // Get today's operations
  const today = new Date().toISOString().split('T')[0]
  const todaysOperations = useMemo(() => {
    return operations.filter(operation => operation.date === today)
  }, [operations, today])

  // Calculate totals
  const totals = useMemo(() => {
    const totalExpenses = expenses.reduce((sum, op) => sum + op.amount, 0)
    const totalIncome = incomes.reduce((sum, op) => sum + op.amount, 0)
    const netAmount = totalIncome - totalExpenses

    return {
      expenses: totalExpenses,
      income: totalIncome,
      net: netAmount,
      count: operations.length
    }
  }, [expenses, incomes, operations.length])

  // Mutation functions
  const createTransaction = useCallback(
    async (input: CreateTransactionInput) => {
      if (!user?.id) {
        throw new Error('User must be logged in to create transactions')
      }

      const [error] = await asyncTryCatch(
        db.insert(transactions).values({
          userId: user.id,
          type: input.type,
          accountId: input.accountId,
          counterAccountId: input.counterAccountId || null,
          categoryId: input.categoryId,
          amount: input.amount,
          currencyId: input.currencyId,
          txDate: input.txDate,
          notes: input.notes || null,
          createdAt: new Date()
        })
      )

      if (error) {
        console.error('Failed to create transaction:', error)
        Alert.alert('Error', 'Failed to create transaction')
        throw error
      }
    },
    [db, user?.id]
  )

  const updateTransaction = useCallback(
    async (input: UpdateTransactionInput) => {
      if (!user?.id) {
        throw new Error('User must be logged in to update transactions')
      }

      const [error] = await asyncTryCatch(
        db
          .update(transactions)
          .set({
            type: input.type,
            accountId: input.accountId,
            counterAccountId: input.counterAccountId,
            categoryId: input.categoryId,
            amount: input.amount,
            currencyId: input.currencyId,
            txDate: input.txDate,
            notes: input.notes
          })
          .where(eq(transactions.id, input.id))
      )

      if (error) {
        console.error('Failed to update transaction:', error)
        Alert.alert('Error', 'Failed to update transaction')
        throw error
      }
    },
    [db, user?.id]
  )

  const deleteTransaction = useCallback(
    async (transactionId: string) => {
      if (!user?.id) {
        throw new Error('User must be logged in to delete transactions')
      }

      const [error] = await asyncTryCatch(
        db.delete(transactions).where(eq(transactions.id, transactionId))
      )

      if (error) {
        console.error('Failed to delete transaction:', error)
        Alert.alert('Error', 'Failed to delete transaction')
        throw error
      }
    },
    [db, user?.id]
  )

  return {
    operations,
    expenses,
    incomes,
    transfers,
    todaysOperations,
    totals,
    isLoading,
    error,
    rawTransactions: transactionsData,

    // Mutations
    createTransaction,
    updateTransaction,
    deleteTransaction
  }
}

export type {
  CreateTransactionInput,
  TransactionWithRelations,
  UpdateTransactionInput,
  UseTransactionsOptions
}
