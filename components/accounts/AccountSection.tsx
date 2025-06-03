import { useTheme } from '@/context/ThemeContext';
import type { Account } from '@/hooks/useAccountManagement';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AccountCard from './AccountCard';
import AddAccountButton from './AddAccountButton';

interface AccountSectionProps {
  title: string;
  accounts: Account[];
  accountType: 'payment' | 'savings' | 'debt';
  onEditAccount: (account: Account) => void;
  onAddAccount: (type: 'payment' | 'savings' | 'debt') => void;
}

export default function AccountSection({
  title,
  accounts,
  accountType,
  onEditAccount,
  onAddAccount,
}: AccountSectionProps) {
  const { colors } = useTheme();

  const getAddButtonLabel = () => {
    switch (accountType) {
      case 'payment':
        return 'Add Payment';
      case 'savings':
        return 'Add Savings';
      case 'debt':
        return 'Add Debt';
      default:
        return 'Add Account';
    }
  };

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      <View style={styles.accountsGrid}>
        {accounts.map((account) => (
          <AccountCard
            key={account.id}
            account={account}
            onPress={() => onEditAccount(account)}
          />
        ))}
        <AddAccountButton
          onPress={() => onAddAccount(accountType)}
          label={getAddButtonLabel()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  accountsGrid: {
    flexDirection: 'column',
  },
});
