import { Card, CardContent } from '@/components/ui/card'
import React from 'react'
import { Text, View } from 'react-native'

interface SummaryCardProps {
  title: string
  amount: number
  subtitle?: string
  trend?: {
    percentage: number
    isPositive: boolean
  }
}

export default function SummaryCard({
  title,
  amount,
  subtitle,
  trend
}: SummaryCardProps) {
  return (
    <Card className="mb-4 flex-1">
      <CardContent>
        <Text className="mb-1 text-sm text-old-text-secondary">{title}</Text>
        <Text className="mb-1 text-2xl font-bold text-old-text">
          ${amount.toFixed(2)}
        </Text>
        {subtitle && (
          <Text className="text-xs text-old-text-secondary">{subtitle}</Text>
        )}
        {trend && (
          <View className="mt-2 flex-row items-center">
            <Text
              className={`mr-1 text-sm font-semibold ${
                trend.isPositive ? 'text-old-success' : 'text-old-error'
              }`}
            >
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.percentage)}%
            </Text>
            <Text className="text-xs text-old-text-secondary">
              vs last {title.toLowerCase()}
            </Text>
          </View>
        )}
      </CardContent>
    </Card>
  )
}
