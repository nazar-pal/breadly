import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Icon, type IconName } from '@/components/ui/lucide-icon-by-name'
import { Text } from '@/components/ui/text'
import React from 'react'
import { View } from 'react-native'
import type { Transaction } from '../lib/types'
import { formatDate, formatDateTime } from '../lib/utils'
import { CategoryBadge } from './category-badge'

interface TransactionDetailsCardProps {
  transaction: Transaction
}

export function TransactionDetailsCard({
  transaction
}: TransactionDetailsCardProps) {
  const isTransfer = transaction.type === 'transfer'
  const currencyCode =
    transaction.currencyId || transaction.account?.currencyId || 'USD'

  const items: DetailItemProps[] = []

  // Account info
  if (isTransfer) {
    items.push({
      icon: 'Wallet',
      label: 'From',
      value: transaction.account?.name ?? '—'
    })
    items.push({
      icon: 'ArrowRight',
      label: 'To',
      value: transaction.counterAccount?.name ?? '—'
    })
  } else {
    items.push({
      icon: 'Wallet',
      label: 'Account',
      value: transaction.account?.name ?? '—'
    })
  }

  // Category
  items.push({
    icon: 'Tag',
    label: 'Category',
    customContent: (
      <CategoryBadge
        parentName={transaction.category?.parent?.name}
        parentIcon={transaction.category?.parent?.icon}
        childName={transaction.category?.name}
        childIcon={transaction.category?.icon}
      />
    )
  })

  // Date & Currency
  items.push({
    icon: 'Calendar',
    label: 'Date',
    value: formatDate(transaction.txDate)
  })

  items.push({
    icon: 'Banknote',
    label: 'Currency',
    value: currencyCode
  })

  // Created timestamp
  items.push({
    icon: 'Clock',
    label: 'Created',
    value: formatDateTime(new Date(transaction.createdAt as unknown as Date))
  })

  // Notes (optional)
  if (transaction.notes) {
    items.push({
      icon: 'FileText',
      label: 'Notes',
      value: transaction.notes
    })
  }

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle>Details</CardTitle>
      </CardHeader>
      <CardContent className="gap-0">
        {items.map((item, index) => (
          <DetailItem
            key={item.label}
            {...item}
            isFirst={index === 0}
            isLast={index === items.length - 1}
          />
        ))}
      </CardContent>
    </Card>
  )
}

interface DetailItemProps {
  icon: IconName
  label: string
  value?: string
  customContent?: React.ReactNode
  isFirst?: boolean
  isLast?: boolean
}

function DetailItem({
  icon,
  label,
  value,
  customContent,
  isFirst,
  isLast
}: DetailItemProps) {
  return (
    <View className="relative flex-row py-3">
      {/* Timeline connector */}
      <View className="mr-3 w-5 items-center">
        {!isFirst && <View className="bg-border absolute top-0 h-1/2 w-px" />}
        <View className="bg-primary h-2.5 w-2.5 rounded-full" />
        {!isLast && <View className="bg-border absolute bottom-0 h-1/2 w-px" />}
      </View>

      {/* Content */}
      <View className="flex-1">
        <View className="mb-1 flex-row items-center gap-1.5">
          <Icon name={icon} size={14} className="text-muted-foreground" />
          <Text className="text-muted-foreground text-xs">{label}</Text>
        </View>
        {customContent ? (
          <View className="mt-0.5">{customContent}</View>
        ) : (
          <Text className="text-foreground text-base font-medium">{value}</Text>
        )}
      </View>
    </View>
  )
}
