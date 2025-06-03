import AccountsHeader from '@/components/accounts/AccountsHeader';
import AccountsTabView from '@/components/accounts/AccountsTabView';
import EditAccountModal from '@/components/accounts/EditAccountModal';
import { useTheme } from '@/context/ThemeContext';
import { mockAccounts } from '@/data/mockAccounts';
import { useAccountManagement } from '@/hooks/useAccountManagement';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AccountsScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const {
    editModalVisible,
    selectedAccount,
    handleEditAccount,
    handleAddAccount,
    handleSaveAccount,
    handleCloseModal,
  } = useAccountManagement();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
