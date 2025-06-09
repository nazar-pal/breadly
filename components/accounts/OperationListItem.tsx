import { Card, CardContent } from '@/components/ui/card'
import { useRouter } from 'expo-router'
import {
  ArrowRight,
  Calendar,
  CreditCard,
  Mic,
  Receipt,
  RefreshCw,
  TrendingDown,
  TrendingUp
} from 'lucide-react-native'
import React from 'react'
import { Pressable, Text, View } from 'react-native'

export type OperationType = 'expense' | 'income' | 'debt' | 'other'

interface BaseOperation {
  id: string
  amount: number
  category: string
  date: string
  description: string
  hasPhoto?: boolean
  hasVoice?: boolean
}

interface ExpenseOperation extends BaseOperation {
  type: 'expense'
}

interface IncomeOperation extends BaseOperation {
  type: 'income'
}

interface DebtOperation extends BaseOperation {
  type: 'debt'
  debtType: 'paid' | 'received'
  creditor?: string
  debtor?: string
}

interface OtherOperation extends BaseOperation {
  type: 'other'
  transactionType: 'fee' | 'refund' | 'exchange'
}

type Operation =
  | ExpenseOperation
  | IncomeOperation
  | DebtOperation
  | OtherOperation

export type { Operation }

interface OperationCardProps {
  operation: Operation
}

const getOperationIcon = (operation: Operation) => {
  switch (operation.type) {
    case 'income':
      return TrendingUp
    case 'debt':
      return operation.debtType === 'paid' ? TrendingDown : TrendingUp
    case 'other':
      switch (operation.transactionType) {
        case 'fee':
          return CreditCard
        case 'refund':
          return TrendingUp
        case 'exchange':
          return RefreshCw
        default:
          return CreditCard
      }
    default:
      return TrendingDown // expenses
  }
}

const getOperationColor = (operation: Operation) => {
  switch (operation.type) {
    case 'income':
      return '#10B981' // colors.success
    case 'debt':
      return operation.debtType === 'paid' ? '#EF4444' : '#10B981' // colors.error : colors.success
    case 'other':
      return operation.transactionType === 'refund'
        ? '#10B981' // colors.success
        : '#6366F1' // colors.primary
    default:
      return '#EF4444' // colors.error (expenses)
  }
}

const getAmountPrefix = (operation: Operation) => {
  switch (operation.type) {
    case 'income':
      return '+'
    case 'debt':
      return operation.debtType === 'paid' ? '-' : '+'
    case 'other':
      return operation.transactionType === 'refund' ? '+' : '-'
    default:
      return '-' // expenses
  }
}

const getOperationSubtext = (operation: Operation) => {
  switch (operation.type) {
    case 'debt':
      if (operation.debtType === 'paid') {
        return operation.creditor
          ? `Paid to ${operation.creditor}`
          : 'Debt Payment'
      } else {
        return operation.debtor
          ? `Received from ${operation.debtor}`
          : 'Debt Received'
      }
    case 'other':
      switch (operation.transactionType) {
        case 'fee':
          return 'Transaction Fee'
        case 'refund':
          return 'Refund Received'
        case 'exchange':
          return 'Currency Exchange'
        default:
          return 'Other Transaction'
      }
    default:
      return null
  }
}

const getIconBackgroundColor = (operation: Operation) => {
  switch (operation.type) {
    case 'income':
      return 'rgba(16, 185, 129, 0.1)' // colors.iconBackground.success
    case 'debt':
      return operation.debtType === 'paid'
        ? 'rgba(239, 68, 68, 0.1)' // colors.iconBackground.error
        : 'rgba(16, 185, 129, 0.1)' // colors.iconBackground.success
    case 'other':
      return operation.transactionType === 'refund'
        ? 'rgba(16, 185, 129, 0.1)' // colors.iconBackground.success
        : 'rgba(99, 102, 241, 0.1)' // colors.iconBackground.primary
    default:
      return 'rgba(239, 68, 68, 0.1)' // colors.iconBackground.error (expenses)
  }
}

export default function OperationListItem({ operation }: OperationCardProps) {
  const router = useRouter()

  const IconComponent = getOperationIcon(operation)
  const operationColor = getOperationColor(operation)
  const amountPrefix = getAmountPrefix(operation)
  const subtext = getOperationSubtext(operation)
  const iconBgColor = getIconBackgroundColor(operation)

  const handlePress = () => {
    // Route based on operation type
    switch (operation.type) {
      case 'expense':
        router.push(`/expenses/${operation.id}`)
        break
      case 'income':
        // TODO: Add income detail screen
        console.log('Income operation clicked:', operation.id)
        break
      case 'debt':
        // TODO: Add debt detail screen
        console.log('Debt operation clicked:', operation.id)
        break
      case 'other':
        // TODO: Add other transaction detail screen
        console.log('Other operation clicked:', operation.id)
        break
    }
  }

  return (
    <Pressable onPress={handlePress}>
      <Card className="mb-2">
        <CardContent className="p-3">
          <View className="flex-row items-center">
            {/* Left: Icon */}
            <View
              className="mr-3 h-8 w-8 items-center justify-center rounded-lg"
              style={{ backgroundColor: iconBgColor }}
            >
              <IconComponent size={16} color={operationColor} />
            </View>

            {/* Middle: Info */}
            <View className="flex-1 gap-1">
              <View className="flex-row items-center justify-between">
                <Text
                  className="mr-2 flex-1 text-sm font-medium text-foreground"
                  numberOfLines={1}
                >
                  {operation.description}
                </Text>
                <Text
                  className="text-[15px] font-semibold"
                  style={{ color: operationColor }}
                >
                  {amountPrefix}${operation.amount.toFixed(2)}
                </Text>
              </View>

              <View className="flex-row items-center justify-between">
                <View className="flex-1 flex-row items-center gap-2">
                  <View className="bg-card-secondary rounded px-1.5 py-0.5">
                    <Text
                      className="text-[11px] font-medium text-foreground"
                      numberOfLines={1}
                    >
                      {operation.category}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <Calendar size={12} color="#4A5568" />
                    <Text className="text-[11px] text-foreground">
                      {new Date(operation.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center">
                  {operation.hasPhoto && <Receipt size={14} color="#4A5568" />}
                  {operation.hasVoice && (
                    <Mic size={14} color="#4A5568" style={{ marginLeft: 4 }} />
                  )}
                  <ArrowRight
                    size={14}
                    color="#4A5568"
                    style={{ marginLeft: 4 }}
                  />
                </View>
              </View>

              {subtext && (
                <Text
                  className="text-[11px] italic text-foreground"
                  numberOfLines={1}
                >
                  {subtext}
                </Text>
              )}
            </View>
          </View>
        </CardContent>
      </Card>
    </Pressable>
  )
}
