import { Card, CardContent } from '@/components/ui/card'
import { ArrowDown, ArrowUp } from '@/lib/icons'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react-native'
import React from 'react'
import { Text, View } from 'react-native'

export function StatCard({
  title,
  amount,
  trend,
  trendLabel,
  variant = 'default',
  icon: Icon
}: {
  title: string
  amount: number
  trend?: number
  trendLabel?: string
  variant?: 'default' | 'income' | 'expense'
  icon?: LucideIcon
}) {
  const variants = {
    default: {
      trend: trend && trend > 0 ? 'text-income' : 'text-expense',
      icon: 'bg-primary/10 text-primary'
    },
    income: {
      trend: 'text-income',
      icon: 'bg-income/10 text-income'
    },
    expense: {
      trend: 'text-expense',
      icon: 'bg-expense/10 text-expense'
    }
  }

  return (
    <Card className="flex-1">
      <CardContent className="p-4">
        <View className="mb-3 flex-row items-center justify-between gap-2">
          <Text className="text-sm font-medium text-muted-foreground">
            {title}
          </Text>
          {Icon && (
            <View className={cn('rounded-full p-2', variants[variant].icon)}>
              <Icon size={14} className={variants[variant].icon} />
            </View>
          )}
        </View>
        <Text className="mb-2 text-2xl font-bold text-foreground">
          ${amount.toFixed(2)}
        </Text>
        {trend !== undefined && (
          <View className="flex-row items-center gap-1">
            <View className={cn('rounded-full p-1')}>
              {trend > 0 ? (
                <ArrowUp size={12} className={variants[variant].trend} />
              ) : (
                <ArrowDown size={12} className={variants[variant].trend} />
              )}
            </View>
            <Text
              className={cn('text-sm font-semibold', variants[variant].trend)}
            >
              {Math.abs(trend)}%
            </Text>
            {trendLabel && (
              <Text className="ml-1 text-xs text-muted-foreground">
                {trendLabel}
              </Text>
            )}
          </View>
        )}
      </CardContent>
    </Card>
  )
}
