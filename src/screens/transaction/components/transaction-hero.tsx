import { Card, CardContent } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import { cn } from '@/lib/utils'
import { formatCurrencyWithSign } from '@/lib/utils/format-currency'
import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { View } from 'react-native'
import type { Transaction } from '../lib/types'
import { formatDate, getTypeConfig, type TransactionType } from '../lib/utils'
import { CategoryBadge } from './category-badge'
import { Chip } from './chip'

interface TransactionHeroProps {
  transaction: Transaction
}

export function TransactionHero({ transaction }: TransactionHeroProps) {
  const currencyCode =
    transaction.currencyId || transaction.account?.currencyId || 'USD'

  const amountDisplay = formatCurrencyWithSign(
    transaction.type === 'expense' ? -transaction.amount : transaction.amount,
    currencyCode
  )

  const typeConfig = getTypeConfig(transaction.type as TransactionType)

  return (
    <Card className="mb-4 overflow-hidden border-0 bg-transparent shadow-none">
      <LinearGradient
        colors={typeConfig.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: 16 }}
      >
        <CardContent className="py-5">
          <View className="flex-row items-center">
            <View
              className={cn(
                'mr-3 h-12 w-12 items-center justify-center rounded-2xl',
                typeConfig.bg
              )}
            >
              <Icon name={typeConfig.icon} size={24} className={typeConfig.color} />
            </View>
            <View className="flex-1">
              <Text className="text-3xl font-extrabold tracking-tight text-foreground">
                {amountDisplay}
              </Text>
              <Text className="mt-0.5 text-sm text-muted-foreground">
                {formatDate(transaction.txDate)}
              </Text>
            </View>
          </View>

          <View className="mt-4 flex-row flex-wrap items-center gap-2">
            {transaction.category && (
              <CategoryBadge
                parentName={transaction.category.parent?.name}
                parentIcon={transaction.category.parent?.icon}
                childName={transaction.category.name}
                childIcon={transaction.category.icon}
              />
            )}
            <Chip>
              {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
            </Chip>
            <Chip>{currencyCode}</Chip>
          </View>
        </CardContent>
      </LinearGradient>
    </Card>
  )
}

