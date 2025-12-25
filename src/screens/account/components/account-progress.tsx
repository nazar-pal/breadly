import { Card, CardContent } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { GetAccountResultItem } from '@/data/client/queries/get-account'
import { cn, getAccountProgress } from '@/lib/utils'
import React from 'react'
import { View } from 'react-native'

export function AccountProgress({
  account
}: {
  account: GetAccountResultItem
}) {
  if (account.type === 'payment') return null

  const { label, value: progress } = getAccountProgress(account)

  if (!progress) return null

  return (
    <Card className="bg-card/50 mb-4 border-0 shadow-none">
      <CardContent className="py-5">
        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-foreground text-base font-medium">
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
        <View className="bg-secondary h-2 overflow-hidden rounded-full">
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
          <Text className="text-muted-foreground mt-2 text-xs">{label}</Text>
        ) : null}
      </CardContent>
    </Card>
  )
}
