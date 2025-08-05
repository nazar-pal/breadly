import { Icon } from '@/components/icon'
import { Pressable, Text, View } from 'react-native'
import { Card } from '../../ui/card'

interface BudgetSectionProps {
  categoryType: 'income' | 'expense'
  budgetAmount: number
  totalAmount: number
  isOverBudget: boolean
  remainingBudget: number
  budgetProgress: number
  onEditBudget: () => void
}

export function BudgetSection({
  categoryType,
  budgetAmount,
  totalAmount,
  isOverBudget,
  remainingBudget,
  budgetProgress,
  onEditBudget
}: BudgetSectionProps) {
  if (categoryType !== 'expense') {
    return null
  }

  return (
    <Card className="mb-6 p-4">
      <View className="mb-4 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Icon name="DollarSign" size={18} className="text-primary" />
          <Text className="text-base font-semibold text-foreground">
            Monthly Budget
          </Text>
        </View>
        <Pressable
          onPress={onEditBudget}
          className="flex-row items-center gap-2 rounded-lg border border-border bg-card px-3 py-2"
        >
          <Icon name="Pencil" size={14} className="text-primary" />
          <Text className="text-sm font-medium text-primary">
            {budgetAmount > 0 ? 'Edit' : 'Set Budget'}
          </Text>
        </Pressable>
      </View>

      {budgetAmount > 0 ? (
        <View>
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-sm font-medium text-foreground">
              Budget Limit
            </Text>
            <Text className="text-lg font-bold text-foreground">
              ${budgetAmount.toFixed(2)}
            </Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-medium text-foreground">
              Spent This Month
            </Text>
            <Text
              className={`text-lg font-bold ${
                isOverBudget ? 'text-red-500' : 'text-expense'
              }`}
            >
              ${totalAmount.toFixed(2)}
            </Text>
          </View>
          <View className="mt-3 flex-row items-center justify-between">
            <Text className="text-xs text-muted-foreground">
              {isOverBudget
                ? `$${(totalAmount - budgetAmount).toFixed(2)} over budget`
                : `$${remainingBudget.toFixed(2)} remaining`}
            </Text>
            <Text
              className={`text-xs ${
                isOverBudget ? 'text-red-500' : 'text-green-600'
              }`}
            >
              {budgetProgress.toFixed(1)}% used
            </Text>
          </View>
        </View>
      ) : (
        <View className="rounded-lg bg-muted/30 p-4">
          <Text className="text-center text-sm text-muted-foreground">
            No monthly budget set. Tap &quot;Set Budget&quot; to add a spending
            limit for this category.
          </Text>
        </View>
      )}
    </Card>
  )
}
