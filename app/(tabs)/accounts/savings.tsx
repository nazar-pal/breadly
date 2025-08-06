import { AccountSection } from '@/components/accounts/account-section'
import { useAccountsUI } from '@/components/accounts/lib/use-accounts-UI'
import { useGetAccounts } from '@/lib/powersync/data/queries'
import { useUserSession } from '@/modules/session-and-migration'
import React from 'react'
import { ActivityIndicator, ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function SavingsScreen() {
  const insets = useSafeAreaInsets()
  const { userId } = useUserSession()
  const { data: savingAccounts, isLoading } = useGetAccounts({
    userId,
    accountType: 'saving'
  })
  const { handleEditAccount, handleAddAccount } = useAccountsUI()

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          { paddingHorizontal: 16, paddingTop: 8 },
          { paddingBottom: insets.bottom + 20 }
        ]}
      >
        <AccountSection
          title="Savings Accounts"
          accounts={savingAccounts}
          accountType="saving"
          onEditAccount={handleEditAccount}
          onAddAccount={handleAddAccount}
        />
      </ScrollView>
    </View>
  )
}
