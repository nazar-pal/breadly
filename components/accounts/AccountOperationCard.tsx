import { useTheme } from '@/context/ThemeContext';
import {
  ArrowDown,
  Calendar,
  CreditCard,
  RefreshCw,
  TrendingDown,
  TrendingUp,
} from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface AccountOperation {
  id: string;
  accountId: string;
  amount: number;
  category: string;
  date: string;
  description: string;
  type: 'expense' | 'income' | 'payment' | 'transfer';
}

interface AccountOperationCardProps {
  operation: AccountOperation;
}

const getOperationIcon = (type: string) => {
  switch (type) {
    case 'income':
      return TrendingUp;
    case 'expense':
      return TrendingDown;
    case 'payment':
      return CreditCard;
    case 'transfer':
      return RefreshCw;
    default:
      return ArrowDown;
  }
};

const getOperationColor = (type: string, amount: number, colors: any) => {
  if (amount > 0) {
    return colors.success;
  } else {
    return colors.error;
  }
};

export default function AccountOperationCard({
  operation,
}: AccountOperationCardProps) {
  const { colors } = useTheme();
  const IconComponent = getOperationIcon(operation.type);
  const operationColor = getOperationColor(
    operation.type,
    operation.amount,
    colors,
  );
  const isPositive = operation.amount > 0;

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.content}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: operationColor + '20' },
          ]}
        >
          <IconComponent size={16} color={operationColor} />
        </View>

        <View style={styles.operationInfo}>
          <Text
            style={[styles.description, { color: colors.text }]}
            numberOfLines={1}
          >
            {operation.description}
          </Text>
          <View style={styles.metaInfo}>
            <View style={styles.categoryContainer}>
              <Text style={[styles.category, { color: colors.textSecondary }]}>
                {operation.category}
              </Text>
            </View>
            <View style={styles.dateContainer}>
              <Calendar size={10} color={colors.textSecondary} />
              <Text style={[styles.date, { color: colors.textSecondary }]}>
                {formatDate(operation.date)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.amountContainer}>
          <Text style={[styles.amount, { color: operationColor }]}>
            {isPositive ? '+' : ''}
            {formatAmount(operation.amount)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  operationInfo: {
    flex: 1,
    minWidth: 0,
  },
  description: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  category: {
    fontSize: 11,
    fontWeight: '500',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  date: {
    fontSize: 11,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 14,
    fontWeight: '700',
  },
});
