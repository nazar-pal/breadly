import AccountSection from '@/components/accounts/AccountSection'
import DebtAccountModal from '@/components/accounts/DebtAccountModal'
import { useAccounts } from '@/hooks/useAccounts'
import { useAccountsUI } from '@/hooks/useAccountsUI'
import React from 'react'
import { ActivityIndicator, ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function DebtScreen() {
  const insets = useSafeAreaInsets()
  const { debtAccounts, isLoading } = useAccounts()
  const {
    editModalVisible,
    selectedAccount,
    selectedAccountType,
    handleEditAccount,
    handleAddAccount,
    handleCloseModal
  } = useAccountsUI()

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
          title="Debt Accounts"
          accounts={debtAccounts}
          accountType="debt"
          onEditAccount={handleEditAccount}
          onAddAccount={handleAddAccount}
        />
      </ScrollView>

      <DebtAccountModal
        visible={editModalVisible}
        account={selectedAccount}
        onClose={handleCloseModal}
      />
    </View>
  )
}
