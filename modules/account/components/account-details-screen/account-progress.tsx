import { Card, CardContent } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { cn } from '@/lib/utils'
import React from 'react'
import { View } from 'react-native'
import { AccountDetails } from '../../data/'
import { calculateAccountProgress } from '../../lib/progress'

export function AccountProgress({ account }: { account: AccountDetails }) {
  if (account.type === 'payment') return null

  const progress = calculateAccountProgress(account)

  if (!progress) return null

  return (
    <Card className="mb-4 border-0 bg-card/50 shadow-none">
      <CardContent className="py-6">
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-base font-medium text-foreground">
            {account.type === 'saving'
              ? 'Savings Progress'
              : 'Repayment Progress'}
          </Text>
          <Text className={cn('text-2xl font-bold', 'text-destructive')}>
            {progress.toFixed(1)}%
          </Text>
        </View>
        <View className="h-2 overflow-hidden rounded-full bg-secondary">
          <View
            className={cn('h-full', 'bg-destructive/10')}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </View>
      </CardContent>
    </Card>
  )
}
