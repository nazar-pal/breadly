import AccountSection from '@/components/accounts/AccountSection'
import EditAccountModal from '@/components/accounts/EditAccountModal'
import { mockAccounts } from '@/data/mockAccounts'
import { useAccountManagement } from '@/hooks/useAccountManagement'
import React from 'react'
import { ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function DebtScreen() {
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
          title="Debt Accounts"
          accounts={mockAccounts.debt}
          accountType="debt"
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
