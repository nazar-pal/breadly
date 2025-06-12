import { trpc } from '@/trpc/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export interface Transaction {
  id: string
  userId: string
  type: 'expense' | 'income' | 'transfer'
  accountId: string
  counterAccountId?: string | null
  categoryId?: string | null
  amount: string
  currencyId: string
  txDate: string
  notes?: string | null
  createdAt: string
  account?: {
    id: string
    name: string
    type: string
    balance: string
    currencyId: string
  }
  category?: {
    id: string
    name: string
    type: 'expense' | 'income'
  }
  currency?: {
    code: string
    name: string
    symbol: string
  }
}

export interface CreateTransactionInput {
  type: 'expense' | 'income' | 'transfer'
  accountId: string
  counterAccountId?: string
  categoryId?: string
  amount: number
  currencyId: string
  txDate: string
  notes?: string
}

export function useTransactions() {
  const queryClient = useQueryClient()

  // Get all transactions
  const transactionsQueryOptions = trpc.transactions.getAll.queryOptions()
  const {
    data: transactions = [],
    isLoading,
    error
  } = useQuery(transactionsQueryOptions)

  // Create transaction mutation
  const createTransactionMutationOptions =
    trpc.transactions.create.mutationOptions({
      onSuccess: () => {
        // Invalidate all relevant queries
        const transactionsQueryKey = trpc.transactions.getAll.queryKey()
        const accountsQueryKey = trpc.accounts.getAll.queryKey()
        const categoriesQueryKey = trpc.categories.getAll.queryKey()

        queryClient.invalidateQueries({ queryKey: transactionsQueryKey })
        queryClient.invalidateQueries({ queryKey: accountsQueryKey })
        queryClient.invalidateQueries({ queryKey: categoriesQueryKey })
      }
    })
  const createTransaction = useMutation(createTransactionMutationOptions)

  // Update transaction mutation
  const updateTransactionMutationOptions =
    trpc.transactions.update.mutationOptions({
      onSuccess: () => {
        const transactionsQueryKey = trpc.transactions.getAll.queryKey()
        const accountsQueryKey = trpc.accounts.getAll.queryKey()
        const categoriesQueryKey = trpc.categories.getAll.queryKey()

        queryClient.invalidateQueries({ queryKey: transactionsQueryKey })
        queryClient.invalidateQueries({ queryKey: accountsQueryKey })
        queryClient.invalidateQueries({ queryKey: categoriesQueryKey })
      }
    })
  const updateTransaction = useMutation(updateTransactionMutationOptions)

  // Delete transaction mutation
  const deleteTransactionMutationOptions =
    trpc.transactions.delete.mutationOptions({
      onSuccess: () => {
        const transactionsQueryKey = trpc.transactions.getAll.queryKey()
        const accountsQueryKey = trpc.accounts.getAll.queryKey()
        const categoriesQueryKey = trpc.categories.getAll.queryKey()

        queryClient.invalidateQueries({ queryKey: transactionsQueryKey })
        queryClient.invalidateQueries({ queryKey: accountsQueryKey })
        queryClient.invalidateQueries({ queryKey: categoriesQueryKey })
      }
    })
  const deleteTransaction = useMutation(deleteTransactionMutationOptions)

  // Helper function to get recent transactions
  const getRecentTransactions = (limit = 10) => {
    return transactions
      .slice()
      .sort(
        (a, b) => new Date(b.txDate).getTime() - new Date(a.txDate).getTime()
      )
      .slice(0, limit)
  }

  // Helper function to get transactions by type
  const getTransactionsByType = (type: 'expense' | 'income' | 'transfer') => {
    return transactions.filter(transaction => transaction.type === type)
  }

  // Helper function to calculate total for a type in a date range
  const getTotalByType = (
    type: 'expense' | 'income',
    startDate?: string,
    endDate?: string
  ) => {
    return transactions
      .filter(transaction => {
        if (transaction.type !== type) return false

        if (startDate && transaction.txDate < startDate) return false
        if (endDate && transaction.txDate > endDate) return false

        return true
      })
      .reduce((total, transaction) => total + parseFloat(transaction.amount), 0)
  }

  // New helper function using the TRPC procedure for category totals
  const useCategoryTotal = (categoryId: string) => {
    const queryOptions = trpc.transactions.getTotalAmount.queryOptions({
      categoryId
    })
    return useQuery(queryOptions)
  }

  return {
    // Data
    transactions,
    isLoading,
    error,

    // Mutations
    createTransaction,
    updateTransaction,
    deleteTransaction,

    // Helper functions
    getRecentTransactions,
    getTransactionsByType,
    getTotalByType,
    useCategoryTotal
  }
}
