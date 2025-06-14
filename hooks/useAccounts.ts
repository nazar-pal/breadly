import { trpc } from '@/trpc/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export interface Account {
  id: string
  userId: string
  type: 'saving' | 'payment' | 'debt'
  name: string
  description?: string | null
  currencyId: string
  balance: string
  // Type-specific fields for savings accounts
  savingsTargetAmount?: string | null
  savingsTargetDate?: string | null
  // Type-specific fields for debt accounts
  debtInitialAmount?: string | null
  debtIsOwedToMe?: boolean | null
  debtDueDate?: string | null // Database returns dates as strings
  // Common fields
  isArchived: boolean
  createdAt: Date
  currency?: {
    code: string
    name: string
    symbol: string
  } | null
}

export function useAccounts() {
  const queryClient = useQueryClient()

  // Get all accounts
  const accountsQueryOptions = trpc.accounts.getAll.queryOptions()
  const {
    data: accounts = [],
    isLoading,
    error
  } = useQuery(accountsQueryOptions)

  // Create account mutation
  const createAccountMutationOptions = trpc.accounts.create.mutationOptions({
    onSuccess: () => {
      const queryKey = trpc.accounts.getAll.queryKey()
      queryClient.invalidateQueries({ queryKey })
    }
  })
  const createAccount = useMutation(createAccountMutationOptions)

  // Update account mutation
  const updateAccountMutationOptions = trpc.accounts.update.mutationOptions({
    onSuccess: () => {
      const queryKey = trpc.accounts.getAll.queryKey()
      queryClient.invalidateQueries({ queryKey })
    }
  })
  const updateAccount = useMutation(updateAccountMutationOptions)

  // Delete account mutation
  const deleteAccountMutationOptions = trpc.accounts.delete.mutationOptions({
    onSuccess: () => {
      const queryKey = trpc.accounts.getAll.queryKey()
      queryClient.invalidateQueries({ queryKey })
    }
  })
  const deleteAccount = useMutation(deleteAccountMutationOptions)

  // Filter accounts by type
  const paymentAccounts = accounts.filter(account => account.type === 'payment')
  const savingAccounts = accounts.filter(account => account.type === 'saving')
  const debtAccounts = accounts.filter(account => account.type === 'debt')

  return {
    accounts,
    paymentAccounts,
    savingAccounts,
    debtAccounts,
    isLoading,
    error,
    createAccount,
    updateAccount,
    deleteAccount
  }
}
