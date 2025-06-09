import {
  ArrowDown,
  Calendar,
  CreditCard,
  RefreshCw,
  TrendingDown,
  TrendingUp
} from '@/lib/icons'
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

interface AccountTransactionItemProps {
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

const getOperationColor = (type: string, amount: number) => {
  if (amount > 0) {
    return '#10B981' // colors.success
  } else {
    return '#EF4444' // colors.error
  }
}

const getIconBackgroundColor = (type: string) => {
  switch (type) {
    case 'income':
      return 'rgba(16, 185, 129, 0.1)' // colors.iconBackground.success
    case 'expense':
      return 'rgba(239, 68, 68, 0.1)' // colors.iconBackground.error
    case 'payment':
      return 'rgba(99, 102, 241, 0.1)' // colors.iconBackground.primary
    case 'transfer':
      return 'rgba(59, 130, 246, 0.1)' // colors.iconBackground.info
    default:
      return 'rgba(99, 102, 241, 0.1)' // colors.iconBackground.primary
  }
}

export default function AccountTransactionItem({
  operation
}: AccountTransactionItemProps) {
  const IconComponent = getOperationIcon(operation.type)
  const operationColor = getOperationColor(operation.type, operation.amount)
  const iconBgColor = getIconBackgroundColor(operation.type)
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
    <View className="mb-2 overflow-hidden rounded-lg bg-card">
      <View className="flex-row items-center p-3">
        <View
          className="mr-3 h-8 w-8 items-center justify-center rounded-lg"
          style={{ backgroundColor: iconBgColor }}
        >
          <IconComponent size={16} color={operationColor} />
        </View>

        <View className="min-w-0 flex-1">
          <Text
            className="mb-1 text-sm font-medium text-foreground"
            numberOfLines={1}
          >
            {operation.description}
          </Text>
          <View className="flex-row items-center gap-3">
            <View className="bg-card-secondary rounded px-1.5 py-0.5">
              <Text className="text-[11px] font-medium text-foreground">
                {operation.category}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Calendar size={10} color="#4A5568" />
              <Text className="text-[11px] text-foreground">
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
