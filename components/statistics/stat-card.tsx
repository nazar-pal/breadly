import { Icon, type IconName } from '@/components/icon'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import React from 'react'
import { Text, View } from 'react-native'

type Variant = 'default' | 'income' | 'expense'

interface Props {
  title: string
  amount: number
  trend?: number
  trendLabel?: string
  progress?: number
  progressLabel?: string
  variant?: Variant
  icon?: IconName
}

// Helper function to format amount with proper currency display
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(Math.abs(amount))
}

// Helper function to get trend color based on variant and trend direction
function getTrendColor(variant: Variant, trend: number): string {
  if (variant === 'default') {
    return trend > 0 ? 'text-income' : 'text-expense'
  }

  // For income: increase is good (green), decrease is bad (red)
  if (variant === 'income') {
    return trend < 0 ? 'text-expense' : 'text-income'
  }

  // For expense: decrease is good (green), increase is bad (red)
  return trend < 0 ? 'text-income' : 'text-expense'
}

// Helper function to get amount text color
function getAmountColor(variant: Variant): string {
  switch (variant) {
    case 'income':
      return 'text-income'
    case 'expense':
      return 'text-expense'
    default:
      return 'text-foreground'
  }
}

// Helper function to get icon styling
function getIconStyling(variant: Variant): string {
  switch (variant) {
    case 'income':
      return 'bg-income/10 text-income'
    case 'expense':
      return 'bg-expense/10 text-expense'
    default:
      return 'bg-primary/10 text-primary'
  }
}

// Helper function to get progress indicator color
function getProgressColor(variant: Variant): string {
  switch (variant) {
    case 'income':
      return 'bg-income'
    case 'expense':
      return 'bg-expense'
    default:
      return 'bg-primary'
  }
}

export function StatCard({
  title,
  amount,
  trend,
  trendLabel,
  progress,
  progressLabel,
  variant = 'default',
  icon
}: Props) {
  const trendColor = trend !== undefined ? getTrendColor(variant, trend) : ''
  const amountColor = getAmountColor(variant)
  const iconStyling = getIconStyling(variant)
  const progressColor = getProgressColor(variant)

  return (
    <Card className="flex-1">
      <CardContent className="p-4">
        {/* Header with title and icon */}
        <View className="mb-4 flex-row items-center justify-between">
          <Text
            className="text-sm font-medium text-muted-foreground"
            numberOfLines={1}
          >
            {title}
          </Text>
          {icon && (
            <View className={cn('rounded-full p-2', iconStyling)}>
              <Icon name={icon} size={16} />
            </View>
          )}
        </View>

        {/* Amount display */}
        <Text className={cn('mb-3 text-2xl font-bold', amountColor)}>
          {amount < 0 && '-'}
          {formatCurrency(amount)}
        </Text>

        {/* Trend information */}
        {trend !== undefined && (
          <View className="mb-3 flex-row items-center gap-1.5">
            <View className="rounded-full p-0.5">
              {trend > 0 ? (
                <Icon name="ArrowUp" size={14} className={trendColor} />
              ) : (
                <Icon name="ArrowDown" size={14} className={trendColor} />
              )}
            </View>
            <Text className={cn('text-sm font-medium', trendColor)}>
              {Math.abs(trend).toFixed(1)}%
            </Text>
            {trendLabel && (
              <Text className="text-sm text-muted-foreground">
                {trendLabel}
              </Text>
            )}
          </View>
        )}

        {/* Progress bar section */}
        {progress !== undefined && (
          <View className="space-y-2">
            {progressLabel && (
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-muted-foreground">
                  {progressLabel}
                </Text>
                <Text className={cn('text-sm font-medium', amountColor)}>
                  {progress.toFixed(1)}%
                </Text>
              </View>
            )}
            <Progress
              value={Math.min(Math.max(progress, 0), 100)}
              className="h-2"
              indicatorClassName={progressColor}
            />
          </View>
        )}
      </CardContent>
    </Card>
  )
}
