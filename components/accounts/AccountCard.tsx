import { useTheme } from '@/context/ThemeContext';
import {
  BanknoteIcon,
  CreditCard,
  PiggyBank,
  Wallet,
} from 'lucide-react-native';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

interface AccountCardProps {
  account: {
    id: string;
    name: string;
    description: string;
    balance: number;
    type: 'payment' | 'savings' | 'debt';
    currency: string;
    targetAmount?: number;
    initialAmount?: number;
    dueDate?: string;
    interestRate?: number;
    institution?: string;
    person?: string;
    debtType?: 'owed' | 'owedTo';
  };
  onPress: () => void;
}

export default function AccountCard({ account, onPress }: AccountCardProps) {
  const { colors } = useTheme();

  const getIcon = () => {
    switch (account.type) {
      case 'payment':
        return account.name.toLowerCase().includes('credit')
          ? CreditCard
          : Wallet;
      case 'savings':
        return PiggyBank;
      case 'debt':
        return BanknoteIcon;
      default:
        return Wallet;
    }
  };

  const Icon = getIcon();

  const getProgressPercentage = () => {
    if (account.type === 'savings' && account.targetAmount) {
      return (account.balance / account.targetAmount) * 100;
    }
    if (account.type === 'debt' && account.initialAmount) {
      return ((account.initialAmount - account.balance) / account.initialAmount) * 100;
    }
    return null;
  };

  const progress = getProgressPercentage();

  const getBalanceColor = () => {
    if (account.type === 'debt') {
      return account.debtType === 'owed' ? colors.error : colors.success;
    }
    return account.balance >= 0 ? colors.success : colors.error;
  };

  return (
    <Pressable
      style={[styles.container, { backgroundColor: colors.card }]}
      onPress={onPress}
    >
      <View
        style={[styles.iconContainer, { backgroundColor: colors.secondary }]}
      >
        <Icon size={24} color={colors.text} />
      </View>

      <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
        {account.name}
      </Text>

      <Text
        style={[styles.description, { color: colors.textSecondary }]}
        numberOfLines={2}
      >
        {account.description}
      </Text>

      <Text style={[styles.balance, { color: getBalanceColor() }]}>
        {account.currency} {Math.abs(account.balance).toFixed(2)}
      </Text>

      {progress !== null && (
        <View
          style={[
            styles.progressContainer,
            { backgroundColor: colors.secondary },
          ]}
        >
          <View
            style={[
              styles.progressBar,
              {
                width: `${Math.min(progress, 100)}%`,
                backgroundColor:
                  account.type === 'debt' ? colors.error : colors.success,
              },
            ]}
          />
        </View>
      )}

      {account.type === 'savings' && account.targetAmount && (
        <Text style={[styles.target, { color: colors.textSecondary }]}>
          Target: {account.currency} {account.targetAmount.toFixed(2)}
        </Text>
      )}

      {account.type === 'debt' && account.dueDate && (
        <Text style={[styles.dueDate, { color: colors.textSecondary }]}>
          Due: {new Date(account.dueDate).toLocaleDateString()}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '48%',
    padding: 16,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
  },
  balance: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  progressContainer: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
  },
  target: {
    fontSize: 12,
  },
  dueDate: {
    fontSize: 12,
  },
});