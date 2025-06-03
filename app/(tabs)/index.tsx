import Card from '@/components/ui/Card';
import OperationCard, { Operation } from '@/components/ui/OperationCard';
import { useTheme } from '@/context/ThemeContext';
import {
  mockDebtOperations,
  mockExpenses,
  mockIncomes,
  mockOtherTransactions,
} from '@/data/mockData';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type FilterType = 'all' | 'expense' | 'income' | 'debt' | 'other';

export default function OperationsScreen() {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // Combine all operations with type information
  const allOperations: Operation[] = useMemo(() => {
    const expenses = mockExpenses.map((expense) => ({
      ...expense,
      type: 'expense' as const,
    }));

    const incomes = mockIncomes.map((income) => ({
      ...income,
      type: 'income' as const,
    }));

    const debts = mockDebtOperations.map((debt) => ({
      ...debt,
      type: 'debt' as const,
    }));

    const others = mockOtherTransactions.map((transaction) => ({
      ...transaction,
      type: 'other' as const,
    }));

    // Combine and sort by date (newest first)
    return [...expenses, ...incomes, ...debts, ...others].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, []);

  // Filter operations based on active filter
  const filteredOperations = useMemo(() => {
    if (activeFilter === 'all') {
      return allOperations;
    }
    return allOperations.filter((operation) => operation.type === activeFilter);
  }, [allOperations, activeFilter]);

  // Get today's operations
  const todaysOperations = useMemo(() => {
    const today = '2025-03-01'; // Current mock date
    return filteredOperations.filter((operation) => operation.date === today);
  }, [filteredOperations]);

  const filterButtons = [
    { key: 'all', label: 'All', count: allOperations.length },
    { key: 'expense', label: 'Expenses', count: mockExpenses.length },
    { key: 'income', label: 'Income', count: mockIncomes.length },
    { key: 'debt', label: 'Debts', count: mockDebtOperations.length },
    { key: 'other', label: 'Other', count: mockOtherTransactions.length },
  ];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.screenTitle, { color: colors.text }]}>
          Operations
        </Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filtersContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        >
          {filterButtons.map((filter) => (
            <Pressable
              key={filter.key}
              style={[
                styles.filterButton,
                {
                  backgroundColor:
                    activeFilter === filter.key
                      ? colors.primary
                      : colors.secondary,
                },
              ]}
              onPress={() => setActiveFilter(filter.key as FilterType)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  {
                    color:
                      activeFilter === filter.key ? '#FFFFFF' : colors.text,
                  },
                ]}
              >
                {filter.label} ({filter.count})
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
      >
        {/* Today's Operations */}
        {todaysOperations.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Today&apos;s Operations
            </Text>
            {todaysOperations.map((operation) => (
              <OperationCard
                key={`${operation.type}-${operation.id}`}
                operation={operation}
              />
            ))}
          </View>
        )}

        {/* All Operations */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {activeFilter === 'all'
              ? 'All Operations'
              : `${filterButtons.find((f) => f.key === activeFilter)?.label} Operations`}
          </Text>
          {filteredOperations.length > 0 ? (
            filteredOperations.map((operation) => (
              <OperationCard
                key={`${operation.type}-${operation.id}`}
                operation={operation}
              />
            ))
          ) : (
            <Card>
              <Text
                style={{ color: colors.textSecondary, textAlign: 'center' }}
              >
                No operations found for the selected filter
              </Text>
            </Card>
          )}
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
  filtersContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filtersContent: {
    paddingVertical: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
});
