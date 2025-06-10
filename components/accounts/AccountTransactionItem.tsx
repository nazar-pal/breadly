import {
  ArrowDown,
  Calendar,
  CreditCard,
  RefreshCw,
  TrendingDown,
  TrendingUp
} from '@/lib/icons'
import { cn } from '@/lib/utils'
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

type OperationType = AccountOperation['type']

interface OperationConfig {
  icon: typeof TrendingUp
  colorClass: string
  bgColorClass: string
}

const OPERATION_CONFIGS: Record<OperationType, OperationConfig> = {
  income: {
    icon: TrendingUp,
    colorClass: 'text-success',
    bgColorClass: 'bg-success/10'
  },
  expense: {
    icon: TrendingDown,
    colorClass: 'text-destructive',
    bgColorClass: 'bg-destructive/10'
  },
  payment: {
    icon: CreditCard,
    colorClass: 'text-primary',
    bgColorClass: 'bg-primary/10'
  },
  transfer: {
    icon: RefreshCw,
    colorClass: 'text-info',
    bgColorClass: 'bg-info/10'
  }
}

const getOperationConfig = (type: OperationType): OperationConfig => {
  return (
    OPERATION_CONFIGS[type] || {
      icon: ArrowDown,
      colorClass: 'text-primary',
      bgColorClass: 'bg-primary/10'
    }
  )
}

export default function AccountTransactionItem({
  operation
}: AccountTransactionItemProps) {
  const {
    icon: IconComponent,
    colorClass,
    bgColorClass
  } = getOperationConfig(operation.type)
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
    <View className="bg-card/50 mb-2 overflow-hidden rounded-lg">
      <View className="flex-row items-center p-3">
        <View
          className={cn(
            'mr-3 h-8 w-8 items-center justify-center rounded-lg',
            bgColorClass
          )}
        >
          <IconComponent size={16} className={colorClass} />
        </View>

        <View className="min-w-0 flex-1">
          <Text
            className="text-foreground mb-1 text-sm font-medium"
            numberOfLines={1}
          >
            {operation.description}
          </Text>
          <View className="flex-row items-center gap-3">
            <View className="bg-muted/50 rounded px-1.5 py-0.5">
              <Text className="text-muted-foreground text-[11px] font-medium">
                {operation.category}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Calendar size={10} className="text-muted-foreground" />
              <Text className="text-muted-foreground text-[11px]">
                {formatDate(operation.date)}
              </Text>
            </View>
          </View>
        </View>

        <View className="items-end">
          <Text
            className={cn(
              'text-sm font-bold',
              isPositive ? 'text-success' : 'text-destructive'
            )}
          >
            {isPositive ? '+' : ''}
            {formatAmount(operation.amount)}
          </Text>
        </View>
      </View>
    </View>
  )
}
