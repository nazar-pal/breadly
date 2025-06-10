import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
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

interface OperationConfig {
  icon: typeof TrendingUp
  colorClass: string
  bgColorClass: string
  prefix: string
  subtext?: (operation: Operation) => string | null
}

const OPERATION_CONFIGS: Record<string, OperationConfig> = {
  income: {
    icon: TrendingUp,
    colorClass: 'text-success',
    bgColorClass: 'bg-success/10',
    prefix: '+'
  },
  expense: {
    icon: TrendingDown,
    colorClass: 'text-destructive',
    bgColorClass: 'bg-destructive/10',
    prefix: '-'
  },
  'debt-paid': {
    icon: TrendingDown,
    colorClass: 'text-destructive',
    bgColorClass: 'bg-destructive/10',
    prefix: '-',
    subtext: op =>
      op.type === 'debt' && op.creditor
        ? `Paid to ${op.creditor}`
        : 'Debt Payment'
  },
  'debt-received': {
    icon: TrendingUp,
    colorClass: 'text-success',
    bgColorClass: 'bg-success/10',
    prefix: '+',
    subtext: op =>
      op.type === 'debt' && op.debtor
        ? `Received from ${op.debtor}`
        : 'Debt Received'
  },
  'other-fee': {
    icon: CreditCard,
    colorClass: 'text-primary',
    bgColorClass: 'bg-primary/10',
    prefix: '-',
    subtext: () => 'Transaction Fee'
  },
  'other-refund': {
    icon: TrendingUp,
    colorClass: 'text-success',
    bgColorClass: 'bg-success/10',
    prefix: '+',
    subtext: () => 'Refund Received'
  },
  'other-exchange': {
    icon: RefreshCw,
    colorClass: 'text-primary',
    bgColorClass: 'bg-primary/10',
    prefix: '-',
    subtext: () => 'Currency Exchange'
  }
}

const getOperationConfig = (operation: Operation): OperationConfig => {
  switch (operation.type) {
    case 'income':
      return OPERATION_CONFIGS.income
    case 'expense':
      return OPERATION_CONFIGS.expense
    case 'debt':
      return operation.debtType === 'paid'
        ? OPERATION_CONFIGS['debt-paid']
        : OPERATION_CONFIGS['debt-received']
    case 'other':
      return (
        OPERATION_CONFIGS[`other-${operation.transactionType}`] ||
        OPERATION_CONFIGS['other-fee']
      )
    default:
      return OPERATION_CONFIGS.expense
  }
}

export default function OperationListItem({ operation }: OperationCardProps) {
  const router = useRouter()
  const config = getOperationConfig(operation)
  const IconComponent = config.icon
  const subtext = config.subtext?.(operation)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const handlePress = () => {
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
      <Card className="bg-card/50 mb-2 border-0">
        <CardContent className="p-3">
          <View className="flex-row items-center">
            <View
              className={cn(
                'mr-3 h-8 w-8 items-center justify-center rounded-lg',
                config.bgColorClass
              )}
            >
              <IconComponent size={16} className={config.colorClass} />
            </View>

            <View className="flex-1 gap-1">
              <View className="flex-row items-center justify-between">
                <Text
                  className="text-foreground mr-2 flex-1 text-sm font-medium"
                  numberOfLines={1}
                >
                  {operation.description}
                </Text>
                <Text
                  className={cn('text-[15px] font-semibold', config.colorClass)}
                >
                  {config.prefix}${operation.amount.toFixed(2)}
                </Text>
              </View>

              <View className="flex-row items-center justify-between">
                <View className="flex-1 flex-row items-center gap-2">
                  <View className="bg-muted/50 rounded px-1.5 py-0.5">
                    <Text
                      className="text-muted-foreground text-[11px] font-medium"
                      numberOfLines={1}
                    >
                      {operation.category}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <Calendar size={12} className="text-muted-foreground" />
                    <Text className="text-muted-foreground text-[11px]">
                      {formatDate(operation.date)}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center">
                  {operation.hasPhoto && (
                    <Receipt size={14} className="text-muted-foreground" />
                  )}
                  {operation.hasVoice && (
                    <Mic size={14} className="text-muted-foreground ml-1" />
                  )}
                  <ArrowRight
                    size={14}
                    className="text-muted-foreground ml-1"
                  />
                </View>
              </View>

              {subtext && (
                <Text className="text-muted-foreground text-xs">{subtext}</Text>
              )}
            </View>
          </View>
        </CardContent>
      </Card>
    </Pressable>
  )
}
