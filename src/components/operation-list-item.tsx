import { Card, CardContent } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
import { TransactionType } from '@/data/client/db-schema'
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
  type: TransactionType
  amount: number
  txDate: Date
  notes: string | null
  account?: {
    id: string
    name: string
    type: string
  } | null
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
    parent?: {
      id: string
      name: string
      icon: string
    } | null
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
    colorClass: 'text-income',
    bgColorClass: 'bg-income/20',
    prefix: '+'
  },
  expense: {
    icon: TrendingDown,
    colorClass: 'text-destructive',
    bgColorClass: 'bg-destructive/20',
    prefix: '-'
  },
  transfer: {
    icon: RefreshCw,
    colorClass: 'text-foreground',
    bgColorClass: 'bg-primary/20',
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
  const subtext =
    operation.type === 'transfer' ? null : config.subtext?.(operation)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const parentCategoryName = operation.category?.parent?.name || null
  const categoryName = operation.category?.name || 'Uncategorized'
  const categoryDisplay = parentCategoryName
    ? `${parentCategoryName} · ${categoryName}`
    : categoryName
  const title =
    operation.notes && operation.notes.trim().length > 0
      ? operation.notes.trim()
      : operation.type === 'transfer'
        ? operation.counterAccount
          ? `Transfer to ${operation.counterAccount.name}`
          : 'Transfer'
        : categoryDisplay
  const showCategoryPill =
    Boolean(operation.category?.name) && title !== categoryDisplay

  return (
    <Link href={`/transactions/${operation.id}`} asChild>
      <Pressable>
        <Card className="border-0 bg-card/50 py-1">
          <CardContent className="px-3 py-2">
            <View className="flex-row items-center">
              <View
                className={cn(
                  'mr-3 h-6 w-6 items-center justify-center rounded-lg ring-1 ring-border/40 dark:ring-border/60',
                  'bg-muted/60 dark:bg-muted/40'
                )}
              >
                <Icon
                  as={IconComponent}
                  size={14}
                  className={config.colorClass}
                />
              </View>

              <View className="flex-1 gap-1">
                <View className="flex-row items-center justify-between">
                  <Text
                    className="mr-2 flex-1 text-sm font-medium text-foreground"
                    numberOfLines={1}
                  >
                    {title}
                  </Text>
                  <Text
                    className={cn('text-sm font-semibold', config.colorClass)}
                  >
                    {config.prefix}${operation.amount.toFixed(2)}
                  </Text>
                </View>

                <View className="flex-row items-center justify-between">
                  <View className="flex-1 flex-row items-center gap-2">
                    {showCategoryPill && (
                      <View className="rounded bg-muted/50 px-1.5 py-0.5">
                        <Text
                          className="text-[11px] font-medium text-muted-foreground"
                          numberOfLines={1}
                        >
                          {categoryName}
                        </Text>
                      </View>
                    )}
                    <View className="flex-row items-center gap-1">
                      <Icon
                        as={Calendar}
                        size={12}
                        className="text-muted-foreground"
                      />
                      <Text className="text-[11px] text-muted-foreground">
                        {formatDate(operation.txDate)}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-center">
                    {/* TODO: Add attachment support */}
                    <Icon
                      as={ArrowRight}
                      size={12}
                      className="ml-1 text-muted-foreground/60"
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
