import { Icon } from '@/components/icon'
import { Modal } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { createOrUpdateBudget } from '@/data/client/mutations'
import { useGetUserPreferences } from '@/data/client/queries'
import { DEFAULT_CURRENCY } from '@/lib/constants'
import { useUserSession } from '@/modules/session-and-migration'
import { startOfMonth } from 'date-fns'
import React, { useState } from 'react'
import { Alert, View } from 'react-native'

type CategoryWithBudgets = {
  id: string
  name: string
  parentId?: string | null
  budgets?: {
    id: string
    amount: number
    currency: string
    startDate: Date
    endDate: Date
  }[]
  [key: string]: any
}

interface CategoryBudgetModalProps {
  isVisible: boolean
  onClose: () => void
  category: CategoryWithBudgets
  parentCategory?: CategoryWithBudgets
  currentBudget: number
}

export function CategoryBudgetModal({
  isVisible,
  onClose,
  category,
  parentCategory,
  currentBudget
}: CategoryBudgetModalProps) {
  const { userId } = useUserSession()
  const { data: userPreferences } = useGetUserPreferences({ userId })
  const [budgetAmount, setBudgetAmount] = useState(
    currentBudget > 0 ? currentBudget.toString() : ''
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get user's default currency with fallback
  const defaultCurrency =
    userPreferences?.[0]?.defaultCurrency || DEFAULT_CURRENCY.code

  const handleSave = async () => {
    const amount = parseFloat(budgetAmount)

    if (isNaN(amount) || amount < 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid positive number.')
      return
    }

    setIsSubmitting(true)

    const now = new Date()
    const startDate = startOfMonth(now)

    const [error] = await createOrUpdateBudget({
      userId,
      categoryId: category.id,
      amount,
      startDate,
      currency: defaultCurrency
    })

    if (error) {
      Alert.alert('Error', 'Failed to save budget. Please try again.')
      console.error('Budget save error:', error)
    } else {
      // Success - close modal without alert per codebase pattern
      onClose()
    }

    setIsSubmitting(false)
  }

  const handleClose = () => {
    // Reset to current budget value when closing
    setBudgetAmount(currentBudget > 0 ? currentBudget.toString() : '')
    onClose()
  }

  return (
    <Modal
      isVisible={isVisible}
      onClose={handleClose}
      height="50%"
      className="flex-1 bg-background p-6"
    >
      {/* Header */}
      <View className="mb-6">
        <Text className="text-xl font-bold text-foreground">
          Set Monthly Budget
        </Text>
        <View className="mt-2">
          <Text className="text-base font-medium text-foreground">
            {category.name}
          </Text>
          {parentCategory && (
            <Text className="text-sm text-muted-foreground">
              in {parentCategory.name}
            </Text>
          )}
        </View>
      </View>

      {/* Budget Input */}
      <View className="mb-6">
        <Text className="mb-3 text-sm font-medium text-foreground">
          Monthly Spending Limit
        </Text>
        <View className="relative">
          <Input
            value={budgetAmount}
            onChangeText={setBudgetAmount}
            placeholder="0.00"
            keyboardType="numeric"
            className="pl-10 text-lg"
            autoFocus
          />
          <View className="absolute left-3 top-1/2 -translate-y-1/2">
            <Icon
              name="DollarSign"
              size={18}
              className="text-muted-foreground"
            />
          </View>
        </View>
        <Text className="mt-2 text-xs text-muted-foreground">
          Enter 0 to remove the budget limit
        </Text>
      </View>

      {/* Current Status */}
      {currentBudget > 0 && (
        <View className="mb-6 rounded-lg bg-muted/30 p-4">
          <Text className="text-sm font-medium text-foreground">
            Current Budget
          </Text>
          <Text className="text-lg font-semibold text-foreground">
            ${currentBudget.toFixed(2)}
          </Text>
        </View>
      )}

      {/* Action Buttons */}
      <View className="mt-auto flex-row gap-3">
        <Button
          onPress={handleClose}
          variant="outline"
          className="flex-1"
          disabled={isSubmitting}
        >
          <Text>Cancel</Text>
        </Button>
        <Button onPress={handleSave} className="flex-1" disabled={isSubmitting}>
          <Text>{isSubmitting ? 'Saving...' : 'Save Budget'}</Text>
        </Button>
      </View>
    </Modal>
  )
}
