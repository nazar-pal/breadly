import { Card, CardContent } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon-by-name'
import { Text } from '@/components/ui/text'
import { AccountDetails } from '@/data/client/queries/use-get-account'
import { cn, formatCurrency } from '@/lib/utils'
import React from 'react'
import { View } from 'react-native'

export function AccountBalance({ account }: { account: AccountDetails }) {
  const { balance, type, description, currency } = account
  return (
    <Card className="mb-4 border-0 bg-card/50 shadow-none">
      <CardContent className="py-6">
        <Text className="mb-2 text-sm text-muted-foreground">
          Current Balance
        </Text>
        <View className="flex-row items-center gap-2">
          <Text
            className={cn(
              'text-[40px] font-extrabold leading-none tracking-tight'
            )}
          >
            {balance < 0 && type === 'payment' ? '-' : ''}
            {formatCurrency(
              balance,
              currency?.code ?? account.currencyId ?? 'USD'
            )}
          </Text>
          {balance > 0 && type === 'saving' && (
            <Icon name="TrendingUp" size={24} className="text-success" />
          )}
          {balance < 0 && type === 'payment' && (
            <Icon name="TrendingDown" size={24} className="text-destructive" />
          )}
        </View>
        {description && (
          <Text className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {description}
          </Text>
        )}
      </CardContent>
    </Card>
  )
}
