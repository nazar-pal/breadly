import AccountsHeader from '@/components/accounts/AccountsHeader'
import AccountsTabView from '@/components/accounts/AccountsTabView'
import EditAccountModal from '@/components/accounts/EditAccountModal'
import { mockAccounts } from '@/data/mockAccounts'
import { useAccountManagement } from '@/hooks/useAccountManagement'
import React from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function AccountsScreen() {
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
    <View
      className="flex-1 bg-old-background"
      style={{
        paddingTop: insets.top
      }}
    >
      <AccountsHeader />

      <AccountsTabView
        accounts={mockAccounts}
        onEditAccount={handleEditAccount}
        onAddAccount={handleAddAccount}
      />

      <EditAccountModal
        visible={editModalVisible}
        account={selectedAccount}
        onSave={handleSaveAccount}
        onClose={handleCloseModal}
      />
    </View>
  )
}
