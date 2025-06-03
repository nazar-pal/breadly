import Card from '@/components/ui/Card';
import ExpenseCard from '@/components/ui/ExpenseCard';
import SummaryCard from '@/components/ui/SummaryCard';
import { useTheme } from '@/context/ThemeContext';
import { mockExpenses, mockSummary } from '@/data/mockData';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DashboardScreen() {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();

  const todaysExpenses = mockExpenses.filter(
    (expense) => expense.date === '2025-03-01',
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.screenTitle, { color: colors.text }]}>
          Dashboard
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
      >
        <View style={styles.summaryContainer}>
          <SummaryCard
            title="Today"
            amount={mockSummary.today.total}
            subtitle={`${mockSummary.today.count} expenses`}
            trend={mockSummary.today.trend}
          />
          <View style={{ width: spacing.md }} />
          <SummaryCard
            title="This Week"
            amount={mockSummary.week.total}
            subtitle={`${mockSummary.week.count} expenses`}
            trend={mockSummary.week.trend}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Today&apos;s Expenses
          </Text>
          {todaysExpenses.length > 0 ? (
            todaysExpenses.map((expense) => (
              <ExpenseCard key={expense.id} expense={expense} />
            ))
          ) : (
            <Card>
              <Text
                style={{ color: colors.textSecondary, textAlign: 'center' }}
              >
                No expenses recorded today
              </Text>
            </Card>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Recent Expenses
          </Text>
          {mockExpenses.slice(0, 5).map((expense) => (
            <ExpenseCard key={expense.id} expense={expense} />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            This Month
          </Text>
          <Card style={styles.monthSummaryCard}>
            <View style={styles.monthSummaryContent}>
              <View>
                <Text
                  style={[styles.monthTitle, { color: colors.textSecondary }]}
                >
                  Total Spent
                </Text>
                <Text style={[styles.monthAmount, { color: colors.text }]}>
                  ${mockSummary.month.total.toFixed(2)}
                </Text>
              </View>
              <View>
                <Text
                  style={[styles.monthTitle, { color: colors.textSecondary }]}
                >
                  # of Expenses
                </Text>
                <Text style={[styles.monthCount, { color: colors.text }]}>
                  {mockSummary.month.count}
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.monthTrendContainer,
                { backgroundColor: colors.secondary },
              ]}
            >
              <Text
                style={[
                  styles.monthTrendText,
                  {
                    color: mockSummary.month.trend.isPositive
                      ? colors.success
                      : colors.error,
                  },
                ]}
              >
                {mockSummary.month.trend.isPositive ? '↑' : '↓'}{' '}
                {Math.abs(mockSummary.month.trend.percentage)}% vs last month
              </Text>
            </View>
          </Card>
        </View>
      </ScrollView>
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
  scrollContent: {
    paddingHorizontal: 16,
  },
  summaryContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  monthSummaryCard: {
    padding: 0,
  },
  monthSummaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  monthTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  monthAmount: {
    fontSize: 22,
    fontWeight: '700',
  },
  monthCount: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'right',
  },
  monthTrendContainer: {
    padding: 12,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  monthTrendText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});
