import { Progress } from '@/components/ui/progress'
import { Text } from '@/components/ui/text'
import React from 'react'
import { Pressable, View } from 'react-native'
import { type AccountItem } from '../../../data'
import {
  calculateAccountProgress,
  getAccountProgressLabel
} from '../../../lib/progress'
import { AccountCardShell } from './account-card-shell'

type Props = React.ComponentProps<typeof Pressable> & {
  account: AccountItem
}

export function AccountCardDebt({ account, ...rest }: Props) {
  const progress = calculateAccountProgress(account)
  const progressLabel = getAccountProgressLabel(account)
  const isReceivable = Boolean(account.debtIsOwedToMe)

  return (
    <AccountCardShell
      account={account}
      iconName="DollarSign"
      theme={{
        container: isReceivable
          ? 'border-emerald-500/40'
          : 'border-account-debt',
        iconWrapper: isReceivable ? 'bg-emerald-500/10' : 'bg-account-debt/10',
        icon: isReceivable ? 'text-emerald-600' : 'text-account-debt',
        balanceText: isReceivable ? 'text-emerald-600' : 'text-account-debt'
      }}
      footerContent={
        progress !== null ? (
          <View className="mt-2">
            {progressLabel ? (
              <View className="mb-1 flex-row items-center justify-between">
                <Text
                  className="text-xs text-muted-foreground"
                  numberOfLines={1}
                >
                  {progressLabel}
                </Text>
                <Text
                  className={
                    isReceivable
                      ? 'text-xs font-semibold text-emerald-600'
                      : 'text-xs font-semibold text-account-debt'
                  }
                >
                  {progress.toFixed(0)}%
                </Text>
              </View>
            ) : null}
            <Progress
              value={progress}
              className="h-2 w-full"
              indicatorClassName={
                isReceivable ? 'bg-emerald-500' : 'bg-account-debt'
              }
            />
          </View>
        ) : null
      }
      {...rest}
    />
  )
}
