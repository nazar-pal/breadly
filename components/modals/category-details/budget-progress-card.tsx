import { Icon } from '@/components/icon'
import { Text, View } from 'react-native'
import { Card } from '../../ui/card'
import { Progress } from '../../ui/progress'

interface BudgetProgressCardProps {
  categoryType: 'income' | 'expense'
  monthlyBudget: any
  budgetAmount: number
  totalAmount: number
  budgetProgress: number
  isOverBudget: boolean
  remainingBudget: number
}

export function BudgetProgressCard({
  categoryType,
  monthlyBudget,
  budgetAmount,
  totalAmount,
  budgetProgress,
  isOverBudget,
  remainingBudget
}: BudgetProgressCardProps) {
  if (categoryType !== 'expense' || !monthlyBudget) {
    return null
  }

  return (
    <Card className="mb-6 p-4">
      <View className="mb-4 flex-row items-center gap-2">
        <Icon name="TrendingUp" size={18} className="text-primary" />
        <Text className="text-base font-semibold text-foreground">
          Monthly Budget Progress
        </Text>
      </View>

      <View className="mb-4">
        <View className="mb-2 flex-row items-center justify-between">
          <Text className="text-sm font-medium text-foreground">
            Spent: ${totalAmount.toFixed(2)}
          </Text>
          <Text className="text-sm font-medium text-foreground">
            Budget: ${budgetAmount.toFixed(2)}
          </Text>
        </View>

        <Progress
          value={budgetProgress}
          className="h-3"
          indicatorClassName={isOverBudget ? 'bg-red-500' : 'bg-green-500'}
        />

        <View className="mt-2 flex-row items-center justify-between">
          <Text
            className={`text-xs ${isOverBudget ? 'text-red-500' : 'text-green-600'}`}
          >
            {budgetProgress.toFixed(1)}% used
          </Text>
          <Text className="text-xs text-muted-foreground">
            {isOverBudget
              ? `$${(totalAmount - budgetAmount).toFixed(2)} over budget`
              : `$${remainingBudget.toFixed(2)} remaining`}
          </Text>
        </View>
      </View>

      {isOverBudget && (
        <View className="rounded-lg bg-red-50 p-3">
          <Text className="text-sm font-medium text-red-800">
            ⚠️ Budget Exceeded
          </Text>
          <Text className="text-xs text-red-600">
            You&apos;ve spent ${(totalAmount - budgetAmount).toFixed(2)} more
            than your monthly limit.
          </Text>
        </View>
      )}
    </Card>
  )
}
