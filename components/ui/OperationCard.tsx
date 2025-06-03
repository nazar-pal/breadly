import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';
import {
  ArrowRight,
  Calendar,
  CreditCard,
  Mic,
  Receipt,
  RefreshCw,
  TrendingDown,
  TrendingUp,
} from 'lucide-react-native';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Card from './Card';

export type OperationType = 'expense' | 'income' | 'debt' | 'other';

interface BaseOperation {
  id: string;
  amount: number;
  category: string;
  date: string;
  description: string;
  hasPhoto?: boolean;
  hasVoice?: boolean;
}

interface ExpenseOperation extends BaseOperation {
  type: 'expense';
}

interface IncomeOperation extends BaseOperation {
  type: 'income';
}

interface DebtOperation extends BaseOperation {
  type: 'debt';
  debtType: 'paid' | 'received';
  creditor?: string;
  debtor?: string;
}

interface OtherOperation extends BaseOperation {
  type: 'other';
  transactionType: 'fee' | 'refund' | 'exchange';
}

type Operation =
  | ExpenseOperation
  | IncomeOperation
  | DebtOperation
  | OtherOperation;

export type { Operation };

interface OperationCardProps {
  operation: Operation;
}

const getOperationIcon = (operation: Operation) => {
  switch (operation.type) {
    case 'income':
      return TrendingUp;
    case 'debt':
      return operation.debtType === 'paid' ? TrendingDown : TrendingUp;
    case 'other':
      switch (operation.transactionType) {
        case 'fee':
          return CreditCard;
        case 'refund':
          return TrendingUp;
        case 'exchange':
          return RefreshCw;
        default:
          return CreditCard;
      }
    default:
      return TrendingDown; // expenses
  }
};

const getOperationColor = (operation: Operation, colors: any) => {
  switch (operation.type) {
    case 'income':
      return colors.success;
    case 'debt':
      return operation.debtType === 'paid' ? colors.error : colors.success;
    case 'other':
      return operation.transactionType === 'refund'
        ? colors.success
        : colors.primary;
    default:
      return colors.error; // expenses
  }
};

const getAmountPrefix = (operation: Operation) => {
  switch (operation.type) {
    case 'income':
      return '+';
    case 'debt':
      return operation.debtType === 'paid' ? '-' : '+';
    case 'other':
      return operation.transactionType === 'refund' ? '+' : '-';
    default:
      return '-'; // expenses
  }
};

const getOperationSubtext = (operation: Operation) => {
  switch (operation.type) {
    case 'debt':
      if (operation.debtType === 'paid') {
        return operation.creditor
          ? `Paid to ${operation.creditor}`
          : 'Debt Payment';
      } else {
        return operation.debtor
          ? `Received from ${operation.debtor}`
          : 'Debt Received';
      }
    case 'other':
      switch (operation.transactionType) {
        case 'fee':
          return 'Transaction Fee';
        case 'refund':
          return 'Refund Received';
        case 'exchange':
          return 'Currency Exchange';
        default:
          return 'Other Transaction';
      }
    default:
      return null;
  }
};

export default function OperationCard({ operation }: OperationCardProps) {
  const { colors, spacing } = useTheme();
  const router = useRouter();

  const IconComponent = getOperationIcon(operation);
  const operationColor = getOperationColor(operation, colors);
  const amountPrefix = getAmountPrefix(operation);
  const subtext = getOperationSubtext(operation);

  const handlePress = () => {
    // Route based on operation type
    switch (operation.type) {
      case 'expense':
        router.push(`/expenses/${operation.id}`);
        break;
      case 'income':
        // TODO: Add income detail screen
        console.log('Income operation clicked:', operation.id);
        break;
      case 'debt':
        // TODO: Add debt detail screen
        console.log('Debt operation clicked:', operation.id);
        break;
      case 'other':
        // TODO: Add other transaction detail screen
        console.log('Other operation clicked:', operation.id);
        break;
    }
  };

  return (
    <Pressable onPress={handlePress}>
      <Card style={styles.container}>
        <View style={styles.content}>
          <View style={styles.leftContent}>
            <View style={styles.amountContainer}>
              <Text style={[styles.amount, { color: operationColor }]}>
                {amountPrefix}${operation.amount.toFixed(2)}
              </Text>
              <IconComponent
                size={16}
                color={operationColor}
                style={{ marginLeft: 6 }}
              />
            </View>
            <Text
              style={[styles.description, { color: colors.textSecondary }]}
              numberOfLines={2}
            >
              {operation.description}
            </Text>
            {subtext && (
              <Text
                style={[styles.subtext, { color: colors.textSecondary }]}
                numberOfLines={1}
              >
                {subtext}
              </Text>
            )}
            <View style={styles.metaContainer}>
              <View
                style={[
                  styles.categoryBadge,
                  { backgroundColor: colors.secondary },
                ]}
              >
                <Text style={[styles.categoryText, { color: colors.text }]}>
                  {operation.category}
                </Text>
              </View>
              <View style={[styles.dateContainer, { marginLeft: spacing.sm }]}>
                <Calendar size={14} color={colors.textSecondary} />
                <Text
                  style={[
                    styles.dateText,
                    { color: colors.textSecondary, marginLeft: 4 },
                  ]}
                >
                  {operation.date}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.rightContent}>
            <View style={styles.iconContainer}>
              {operation.hasPhoto && (
                <Receipt
                  size={16}
                  color={colors.textSecondary}
                  style={{ marginRight: 8 }}
                />
              )}
              {operation.hasVoice && (
                <Mic size={16} color={colors.textSecondary} />
              )}
            </View>
            <ArrowRight size={20} color={colors.primary} />
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    ...Platform.select({
      android: {
        elevation: 2,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    minHeight: 80,
  },
  leftContent: {
    flex: 1,
    marginRight: 16,
  },
  rightContent: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  amount: {
    fontSize: 18,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  subtext: {
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
  },
  iconContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
});
