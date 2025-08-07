import { Progress } from '@/components/ui/progress'
import { useGetCategories } from '@/data/client/queries'
import { cn } from '@/lib/utils'
import React from 'react'
import { Pressable, Text, View } from 'react-native'
import {
  calculateBudgetProgress,
  calculatePercentageOfTotal,
  formatCurrency,
  getCurrentMonthBudget,
  isOverBudget
} from '../../utils'

type CategoryWithBudgets = ReturnType<typeof useGetCategories>['data'][number]

interface CategoryBreakdownSubcategoryProps {
  category: CategoryWithBudgets
  spentAmount: number
  totalSpent: number
  isLastSubcategory?: boolean
  onOpenBudgetModal: (categoryId: string) => void
}

export function CategoryBreakdownSubcategory({
  category,
  spentAmount,
  totalSpent,
  isLastSubcategory = false,
  onOpenBudgetModal
}: CategoryBreakdownSubcategoryProps) {
  const percentageOfTotal = calculatePercentageOfTotal(spentAmount, totalSpent)

  const currentMonthBudget = getCurrentMonthBudget(category.budgets)
  const budgetAmount = currentMonthBudget ? currentMonthBudget.amount : 0
  const budgetProgress = calculateBudgetProgress(spentAmount, budgetAmount)
  const isOverBudgetValue = isOverBudget(spentAmount, budgetAmount)

  const handleLongPress = () => onOpenBudgetModal(category.id)

  return (
    <Pressable onLongPress={handleLongPress} delayLongPress={500}>
      <View
        className={cn(
          'border-l-2 border-border/30 py-3 pl-4 pr-2',
          !isLastSubcategory && 'border-b border-border/10'
        )}
      >
        <View className="mb-2 flex-row items-center justify-between">
          <View className="flex-1 flex-row items-center gap-2 pr-2">
            <View className="h-2 w-2 rounded-full bg-muted-foreground/60" />
            <View className="min-w-0 flex-1">
              <Text
                className="text-sm font-medium text-foreground/90"
                numberOfLines={1}
              >
                {category.name}
              </Text>
              <View className="flex-row items-center gap-2">
                <Text className="text-xs text-muted-foreground">
                  {formatCurrency(spentAmount)}
                </Text>
                {budgetAmount > 0 && (
                  <>
                    <Text className="text-xs text-muted-foreground">
                      of {formatCurrency(budgetAmount)}
                    </Text>
                    <Text
                      className={cn(
                        'text-xs font-medium',
                        isOverBudgetValue
                          ? 'text-expense'
                          : 'text-muted-foreground'
                      )}
                    >
                      ({budgetProgress.toFixed(0)}%)
                    </Text>
                  </>
                )}
              </View>
            </View>
          </View>
          <Text className="ml-2 text-sm font-medium text-foreground/80">
            {percentageOfTotal.toFixed(1)}%
          </Text>
        </View>
        {/* Progress bar */}
        <View className="ml-4 mr-2">
          <Progress
            value={
              budgetAmount > 0
                ? Math.min(budgetProgress, 100)
                : percentageOfTotal
            }
            className="h-1.5 w-full"
            indicatorClassName={cn(
              budgetAmount > 0
                ? isOverBudgetValue
                  ? 'bg-expense/70'
                  : 'bg-primary/70'
                : 'bg-primary/70'
            )}
          />
        </View>
      </View>
    </Pressable>
  )
}
