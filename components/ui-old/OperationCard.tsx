import { useTheme } from '@/context/ThemeContext'
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
import Card from './Card'

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

const getOperationColor = (operation: Operation, colors: any) => {
  switch (operation.type) {
    case 'income':
      return colors.success
    case 'debt':
      return operation.debtType === 'paid' ? colors.error : colors.success
    case 'other':
      return operation.transactionType === 'refund'
        ? colors.success
        : colors.primary
    default:
      return colors.error // expenses
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

export default function OperationCard({ operation }: OperationCardProps) {
  const { colors } = useTheme()
  const router = useRouter()

  const IconComponent = getOperationIcon(operation)
  const operationColor = getOperationColor(operation, colors)
  const amountPrefix = getAmountPrefix(operation)
  const subtext = getOperationSubtext(operation)

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
      <Card variant="elevated" size="sm" className="mb-2 p-3">
        <View className="flex-row items-center">
          {/* Left: Icon */}
          <View
            className="mr-3 h-8 w-8 items-center justify-center rounded-lg"
            style={{
              backgroundColor:
                colors.iconBackground[
                  operation.type === 'income'
                    ? 'success'
                    : operation.type === 'debt'
                      ? operation.debtType === 'paid'
                        ? 'error'
                        : 'success'
                      : operation.type === 'other'
                        ? operation.transactionType === 'refund'
                          ? 'success'
                          : 'primary'
                        : 'error' // expenses
                ]
            }}
          >
            <IconComponent size={16} color={operationColor} />
          </View>

          {/* Middle: Info */}
          <View className="flex-1 gap-1">
            <View className="flex-row items-center justify-between">
              <Text
                className="mr-2 flex-1 text-sm font-medium"
                style={{ color: colors.text }}
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
                <View
                  className="rounded px-1.5 py-0.5"
                  style={{ backgroundColor: colors.surfaceSecondary }}
                >
                  <Text
                    className="text-[11px] font-medium"
                    style={{ color: colors.text }}
                    numberOfLines={1}
                  >
                    {operation.category}
                  </Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <Calendar size={12} color={colors.textSecondary} />
                  <Text
                    className="text-[11px]"
                    style={{ color: colors.textSecondary }}
                  >
                    {new Date(operation.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center">
                {operation.hasPhoto && (
                  <Receipt size={14} color={colors.textSecondary} />
                )}
                {operation.hasVoice && (
                  <Mic
                    size={14}
                    color={colors.textSecondary}
                    style={{ marginLeft: 4 }}
                  />
                )}
                <ArrowRight
                  size={14}
                  color={colors.textSecondary}
                  style={{ marginLeft: 4 }}
                />
              </View>
            </View>

            {subtext && (
              <Text
                className="text-[11px] italic"
                style={{ color: colors.textSecondary }}
                numberOfLines={1}
              >
                {subtext}
              </Text>
            )}
          </View>
        </View>
      </Card>
    </Pressable>
  )
}
