import AccountSection from '@/components/accounts/AccountSection'
import PaymentAccountModal from '@/components/accounts/moda-account-payment'
import { useAccounts } from '@/hooks/useAccounts'
import { useAccountsUI } from '@/hooks/useAccountsUI'
import React from 'react'
import { ActivityIndicator, ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function PaymentsScreen() {
  const insets = useSafeAreaInsets()
  const { paymentAccounts, isLoading } = useAccounts()
  const {
    editModalVisible,
    selectedAccount,
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
          title="Payment Accounts"
          accounts={paymentAccounts}
          accountType="payment"
          onEditAccount={handleEditAccount}
          onAddAccount={handleAddAccount}
        />
      </ScrollView>

      <PaymentAccountModal
        visible={editModalVisible}
        account={selectedAccount}
        onClose={handleCloseModal}
      />
    </View>
  )
}
