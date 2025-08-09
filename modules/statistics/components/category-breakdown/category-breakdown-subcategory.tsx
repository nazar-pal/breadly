import { Icon, type IconName } from '@/components/icon'
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
          'rounded-xl border border-border/20 bg-background/60 p-3',
          'min-h-[92px]'
        )}
      >
        <View className="mb-2 flex-row items-center justify-between">
          <View className="mr-2 flex-row items-center gap-3">
            <View
              className={cn(
                'h-8 w-8 items-center justify-center rounded-full',
                isOverBudgetValue ? 'bg-expense/10' : 'bg-primary/10'
              )}
            >
              <Icon
                name={(category.icon as IconName) ?? 'Circle'}
                size={16}
                className={cn(
                  isOverBudgetValue ? 'text-expense' : 'text-primary'
                )}
              />
            </View>
            <Text
              className="max-w-[150px] text-sm font-semibold text-foreground"
              numberOfLines={1}
            >
              {category.name}
            </Text>
          </View>
          <Text className="text-base font-bold text-foreground">
            {formatCurrency(spentAmount)}
          </Text>
        </View>
        <View className="mb-2 flex-row items-center justify-between">
          <Text className="text-xs font-medium text-muted-foreground">
            {percentageOfTotal.toFixed(1)}% of total
          </Text>
          {budgetAmount > 0 && (
            <View
              className={cn(
                'rounded-full px-2 py-0.5',
                isOverBudgetValue ? 'bg-expense/10' : 'bg-muted/60'
              )}
            >
              <Text
                className={cn(
                  'text-[10px] font-medium',
                  isOverBudgetValue ? 'text-expense' : 'text-muted-foreground'
                )}
              >
                {budgetProgress.toFixed(0)}% of {formatCurrency(budgetAmount)}
              </Text>
            </View>
          )}
        </View>
        <Progress
          value={
            budgetAmount > 0 ? Math.min(budgetProgress, 100) : percentageOfTotal
          }
          className="h-2 w-full"
          indicatorClassName={cn(
            budgetAmount > 0
              ? isOverBudgetValue
                ? 'bg-expense'
                : 'bg-primary'
              : 'bg-primary'
          )}
        />
      </View>
    </Pressable>
  )
}
