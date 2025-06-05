import { useTheme } from '@/context/ThemeContext';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Card from './Card';

interface SummaryCardProps {
  title: string;
  amount: number;
  subtitle?: string;
  trend?: {
    percentage: number;
    isPositive: boolean;
  };
}

export default function SummaryCard({
  title,
  amount,
  subtitle,
  trend,
}: SummaryCardProps) {
  const { colors } = useTheme();

  return (
    <Card variant="elevated" size="md" style={styles.container}>
      <Text style={[styles.title, { color: colors.textSecondary }]}>
        {title}
      </Text>
      <Text style={[styles.amount, { color: colors.text }]}>
        ${amount.toFixed(2)}
      </Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {subtitle}
        </Text>
      )}
      {trend && (
        <View style={styles.trendContainer}>
          <Text
            style={[
              styles.trendText,
              {
                color: trend.isPositive ? colors.success : colors.error,
              },
            ]}
          >
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.percentage)}%
          </Text>
          <Text style={[styles.trendLabel, { color: colors.textSecondary }]}>
            vs last {title.toLowerCase()}
          </Text>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    flex: 1,
  },
  title: {
    fontSize: 14,
    marginBottom: 4,
  },
  amount: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  trendText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  trendLabel: {
    fontSize: 12,
  },
});
