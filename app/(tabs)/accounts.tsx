import AccountCard from '@/components/accounts/AccountCard';
import AddAccountButton from '@/components/accounts/AddAccountButton';
import EditAccountModal from '@/components/accounts/EditAccountModal';
import { useTheme } from '@/context/ThemeContext';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Mock data - replace with real data in production
const mockAccounts = {
  payment: [
    {
      id: '1',
      name: 'Main Checking',
      description: 'Primary bank account',
      balance: 5420.5,
      currency: 'USD',
      type: 'payment' as const,
    },
    {
      id: '2',
      name: 'Credit Card',
      description: 'Personal credit card',
      balance: -1250.75,
      currency: 'USD',
      type: 'payment' as const,
    },
  ],
  savings: [
    {
      id: '3',
      name: 'Emergency Fund',
      description: 'Emergency savings',
      balance: 10000,
      targetAmount: 15000,
      currency: 'USD',
      type: 'savings' as const,
    },
    {
      id: '4',
      name: 'Vacation Fund',
      description: 'Saving for summer vacation',
      balance: 2500,
      targetAmount: 5000,
      currency: 'USD',
      type: 'savings' as const,
    },
  ],
  debt: [
    {
      id: '5',
      name: 'Student Loan',
      description: 'Federal student loan',
      initialAmount: 25000,
      balance: 18500,
      dueDate: '2025-12-31',
      interestRate: 4.5,
      institution: 'Department of Education',
      currency: 'USD',
      type: 'debt' as const,
      debtType: 'owed' as const,
    },
    {
      id: '6',
      name: 'Friend Loan',
      description: 'Money lent to John',
      initialAmount: 500,
      balance: 500,
      dueDate: '2024-04-01',
      currency: 'USD',
      type: 'debt' as const,
      debtType: 'owedTo' as const,
      person: 'John Smith',
    },
  ],
};

export default function AccountsScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);

  const handleEditAccount = (account: any) => {
    setSelectedAccount(account);
    setEditModalVisible(true);
  };

  const handleAddAccount = (type: 'payment' | 'savings' | 'debt') => {
    setSelectedAccount({ type });
    setEditModalVisible(true);
  };

  const handleSaveAccount = (account: any) => {
    console.log('Save account:', account);
    setEditModalVisible(false);
    setSelectedAccount(null);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.screenTitle, { color: colors.text }]}>
          Accounts
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Payment Accounts */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Payment Accounts
          </Text>
          <View style={styles.accountsGrid}>
            {mockAccounts.payment.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                onPress={() => handleEditAccount(account)}
              />
            ))}
            <AddAccountButton
              onPress={() => handleAddAccount('payment')}
              label="Add Payment Account"
            />
          </View>
        </View>

        {/* Savings Accounts */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Savings Accounts
          </Text>
          <View style={styles.accountsGrid}>
            {mockAccounts.savings.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                onPress={() => handleEditAccount(account)}
              />
            ))}
            <AddAccountButton
              onPress={() => handleAddAccount('savings')}
              label="Add Savings Account"
            />
          </View>
        </View>

        {/* Debt Accounts */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Debt Accounts
          </Text>
          <View style={styles.accountsGrid}>
            {mockAccounts.debt.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                onPress={() => handleEditAccount(account)}
              />
            ))}
            <AddAccountButton
              onPress={() => handleAddAccount('debt')}
              label="Add Debt Account"
            />
          </View>
        </View>
      </ScrollView>

      <EditAccountModal
        visible={editModalVisible}
        account={selectedAccount}
        onSave={handleSaveAccount}
        onClose={() => {
          setEditModalVisible(false);
          setSelectedAccount(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
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
