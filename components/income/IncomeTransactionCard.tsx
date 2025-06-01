import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import Card from '../ui/Card';
import { Calendar } from 'lucide-react-native';

interface IncomeTransactionCardProps {
  transaction: {
    id: string;
    amount: number;
    sourceId: string;
    sourceName: string;
    date: string;
    description: string;
  };
}

export default function IncomeTransactionCard({
  transaction,
}: IncomeTransactionCardProps) {
  const { colors } = useTheme();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <View style={styles.leftContent}>
          <Text style={[styles.amount, { color: colors.success }]}>
            +${transaction.amount.toFixed(2)}
          </Text>
          <Text style={[styles.description, { color: colors.text }]}>
            {transaction.description}
          </Text>
        </View>
        <View style={styles.rightContent}>
          <View
            style={[
              styles.sourceBadge,
              { backgroundColor: colors.secondary },
            ]}
          >
            <Text style={[styles.sourceText, { color: colors.text }]}>
              {transaction.sourceName}
            </Text>
          </View>
          <View style={styles.dateContainer}>
            <Calendar size={14} color={colors.textSecondary} />
            <Text
              style={[styles.dateText, { color: colors.textSecondary }]}
            >
              {formatDate(transaction.date)}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftContent: {
    flex: 1,
    marginRight: 12,
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
  },
  sourceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  sourceText: {
    fontSize: 12,
    fontWeight: '500',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    marginLeft: 4,
  },
});