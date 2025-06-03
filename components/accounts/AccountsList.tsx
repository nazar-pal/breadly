import { useTheme } from '@/context/ThemeContext';
import type { Account } from '@/hooks/useAccountManagement';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AccountSection from './AccountSection';

interface AccountsListProps {
  accounts: {
    payment: Account[];
    savings: Account[];
    debt: Account[];
  };
  onEditAccount: (account: Account) => void;
  onAddAccount: (type: 'payment' | 'savings' | 'debt') => void;
}

export default function AccountsList({
  accounts,
  onEditAccount,
  onAddAccount,
}: AccountsListProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.content}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingBottom: insets.bottom + 20 },
      ]}
    >
      <AccountSection
        title="Payment Accounts"
        accounts={accounts.payment}
        accountType="payment"
        onEditAccount={onEditAccount}
        onAddAccount={onAddAccount}
      />

      <AccountSection
        title="Savings Accounts"
        accounts={accounts.savings}
        accountType="savings"
        onEditAccount={onEditAccount}
        onAddAccount={onAddAccount}
      />

      <AccountSection
        title="Debt Accounts"
        accounts={accounts.debt}
        accountType="debt"
        onEditAccount={onEditAccount}
        onAddAccount={onAddAccount}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
});
