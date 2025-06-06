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
import { Pressable, StyleSheet, Text, View } from 'react-native'
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
      <Card variant="elevated" size="sm" style={styles.container}>
        <View style={styles.content}>
          {/* Left: Icon */}
          <View
            style={[
              styles.iconContainer,
              {
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
              }
            ]}
          >
            <IconComponent size={16} color={operationColor} />
          </View>

          {/* Middle: Info */}
          <View style={styles.infoContainer}>
            <View style={styles.topRow}>
              <Text
                style={[styles.description, { color: colors.text }]}
                numberOfLines={1}
              >
                {operation.description}
              </Text>
              <Text style={[styles.amount, { color: operationColor }]}>
                {amountPrefix}${operation.amount.toFixed(2)}
              </Text>
            </View>

            <View style={styles.bottomRow}>
              <View style={styles.metaInfo}>
                <View
                  style={[
                    styles.categoryBadge,
                    { backgroundColor: colors.surfaceSecondary }
                  ]}
                >
                  <Text
                    style={[styles.categoryText, { color: colors.text }]}
                    numberOfLines={1}
                  >
                    {operation.category}
                  </Text>
                </View>
                <View style={styles.dateContainer}>
                  <Calendar size={12} color={colors.textSecondary} />
                  <Text
                    style={[styles.dateText, { color: colors.textSecondary }]}
                  >
                    {new Date(operation.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </Text>
                </View>
              </View>

              <View style={styles.attachments}>
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
                style={[styles.subtext, { color: colors.textSecondary }]}
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

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
    padding: 12
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  infoContainer: {
    flex: 1,
    gap: 4
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  description: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    marginRight: 8
  },
  amount: {
    fontSize: 15,
    fontWeight: '600'
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1
  },
  categoryBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '500'
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  dateText: {
    fontSize: 11
  },
  attachments: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  subtext: {
    fontSize: 11,
    fontStyle: 'italic'
  }
})
