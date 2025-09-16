import { Text } from '@/components/ui/text'
import { AccountDetailsScreen, useGetAccount } from '@/modules/account/'
import { useUserSession } from '@/system/session-and-migration'
import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import { ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function Screen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const insets = useSafeAreaInsets()

  const { userId } = useUserSession()
  const { data: accounts, isLoading } = useGetAccount({
    userId,
    accountId: id
  })
  const account = accounts?.length ? accounts[0] : undefined

  if (isLoading) return null

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{
        padding: 16,
        paddingBottom: insets.bottom + 20
      }}
      showsVerticalScrollIndicator={false}
    >
      {account ? (
        <AccountDetailsScreen account={account} />
      ) : (
        <Text className="mt-10 text-center text-lg text-destructive">
          Account not found
        </Text>
      )}
    </ScrollView>
  )
}
