import { Icon } from '@/components/ui/icon-by-name'
import { Progress } from '@/components/ui/progress'
import {
  calculateAccountProgress,
  getAccountProgressLabel
} from '@/modules/account/lib'
import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { type AccountItem } from '../../../data'
import { AccountCardShell } from './account-card-shell'

type Props = React.ComponentProps<typeof Pressable> & {
  account: AccountItem
}

export function AccountCardSaving({ account, ...rest }: Props) {
  const balanceAmount = account.balance || 0

  const progress = calculateAccountProgress(account)
  const progressLabel = getAccountProgressLabel(account)

  return (
    <AccountCardShell
      account={account}
      iconName="PiggyBank"
      theme={{
        container: 'border-account-savings',
        iconWrapper: 'bg-account-savings/10',
        icon: 'text-account-savings',
        balanceText: 'text-foreground'
      }}
      rightAccessory={
        balanceAmount > 0 ? (
          <Icon
            name="TrendingUp"
            size={12}
            className="mr-0.5 text-account-savings"
          />
        ) : null
      }
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
                <Text className="text-xs font-semibold text-account-savings">
                  {progress.toFixed(0)}%
                </Text>
              </View>
            ) : null}
            <Progress
              value={progress}
              className="h-2 w-full"
              indicatorClassName="bg-account-savings"
            />
          </View>
        ) : null
      }
      {...rest}
    />
  )
}
