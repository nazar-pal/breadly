import { Icon } from '@/components/ui/lucide-icon'
import { cn, formatCurrency } from '@/lib/utils'
import { Link } from 'expo-router'
import {
  ArrowRightLeft,
  ChevronRight,
  TrendingDown,
  TrendingUp
} from 'lucide-react-native'
import React from 'react'
import { Pressable, Text, View, useColorScheme } from 'react-native'
import type { Transaction } from '../lib/types'

interface TransactionItemProps {
  transaction: Transaction
}

interface TypeConfig {
  icon: typeof TrendingUp
  colorClass: string
  iconBgClass: string
  amountColorClass: string
  prefix: string
  accentColor: string
}

const TYPE_CONFIGS: Record<string, TypeConfig> = {
  income: {
    icon: TrendingUp,
    colorClass: 'text-income',
    iconBgClass: 'bg-income/15 dark:bg-income/20',
    amountColorClass: 'text-income',
    prefix: '+',
    accentColor: '#10b981'
  },
  expense: {
    icon: TrendingDown,
    colorClass: 'text-destructive',
    iconBgClass: 'bg-destructive/15 dark:bg-destructive/20',
    amountColorClass: 'text-destructive',
    prefix: '-',
    accentColor: '#ef4444'
  },
  transfer: {
    icon: ArrowRightLeft,
    colorClass: 'text-primary',
    iconBgClass: 'bg-primary/15 dark:bg-primary/20',
    amountColorClass: 'text-foreground',
    prefix: '',
    accentColor: '#8b5cf6'
  }
}

function getTypeConfig(type: string): TypeConfig {
  return TYPE_CONFIGS[type] || TYPE_CONFIGS.expense
}

function formatDate(date: Date) {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday'
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const config = getTypeConfig(transaction.type)
  const IconComponent = config.icon

  const currencyCode =
    transaction.currencyId || transaction.account?.currencyId || 'USD'

  // Determine display title - show parent category or notes, NOT the subcategory
  const parentCategoryName = transaction.category?.parent?.name || null
  const categoryName = transaction.category?.name || 'Uncategorized'

  // Title: notes > parent category > category name (for top-level categories)
  const title =
    transaction.notes && transaction.notes.trim().length > 0
      ? transaction.notes.trim()
      : transaction.type === 'transfer'
        ? transaction.counterAccount
          ? `To ${transaction.counterAccount.name}`
          : 'Transfer'
        : parentCategoryName || categoryName

  // Subtitle: show subcategory if there's a parent, otherwise empty
  const subtitle = parentCategoryName ? categoryName : null

  const formattedAmount = formatCurrency(transaction.amount, currencyCode)
  const amountDisplay =
    config.prefix + formattedAmount.replace(/^-/, '').replace(/^\+/, '')

  return (
    <Link href={`/transactions/${transaction.id}`} asChild>
      <Pressable
        className={cn(
          'active:opacity-70',
          'mb-1.5 overflow-hidden rounded-xl',
          isDark
            ? 'bg-secondary/30 active:bg-secondary/50'
            : 'bg-card active:bg-muted/40'
        )}
        style={{
          borderLeftWidth: 2.5,
          borderLeftColor: config.accentColor
        }}
      >
        <View className="flex-row items-center px-3 py-2.5">
          {/* Icon */}
          <View
            className={cn(
              'mr-2.5 h-8 w-8 items-center justify-center rounded-lg',
              config.iconBgClass
            )}
          >
            <Icon as={IconComponent} size={15} className={config.colorClass} />
          </View>

          {/* Content */}
          <View className="mr-2 flex-1">
            <View className="flex-row items-center justify-between">
              <Text
                className={cn(
                  'mr-2 flex-1 text-[13px] font-semibold',
                  isDark ? 'text-white' : 'text-foreground'
                )}
                numberOfLines={1}
              >
                {title}
              </Text>
              <Text
                className={cn('text-[13px] font-bold', config.amountColorClass)}
              >
                {amountDisplay}
              </Text>
            </View>

            <View className="mt-0.5 flex-row items-center justify-between">
              <Text
                className={cn(
                  'text-[11px]',
                  isDark ? 'text-white/45' : 'text-muted-foreground'
                )}
              >
                {subtitle ? `${subtitle} · ` : ''}
                {formatDate(transaction.txDate)}
              </Text>
              <Icon
                as={ChevronRight}
                size={14}
                className={
                  isDark ? 'text-white/25' : 'text-muted-foreground/40'
                }
              />
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  )
}
