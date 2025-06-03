import { useTheme } from '@/context/ThemeContext';
import {
  Banknote as BanknoteIcon,
  Calendar,
  CreditCard,
  PiggyBank,
  Target,
  TrendingDown,
  TrendingUp,
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

  const Icon = getIcon();
  const typeColor = getTypeColor();

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

  const progress = getProgressPercentage();

  const getBalanceColor = () => {
    if (account.type === 'debt') {
      return account.debtType === 'owed' ? colors.error : colors.success;
    }
    return account.balance >= 0 ? colors.text : colors.error;
  };

  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: account.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(Math.abs(amount));
  };

  const getSecondaryInfo = () => {
    if (account.type === 'savings' && account.targetAmount) {
      return {
        icon: Target,
        text: formatBalance(account.targetAmount),
        label: 'Target',
      };
    }
    if (account.type === 'debt' && account.dueDate) {
      return {
        icon: Calendar,
        text: new Date(account.dueDate).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        label: 'Due',
      };
    }
    return null;
  };

  const secondaryInfo = getSecondaryInfo();

  return (
    <Pressable
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderLeftColor: typeColor,
        },
      ]}
      onPress={onPress}
    >
      {/* Header Row */}
      <View style={styles.header}>
        <View
          style={[styles.iconContainer, { backgroundColor: typeColor + '20' }]}
        >
          <Icon size={16} color={typeColor} />
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {account.name}
          </Text>
          <Text style={[styles.type, { color: colors.textSecondary }]}>
            {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
          </Text>
        </View>
        <View style={styles.balanceContainer}>
          {account.balance < 0 && account.type === 'payment' && (
            <TrendingDown
              size={12}
              color={colors.error}
              style={styles.trendIcon}
            />
          )}
          {account.balance > 0 && account.type === 'savings' && (
            <TrendingUp
              size={12}
              color={colors.success}
              style={styles.trendIcon}
            />
          )}
          <Text style={[styles.balance, { color: getBalanceColor() }]}>
            {formatBalance(account.balance)}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      {progress !== null && (
        <View style={styles.progressSection}>
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
                  backgroundColor: typeColor,
                },
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>
            {progress.toFixed(0)}%
          </Text>
        </View>
      )}

      {/* Footer with secondary info */}
      {secondaryInfo && (
        <View style={styles.footer}>
          <View style={styles.secondaryInfo}>
            <secondaryInfo.icon size={10} color={colors.textSecondary} />
            <Text
              style={[styles.secondaryLabel, { color: colors.textSecondary }]}
            >
              {secondaryInfo.label}
            </Text>
          </View>
          <Text
            style={[styles.secondaryValue, { color: colors.textSecondary }]}
          >
            {secondaryInfo.text}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 3,
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
    minWidth: 0, // Ensures text truncation works
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 1,
  },
  type: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendIcon: {
    marginRight: 2,
  },
  balance: {
    fontSize: 16,
    fontWeight: '700',
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressContainer: {
    flex: 1,
    height: 3,
    borderRadius: 1.5,
    overflow: 'hidden',
    marginRight: 8,
  },
  progressBar: {
    height: '100%',
  },
  progressText: {
    fontSize: 10,
    fontWeight: '500',
    minWidth: 30,
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  secondaryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  secondaryLabel: {
    fontSize: 11,
    marginLeft: 3,
  },
  secondaryValue: {
    fontSize: 11,
    fontWeight: '500',
  },
});
