import { startOfMonth } from 'date-fns'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert } from 'react-native'

import { createOrUpdateBudget } from '@/data/client/mutations'
import { DEFAULT_CURRENCY } from '@/lib/constants'
import { useGetCategoryBudgetData } from '@/modules/budget/data/queries/use-get-category-budget-data'
import { useUserSession } from '@/modules/session-and-migration'
import { CategoryBudgetActionButtons } from './category-budget-action-buttons'
import { CategoryBudgetHeader } from './category-budget-header'
import { CategoryBudgetInput } from './category-budget-input'

export function CategoryBudgetForm({
  categoryId,
  onClose
}: {
  categoryId: string
  onClose: () => void
}) {
  const { userId } = useUserSession()

  const { data, isLoading } = useGetCategoryBudgetData({
    userId,
    categoryId
  })

  const { category, userPreferences } = data ?? {}

  const parentCategory = category?.parent

  // Determine the latest budget amount (default to 0 when none exists).
  const currentBudget = category?.budgets.at(-1)?.amount ?? 0

  // Resolve currency – fall back to a default when none is set.
  const currency = userPreferences?.defaultCurrency ?? DEFAULT_CURRENCY.code

  // Local UI state for the input field.
  const [budgetAmount, setBudgetAmount] = useState(
    currentBudget > 0 ? currentBudget.toString() : ''
  )

  // Keep the input value in sync whenever the current budget changes.
  useEffect(() => {
    setBudgetAmount(currentBudget > 0 ? currentBudget.toString() : '')
  }, [currentBudget])

  const handleClose = () => {
    // Reset the input when closing and tell the store to close the modal.
    setBudgetAmount(currentBudget > 0 ? currentBudget.toString() : '')
    onClose()
  }

  const handleSave = async () => {
    const amount = parseFloat(budgetAmount)

    // Guard against invalid values.
    if (isNaN(amount) || amount < 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid positive number.')
      return
    }

    const startDate = startOfMonth(new Date())

    const [error] = await createOrUpdateBudget({
      userId,
      categoryId: category?.id ?? '',
      amount,
      startDate,
      currency
    })

    if (error) {
      console.error('Budget save error:', error)
      Alert.alert('Error', 'Failed to save budget. Please try again.')
      return
    }

    handleClose()
  }

  if (isLoading) {
    return <ActivityIndicator />
  }

  return (
    <>
      <CategoryBudgetHeader
        categoryName={category?.name ?? ''}
        parentCategoryName={parentCategory?.name}
      />

      <CategoryBudgetInput
        value={budgetAmount}
        onChangeText={setBudgetAmount}
      />

      <CategoryBudgetActionButtons onClose={handleClose} onSave={handleSave} />
    </>
  )
}
