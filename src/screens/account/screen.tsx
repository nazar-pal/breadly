import { Text } from '@/components/ui/text'
import { getAccount } from '@/data/client/queries'
import { useDrizzleQuery } from '@/lib/hooks'
import { useUserSession } from '@/system/session-and-migration'
import React from 'react'
import { ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { AccountHero } from './components/account-hero'
import { AccountInsights } from './components/account-insights'
import { AccountProgress } from './components/account-progress'
import { AccountTransactions } from './components/account-transactions'

export default function AccountScreen({ id }: { id: string }) {
  const insets = useSafeAreaInsets()

  const { userId } = useUserSession()
  const {
    data: [account],
    isLoading
  } = useDrizzleQuery(
    getAccount({
      userId,
      accountId: id
    })
  )

  if (isLoading) return null

  return (
    <ScrollView
      className="bg-background flex-1"
      contentContainerStyle={{
        padding: 16,
        paddingBottom: insets.bottom + 20
      }}
      showsVerticalScrollIndicator={false}
    >
      {account ? (
        <>
          <AccountHero account={account} />
          <AccountProgress account={account} />
          <AccountInsights account={account} />
          <AccountTransactions accountId={account.id} />
        </>
      ) : (
        <Text className="text-destructive mt-10 text-center text-lg">
          Account not found
        </Text>
      )}
    </ScrollView>
  )
}
