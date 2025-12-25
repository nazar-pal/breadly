import { Card, CardContent } from '@/components/ui/card'
import { Icon } from '@/components/ui/lucide-icon-by-name'
import { Text } from '@/components/ui/text'
import { deleteTransaction } from '@/data/client/mutations'
import { cn } from '@/lib/utils'
import { formatCurrencyWithSign } from '@/lib/utils/format-currency'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Pressable, View } from 'react-native'
import type { Transaction } from '../lib/types'
import { formatDate, getTypeConfig, type TransactionType } from '../lib/utils'
import { CategoryBadge } from './category-badge'
import { Chip } from './chip'

interface TransactionHeroProps {
  transaction: Transaction
  userId: string
}

export function TransactionHero({ transaction, userId }: TransactionHeroProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = () => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true)
            try {
              const [error] = await deleteTransaction({
                transactionId: transaction.id,
                userId
              })
              if (error) {
                Alert.alert('Error', 'Failed to delete transaction.')
              } else {
                router.back()
              }
            } catch {
              Alert.alert('Error', 'Failed to delete transaction.')
            } finally {
              setIsDeleting(false)
            }
          }
        }
      ]
    )
  }
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
              <Icon
                name={typeConfig.icon}
                size={24}
                className={typeConfig.color}
              />
            </View>
            <View className="flex-1">
              <Text className="text-foreground text-3xl font-extrabold tracking-tight">
                {amountDisplay}
              </Text>
              <Text className="text-muted-foreground mt-0.5 text-sm">
                {formatDate(transaction.txDate)}
              </Text>
            </View>
            <Pressable
              onPress={handleDelete}
              disabled={isDeleting}
              className="bg-foreground/5 active:bg-foreground/10 h-9 w-9 items-center justify-center rounded-full"
            >
              <Icon
                name={isDeleting ? 'Loader2' : 'Trash2'}
                size={18}
                className="text-muted-foreground"
              />
            </Pressable>
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
              {transaction.type.charAt(0).toUpperCase() +
                transaction.type.slice(1)}
            </Chip>
            <Chip>{currencyCode}</Chip>
          </View>
        </CardContent>
      </LinearGradient>
    </Card>
  )
}
