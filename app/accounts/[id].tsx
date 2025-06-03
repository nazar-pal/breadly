import AccountOperationCard from '@/components/accounts/AccountOperationCard';
import EditAccountModal from '@/components/accounts/EditAccountModal';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useTheme } from '@/context/ThemeContext';
import { mockAccounts } from '@/data/mockAccounts';
import { mockAccountOperations } from '@/data/mockData';
import { useAccountManagement } from '@/hooks/useAccountManagement';
import { useLocalSearchParams } from 'expo-router';
import {
  Calendar,
  CreditCard,
  DollarSign,
  Edit2,
  PiggyBank,
  Target,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AccountDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const {
    editModalVisible,
    selectedAccount,
    handleEditAccount,
    handleSaveAccount,
    handleCloseModal,
  } = useAccountManagement();

  // Find the account
  const allAccounts = [
    ...mockAccounts.payment,
    ...mockAccounts.savings,
    ...mockAccounts.debt,
  ];
  const account = allAccounts.find((acc) => acc.id === id);

  // Get account operations
  const accountOperations = mockAccountOperations
    .filter((op) => op.accountId === id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10); // Show last 10 operations

  if (!account) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>
          Account not found
        </Text>
      </View>
    );
  }

  const getAccountIcon = () => {
    switch (account.type) {
      case 'payment':
        return account.name.toLowerCase().includes('credit')
          ? CreditCard
          : Wallet;
      case 'savings':
        return PiggyBank;
      case 'debt':
        return DollarSign;
      default:
        return Wallet;
    }
  };

  const getTypeColor = () => {
    switch (account.type) {
      case 'payment':
        return colors.primary;
      case 'savings':
        return colors.success;
      case 'debt':
        return colors.error;
      default:
        return colors.primary;
    }
  };

  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: account.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(amount));
  };

  const getProgressPercentage = () => {
    if (account.type === 'savings' && account.targetAmount) {
      return (account.balance / account.targetAmount) * 100;
    }
    if (account.type === 'debt' && account.initialAmount) {
      return (
        ((account.initialAmount - account.balance) / account.initialAmount) *
        100
      );
    }
    return null;
  };

  const Icon = getAccountIcon();
  const typeColor = getTypeColor();
  const progress = getProgressPercentage();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Account Header Card */}
        <Card style={[styles.headerCard, { borderLeftColor: typeColor }]}>
          <View style={styles.accountHeader}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: typeColor + '20' },
              ]}
            >
              <Icon size={24} color={typeColor} />
            </View>
            <View style={styles.accountInfo}>
              <Text style={[styles.accountName, { color: colors.text }]}>
                {account.name}
              </Text>
              <Text
                style={[styles.accountType, { color: colors.textSecondary }]}
              >
                {account.type.charAt(0).toUpperCase() + account.type.slice(1)}{' '}
                Account
              </Text>
            </View>
            <Button
              variant="outline"
              size="sm"
              onPress={() => handleEditAccount(account)}
              leftIcon={<Edit2 size={16} color={colors.text} />}
            >
              Edit
            </Button>
          </View>

          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {account.description}
          </Text>

          {/* Balance Section */}
          <View style={styles.balanceSection}>
            <Text
              style={[styles.balanceLabel, { color: colors.textSecondary }]}
            >
              Current Balance
            </Text>
            <View style={styles.balanceRow}>
              <Text style={[styles.balance, { color: typeColor }]}>
                {account.balance < 0 && account.type === 'payment' ? '-' : ''}
                {formatBalance(account.balance)}
              </Text>
              {account.balance > 0 && account.type === 'savings' && (
                <TrendingUp size={20} color={colors.success} />
              )}
              {account.balance < 0 && account.type === 'payment' && (
                <TrendingDown size={20} color={colors.error} />
              )}
            </View>
          </View>

          {/* Progress Section */}
          {progress !== null && (
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text
                  style={[
                    styles.progressLabel,
                    { color: colors.textSecondary },
                  ]}
                >
                  {account.type === 'savings'
                    ? 'Savings Progress'
                    : 'Repayment Progress'}
                </Text>
                <Text style={[styles.progressText, { color: colors.text }]}>
                  {progress.toFixed(1)}%
                </Text>
              </View>
              <View
                style={[
                  styles.progressBar,
                  { backgroundColor: colors.secondary },
                ]}
              >
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.min(progress, 100)}%`,
                      backgroundColor: typeColor,
                    },
                  ]}
                />
              </View>
            </View>
          )}

          {/* Additional Info */}
          <View style={styles.additionalInfo}>
            {account.type === 'savings' && account.targetAmount && (
              <View style={styles.infoRow}>
                <Target size={16} color={colors.textSecondary} />
                <Text
                  style={[styles.infoLabel, { color: colors.textSecondary }]}
                >
                  Target Amount
                </Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {formatBalance(account.targetAmount)}
                </Text>
              </View>
            )}
            {account.type === 'debt' && account.dueDate && (
              <View style={styles.infoRow}>
                <Calendar size={16} color={colors.textSecondary} />
                <Text
                  style={[styles.infoLabel, { color: colors.textSecondary }]}
                >
                  Due Date
                </Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {new Date(account.dueDate).toLocaleDateString()}
                </Text>
              </View>
            )}
            {account.type === 'debt' && account.interestRate && (
              <View style={styles.infoRow}>
                <DollarSign size={16} color={colors.textSecondary} />
                <Text
                  style={[styles.infoLabel, { color: colors.textSecondary }]}
                >
                  Interest Rate
                </Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {account.interestRate}%
                </Text>
              </View>
            )}
          </View>
        </Card>

        {/* Recent Operations */}
        <View style={styles.operationsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Recent Activity
          </Text>
          {accountOperations.length > 0 ? (
            accountOperations.map((operation) => (
              <AccountOperationCard key={operation.id} operation={operation} />
            ))
          ) : (
            <Card>
              <Text
                style={[
                  styles.noOperationsText,
                  { color: colors.textSecondary },
                ]}
              >
                No recent activity for this account
              </Text>
            </Card>
          )}
        </View>
      </ScrollView>

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
  scrollContent: {
    padding: 16,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 40,
  },
  headerCard: {
    borderLeftWidth: 4,
    marginBottom: 24,
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2,
  },
  accountType: {
    fontSize: 14,
    textTransform: 'capitalize',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  balanceSection: {
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  balance: {
    fontSize: 32,
    fontWeight: '800',
  },
  progressSection: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  additionalInfo: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoLabel: {
    fontSize: 14,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  operationsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  noOperationsText: {
    textAlign: 'center',
    fontSize: 14,
    fontStyle: 'italic',
  },
});
