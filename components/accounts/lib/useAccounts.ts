import { usePowerSync } from '@/powersync/context'
import { accounts } from '@/powersync/schema/table_6_accounts'
import { asyncTryCatch } from '@/utils'
import { useUser } from '@clerk/clerk-expo'
import { toCompilableQuery } from '@powersync/drizzle-driver'
import { useQuery } from '@powersync/react'
import { and, eq, InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { useCallback, useMemo } from 'react'
import { Alert } from 'react-native'

export type Account = InferSelectModel<typeof accounts>

export type CreateAccountInput = Omit<
  InferInsertModel<typeof accounts>,
  'userId' | 'id' | 'createdAt' | 'isArchived'
>

export type UpdateAccountInput = Partial<Account>

export function useAccounts() {
  const { db } = usePowerSync()
  const { user } = useUser()

  // Query all accounts with currency data
  const {
    data: accountsData = [],
    isLoading,
    error
  } = useQuery(
    toCompilableQuery(
      db.query.accounts.findMany({
        where: user?.id ? eq(accounts.userId, user.id) : undefined,
        with: {
          currency: true
        },
        orderBy: accounts.createdAt
      })
    )
  )

  // Transform database accounts to match the expected Account interface
  const allAccounts = useMemo(() => {
    return accountsData.map(account => ({
      ...account,
      balance: account.balance || 0,
      savingsTargetAmount: account.savingsTargetAmount || null,
      savingsTargetDate: account.savingsTargetDate || null,
      debtInitialAmount: account.debtInitialAmount || null,
      debtIsOwedToMe: account.debtIsOwedToMe || null,
      debtDueDate: account.debtDueDate || null
    })) as Account[]
  }, [accountsData])

  // Filter accounts by type (excluding archived unless specifically requested)
  const activeAccounts = useMemo(
    () => allAccounts.filter(account => !account.isArchived),
    [allAccounts]
  )

  const paymentAccounts = useMemo(
    () => activeAccounts.filter(account => account.type === 'payment'),
    [activeAccounts]
  )

  const savingAccounts = useMemo(
    () => activeAccounts.filter(account => account.type === 'saving'),
    [activeAccounts]
  )

  const debtAccounts = useMemo(
    () => activeAccounts.filter(account => account.type === 'debt'),
    [activeAccounts]
  )

  // Mutation functions
  const createAccount = useCallback(
    async (input: CreateAccountInput) => {
      if (!user?.id) {
        throw new Error('User must be logged in to create accounts')
      }

      // Build the values object based on account type
      const baseValues = {
        userId: user.id,
        type: input.type,
        name: input.name,
        description: input.description || null,
        currencyId: input.currencyId || 'USD',
        balance: input.balance || 0,
        isArchived: false,
        createdAt: new Date()
      }

      // Only include type-specific fields for the appropriate account type
      let values: any = { ...baseValues }

      if (input.type === 'saving') {
        values.savingsTargetAmount = input.savingsTargetAmount || null
        values.savingsTargetDate = input.savingsTargetDate || null
      } else if (input.type === 'debt') {
        values.debtInitialAmount = input.debtInitialAmount || null
        values.debtIsOwedToMe = input.debtIsOwedToMe ?? false
        values.debtDueDate = input.debtDueDate || null
      }

      const [error] = await asyncTryCatch(db.insert(accounts).values(values))

      if (error) {
        console.error('Failed to create account:', error)
        Alert.alert('Error', 'Failed to create account')
        throw error
      }
    },
    [db, user?.id]
  )

  const updateAccount = useCallback(
    async (input: UpdateAccountInput) => {
      if (!user?.id) {
        throw new Error('User must be logged in to update accounts')
      }

      if (!input.id) {
        throw new Error('Account ID is required for updates')
      }

      // Build the update values based on account type
      const baseValues: any = {}

      if (input.name !== undefined) baseValues.name = input.name
      if (input.description !== undefined)
        baseValues.description = input.description
      if (input.currencyId !== undefined)
        baseValues.currencyId = input.currencyId
      if (input.balance !== undefined) baseValues.balance = input.balance
      if (input.isArchived !== undefined)
        baseValues.isArchived = input.isArchived

      // Only include type-specific fields for the appropriate account type
      if (input.type === 'saving') {
        if (input.savingsTargetAmount !== undefined) {
          baseValues.savingsTargetAmount = input.savingsTargetAmount
        }
        if (input.savingsTargetDate !== undefined) {
          baseValues.savingsTargetDate = input.savingsTargetDate
        }
        // Explicitly set debt fields to null for saving accounts
        baseValues.debtInitialAmount = null
        baseValues.debtIsOwedToMe = null
        baseValues.debtDueDate = null
      } else if (input.type === 'debt') {
        if (input.debtInitialAmount !== undefined) {
          baseValues.debtInitialAmount = input.debtInitialAmount
        }
        if (input.debtIsOwedToMe !== undefined) {
          baseValues.debtIsOwedToMe = input.debtIsOwedToMe
        }
        if (input.debtDueDate !== undefined) {
          baseValues.debtDueDate = input.debtDueDate
        }
        // Explicitly set savings fields to null for debt accounts
        baseValues.savingsTargetAmount = null
        baseValues.savingsTargetDate = null
      } else if (input.type === 'payment') {
        // Explicitly set all type-specific fields to null for payment accounts
        baseValues.savingsTargetAmount = null
        baseValues.savingsTargetDate = null
        baseValues.debtInitialAmount = null
        baseValues.debtIsOwedToMe = null
        baseValues.debtDueDate = null
      }

      const [error] = await asyncTryCatch(
        db
          .update(accounts)
          .set(baseValues)
          .where(and(eq(accounts.id, input.id), eq(accounts.userId, user.id)))
      )

      if (error) {
        console.error('Failed to update account:', error)
        Alert.alert('Error', 'Failed to update account')
        throw error
      }
    },
    [db, user?.id]
  )

  const deleteAccount = useCallback(
    async (accountId: string) => {
      if (!user?.id) {
        throw new Error('User must be logged in to delete accounts')
      }

      const [error] = await asyncTryCatch(
        db
          .delete(accounts)
          .where(and(eq(accounts.id, accountId), eq(accounts.userId, user.id)))
      )

      if (error) {
        console.error('Failed to delete account:', error)
        Alert.alert('Error', 'Failed to delete account')
        throw error
      }
    },
    [db, user?.id]
  )

  return {
    accounts: activeAccounts,
    allAccounts, // Include archived accounts if needed
    paymentAccounts,
    savingAccounts,
    debtAccounts,
    isLoading,
    error,

    // Mutations
    createAccount,
    updateAccount,
    deleteAccount
  }
}
