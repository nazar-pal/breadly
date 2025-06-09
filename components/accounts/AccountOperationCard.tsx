import { useTheme } from '@/context/ThemeContext'
import {
  ArrowDown,
  Calendar,
  CreditCard,
  RefreshCw,
  TrendingDown,
  TrendingUp
} from 'lucide-react-native'
import React from 'react'
import { Text, View } from 'react-native'

interface AccountOperation {
  id: string
  accountId: string
  amount: number
  category: string
  date: string
  description: string
  type: 'expense' | 'income' | 'payment' | 'transfer'
}

interface AccountOperationCardProps {
  operation: AccountOperation
}

const getOperationIcon = (type: string) => {
  switch (type) {
    case 'income':
      return TrendingUp
    case 'expense':
      return TrendingDown
    case 'payment':
      return CreditCard
    case 'transfer':
      return RefreshCw
    default:
      return ArrowDown
  }
}

const getOperationColor = (type: string, amount: number, colors: any) => {
  if (amount > 0) {
    return colors.success
  } else {
    return colors.error
  }
}

export default function AccountOperationCard({
  operation
}: AccountOperationCardProps) {
  const { colors } = useTheme()
  const IconComponent = getOperationIcon(operation.type)
  const operationColor = getOperationColor(
    operation.type,
    operation.amount,
    colors
  )
  const isPositive = operation.amount > 0

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Math.abs(amount))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <View
      className="mb-2 overflow-hidden rounded-lg"
      style={{ backgroundColor: colors.card }}
    >
      <View className="flex-row items-center p-3">
        <View
          className="mr-3 h-8 w-8 items-center justify-center rounded-lg"
          style={{
            backgroundColor:
              colors.iconBackground[
                operation.type === 'income'
                  ? 'success'
                  : operation.type === 'expense'
                    ? 'error'
                    : operation.type === 'payment'
                      ? 'primary'
                      : 'info'
              ]
          }}
        >
          <IconComponent size={16} color={operationColor} />
        </View>

        <View className="min-w-0 flex-1">
          <Text
            className="mb-1 text-sm font-medium"
            style={{ color: colors.text }}
            numberOfLines={1}
          >
            {operation.description}
          </Text>
          <View className="flex-row items-center gap-3">
            <View
              className="rounded px-1.5 py-0.5"
              style={{ backgroundColor: colors.surfaceSecondary }}
            >
              <Text
                className="text-[11px] font-medium"
                style={{ color: colors.textSecondary }}
              >
                {operation.category}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Calendar size={10} color={colors.textSecondary} />
              <Text
                className="text-[11px]"
                style={{ color: colors.textSecondary }}
              >
                {formatDate(operation.date)}
              </Text>
            </View>
          </View>
        </View>

        <View className="items-end">
          <Text className="text-sm font-bold" style={{ color: operationColor }}>
            {isPositive ? '+' : ''}
            {formatAmount(operation.amount)}
          </Text>
        </View>
      </View>
    </View>
  )
}
