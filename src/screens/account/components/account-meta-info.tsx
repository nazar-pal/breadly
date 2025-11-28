import { Card, CardContent } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { GetAccountResultItem } from '@/data/client/queries/get-account'
import { formatCurrency } from '@/lib/utils'
import React from 'react'
import { View } from 'react-native'

export function AccountMetaInfo({
  account
}: {
  account: GetAccountResultItem
}) {
  return (
    <Card className="bg-card/50 mb-4 border-0 shadow-none">
      <CardContent className="py-4">
        <View className="gap-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-muted-foreground text-sm">Currency</Text>
            <Text className="text-foreground text-sm font-medium">
              {account.currencyId || 'USD'}
            </Text>
          </View>
          {account.createdAt ? (
            <View className="flex-row items-center justify-between">
              <Text className="text-muted-foreground text-sm">Created</Text>
              <Text className="text-foreground text-sm font-medium">
                {account.createdAt.toLocaleDateString()}
              </Text>
            </View>
          ) : null}
          {account.type === 'saving' && account.savingsTargetAmount ? (
            <View className="flex-row items-center justify-between">
              <Text className="text-muted-foreground text-sm">Target</Text>
              <Text className="text-foreground text-sm font-medium">
                {formatCurrency(
                  account.savingsTargetAmount,
                  account.currencyId || 'USD'
                )}
              </Text>
            </View>
          ) : null}
          {account.type === 'saving' && account.savingsTargetDate ? (
            <View className="flex-row items-center justify-between">
              <Text className="text-muted-foreground text-sm">Target date</Text>
              <Text className="text-foreground text-sm font-medium">
                {account.savingsTargetDate.toLocaleDateString()}
              </Text>
            </View>
          ) : null}
          {account.type === 'debt' && account.debtInitialAmount ? (
            <View className="flex-row items-center justify-between">
              <Text className="text-muted-foreground text-sm">
                Initial amount
              </Text>
              <Text className="text-foreground text-sm font-medium">
                {formatCurrency(
                  account.debtInitialAmount,
                  account.currencyId || 'USD'
                )}
              </Text>
            </View>
          ) : null}
          {account.type === 'debt' && account.debtDueDate ? (
            <View className="flex-row items-center justify-between">
              <Text className="text-muted-foreground text-sm">Due date</Text>
              <Text className="text-foreground text-sm font-medium">
                {account.debtDueDate.toLocaleDateString()}
              </Text>
            </View>
          ) : null}
        </View>
      </CardContent>
    </Card>
  )
}
