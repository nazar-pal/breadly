import { Icon } from '@/components/ui/lucide-icon-by-name'
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
    <View className="mt-4 rounded-xl bg-white/15 p-4">
      <View className="mb-2 flex-row items-center">
        <Icon name="Database" size={14} className="mr-2 text-white/80" />
        <Text className="text-sm font-medium text-white">
          {stats.total} items on this device
        </Text>
      </View>
      <View className="flex-row flex-wrap gap-x-3 gap-y-1">
        {stats.transactions > 0 && (
          <Text className="text-xs text-white/70">
            {stats.transactions} transactions
          </Text>
        )}
        {stats.accounts > 0 && (
          <Text className="text-xs text-white/70">
            {stats.accounts} accounts
          </Text>
        )}
        {stats.categories > 0 && (
          <Text className="text-xs text-white/70">
            {stats.categories} categories
          </Text>
        )}
        {stats.budgets > 0 && (
          <Text className="text-xs text-white/70">{stats.budgets} budgets</Text>
        )}
      </View>
    </View>
  )
}
