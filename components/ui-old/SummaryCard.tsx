import { useTheme } from '@/context/ThemeContext'
import React from 'react'
import { Text, View } from 'react-native'
import Card from './Card'

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
  const { colors } = useTheme()

  return (
    <Card variant="elevated" size="md" className="mb-4 flex-1">
      <Text className="mb-1 text-sm" style={{ color: colors.textSecondary }}>
        {title}
      </Text>
      <Text className="mb-1 text-2xl font-bold" style={{ color: colors.text }}>
        ${amount.toFixed(2)}
      </Text>
      {subtitle && (
        <Text className="text-xs" style={{ color: colors.textSecondary }}>
          {subtitle}
        </Text>
      )}
      {trend && (
        <View className="mt-2 flex-row items-center">
          <Text
            className="mr-1 text-sm font-semibold"
            style={{
              color: trend.isPositive ? colors.success : colors.error
            }}
          >
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.percentage)}%
          </Text>
          <Text className="text-xs" style={{ color: colors.textSecondary }}>
            vs last {title.toLowerCase()}
          </Text>
        </View>
      )}
    </Card>
  )
}
