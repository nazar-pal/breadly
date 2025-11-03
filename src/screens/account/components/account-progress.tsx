import { Card, CardContent } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { AccountDetails } from '@/data/client/queries/use-get-account'
import { cn, getAccountProgress } from '@/lib/utils'
import React from 'react'
import { View } from 'react-native'

export function AccountProgress({ account }: { account: AccountDetails }) {
  if (account.type === 'payment') return null

  const { label, value: progress } = getAccountProgress(account)

  if (!progress) return null

  return (
    <Card className="mb-4 border-0 bg-card/50 shadow-none">
      <CardContent className="py-5">
        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-base font-medium text-foreground">
            {account.type === 'saving'
              ? 'Savings Progress'
              : 'Repayment Progress'}
          </Text>
          <Text
            className={cn(
              'text-2xl font-bold',
              account.type === 'saving' ? 'text-success' : 'text-destructive'
            )}
          >
            {progress.toFixed(1)}%
          </Text>
        </View>
        <View className="h-2 overflow-hidden rounded-full bg-secondary">
          <View
            className={cn(
              'h-full',
              account.type === 'saving'
                ? 'bg-emerald-500/30'
                : 'bg-destructive/30'
            )}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </View>
        {label ? (
          <Text className="mt-2 text-xs text-muted-foreground">{label}</Text>
        ) : null}
      </CardContent>
    </Card>
  )
}
