import AccountSection from '@/components/accounts/AccountSection'
import EditAccountModal from '@/components/accounts/EditAccountModal'
import { mockAccounts } from '@/data/mockAccounts'
import { useAccountManagement } from '@/hooks/useAccountManagement'
import React from 'react'
import { ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function PaymentsScreen() {
  const insets = useSafeAreaInsets()
  const {
    editModalVisible,
    selectedAccount,
    handleEditAccount,
    handleAddAccount,
    handleSaveAccount,
    handleCloseModal
  } = useAccountManagement()

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
          accounts={mockAccounts.payment}
          accountType="payment"
          onEditAccount={handleEditAccount}
          onAddAccount={handleAddAccount}
        />
      </ScrollView>

      <EditAccountModal
        visible={editModalVisible}
        account={selectedAccount}
        onSave={handleSaveAccount}
        onClose={handleCloseModal}
      />
    </View>
  )
}
