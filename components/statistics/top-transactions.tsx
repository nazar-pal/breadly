import { Card, CardContent } from '@/components/ui/card'
import React from 'react'
import { Text, View } from 'react-native'
import { mockStats } from './data-mock'

export function TopTransactions() {
  return (
    <View className="mb-6">
      <Text className="mb-4 text-lg font-semibold text-foreground">
        Recent Transactions
      </Text>
      {mockStats.topTransactions.map(transaction => (
        <Card key={transaction.id} className="mb-3">
          <CardContent className="p-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-base font-semibold text-foreground">
                  {transaction.description}
                </Text>
                <Text className="mt-1 text-sm text-muted-foreground">
                  {transaction.category}
                </Text>
              </View>
              <Text className="text-base font-semibold text-primary">
                ${transaction.amount.toFixed(2)}
              </Text>
            </View>
          </CardContent>
        </Card>
      ))}
    </View>
  )
}
