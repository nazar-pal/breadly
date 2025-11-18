import { Card, CardContent } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { AccountDetails } from '@/data/client/queries/use-get-account'
import { formatCurrency } from '@/lib/utils'
import React from 'react'
import { View } from 'react-native'

export function AccountMetaInfo({
  account
}: {
  account: Exclude<AccountDetails, undefined>
}) {
  return (
    <Card className="mb-4 border-0 bg-card/50 shadow-none">
      <CardContent className="py-4">
        <View className="gap-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-muted-foreground">Currency</Text>
            <Text className="text-sm font-medium text-foreground">
              {account.currencyId || 'USD'}
            </Text>
          </View>
          {account.createdAt ? (
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-muted-foreground">Created</Text>
              <Text className="text-sm font-medium text-foreground">
                {account.createdAt.toLocaleDateString()}
              </Text>
            </View>
          ) : null}
          {account.type === 'saving' && account.savingsTargetAmount ? (
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-muted-foreground">Target</Text>
              <Text className="text-sm font-medium text-foreground">
                {formatCurrency(
                  account.savingsTargetAmount,
                  account.currencyId || 'USD'
                )}
              </Text>
            </View>
          ) : null}
          {account.type === 'saving' && account.savingsTargetDate ? (
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-muted-foreground">Target date</Text>
              <Text className="text-sm font-medium text-foreground">
                {account.savingsTargetDate.toLocaleDateString()}
              </Text>
            </View>
          ) : null}
          {account.type === 'debt' && account.debtInitialAmount ? (
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-muted-foreground">
                Initial amount
              </Text>
              <Text className="text-sm font-medium text-foreground">
                {formatCurrency(
                  account.debtInitialAmount,
                  account.currencyId || 'USD'
                )}
              </Text>
            </View>
          ) : null}
          {account.type === 'debt' && account.debtDueDate ? (
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-muted-foreground">Due date</Text>
              <Text className="text-sm font-medium text-foreground">
                {account.debtDueDate.toLocaleDateString()}
              </Text>
            </View>
          ) : null}
        </View>
      </CardContent>
    </Card>
  )
}
