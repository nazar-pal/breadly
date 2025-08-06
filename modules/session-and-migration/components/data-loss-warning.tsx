import { Icon } from '@/components/icon'
import { Text } from '@/components/ui/text'
import React from 'react'
import { View } from 'react-native'
import { useGetGuestDataStats } from '../data/queries'
import { useUserSession } from '../hooks'

export function DataLossWarning() {
  const { isGuest, userId } = useUserSession()
  const { data: stats, isLoading } = useGetGuestDataStats({ userId })

  if (isLoading || !stats || stats.total === 0 || !isGuest) return null

  return (
    <View className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800/30 dark:bg-blue-950/20">
      <View className="mb-2 flex-row items-center">
        <Icon
          name="Shield"
          size={16}
          className="mr-2 text-blue-600 dark:text-blue-400"
        />
        <Text className="font-medium text-blue-800 dark:text-blue-200">
          Protect your financial data
        </Text>
      </View>
      <Text className="mb-3 text-sm text-blue-700 dark:text-blue-300">
        Your {stats.total} items are currently stored only on this device.
        Create an account to unlock access to cloud synchronization and advanced
        AI features.
      </Text>
      <View className="flex-row flex-wrap gap-x-4 gap-y-1">
        {stats.transactions > 0 && (
          <Text className="text-xs text-blue-600 dark:text-blue-400">
            • {stats.transactions} transactions
          </Text>
        )}
        {stats.accounts > 0 && (
          <Text className="text-xs text-blue-600 dark:text-blue-400">
            • {stats.accounts} accounts
          </Text>
        )}
        {stats.categories > 0 && (
          <Text className="text-xs text-blue-600 dark:text-blue-400">
            • {stats.categories} categories
          </Text>
        )}
        {stats.budgets > 0 && (
          <Text className="text-xs text-blue-600 dark:text-blue-400">
            • {stats.budgets} budgets
          </Text>
        )}
      </View>
    </View>
  )
}
