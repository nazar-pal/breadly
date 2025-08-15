import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Link } from 'expo-router'
import {
  ArrowRight,
  Calendar,
  RefreshCw,
  TrendingDown,
  TrendingUp
} from 'lucide-react-native'
import React from 'react'
import { Pressable, Text, View } from 'react-native'

interface Transaction {
  id: string
  type: 'expense' | 'income' | 'transfer'
  amount: number
  txDate: Date
  notes: string | null
  account: {
    id: string
    name: string
    type: string
  }
  counterAccount?: {
    id: string
    name: string
    type: string
  } | null
  category?: {
    id: string
    name: string
    type: string
    icon: string
  } | null
}

export type { Transaction }

interface OperationCardProps {
  operation: Transaction
}

interface OperationConfig {
  icon: typeof TrendingUp
  colorClass: string
  bgColorClass: string
  prefix: string
  subtext?: (transaction: Transaction) => string | null
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
  transfer: {
    icon: RefreshCw,
    colorClass: 'text-primary',
    bgColorClass: 'bg-primary/10',
    prefix: '-',
    subtext: tx =>
      tx.counterAccount ? `Transfer to ${tx.counterAccount.name}` : 'Transfer'
  }
}

const getOperationConfig = (transaction: Transaction): OperationConfig => {
  switch (transaction.type) {
    case 'income':
      return OPERATION_CONFIGS.income
    case 'expense':
      return OPERATION_CONFIGS.expense
    case 'transfer':
      return OPERATION_CONFIGS.transfer
    default:
      return OPERATION_CONFIGS.expense
  }
}

export function OperationListItem({ operation }: OperationCardProps) {
  const config = getOperationConfig(operation)
  const IconComponent = config.icon
  const subtext = config.subtext?.(operation)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const description = operation.notes || `${operation.type} transaction`
  const categoryName = operation.category?.name || 'Uncategorized'

  return (
    <Link href={`/transactions/${operation.id}`} asChild>
      <Pressable>
        <Card className="mb-2 border-0 bg-card/50">
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
                    className="mr-2 flex-1 text-sm font-medium text-foreground"
                    numberOfLines={1}
                  >
                    {description}
                  </Text>
                  <Text
                    className={cn(
                      'text-[15px] font-semibold',
                      config.colorClass
                    )}
                  >
                    {config.prefix}${operation.amount.toFixed(2)}
                  </Text>
                </View>

                <View className="flex-row items-center justify-between">
                  <View className="flex-1 flex-row items-center gap-2">
                    <View className="rounded bg-muted/50 px-1.5 py-0.5">
                      <Text
                        className="text-[11px] font-medium text-muted-foreground"
                        numberOfLines={1}
                      >
                        {categoryName}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <Calendar size={12} className="text-muted-foreground" />
                      <Text className="text-[11px] text-muted-foreground">
                        {formatDate(operation.txDate)}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-center">
                    {/* TODO: Add attachment support */}
                    <ArrowRight
                      size={14}
                      className="ml-1 text-muted-foreground"
                    />
                  </View>
                </View>

                {subtext && (
                  <Text className="text-xs text-muted-foreground">
                    {subtext}
                  </Text>
                )}
              </View>
            </View>
          </CardContent>
        </Card>
      </Pressable>
    </Link>
  )
}
