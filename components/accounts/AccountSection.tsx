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
        return 'Add Payment Account';
      case 'savings':
        return 'Add Savings Account';
      case 'debt':
        return 'Add Debt Account';
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
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  accountsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
});
