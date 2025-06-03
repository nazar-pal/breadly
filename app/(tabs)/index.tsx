import { useTheme } from '@/context/ThemeContext';
import { mockExpenses, mockIncomes } from '@/data/mockData';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import OperationCard from '@/components/operations/OperationCard';
import OperationFilter from '@/components/operations/OperationFilter';

// Combine and format all operations
const allOperations = [
  ...mockExpenses.map(expense => ({
    ...expense,
    type: 'expense',
    amount: -expense.amount // Make expenses negative
  })),
  ...mockIncomes.map(income => ({
    ...income,
    type: 'income'
  }))
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export default function OperationsScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'expenses' | 'income'>('all');

  const filteredOperations = allOperations.filter(operation => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'expenses') return operation.type === 'expense';
    if (selectedFilter === 'income') return operation.type === 'income';
    return true;
  });

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

      <OperationFilter
        selected={selectedFilter}
        onSelect={setSelectedFilter}
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 16 },
        ]}
      >
        {filteredOperations.map((operation) => (
          <OperationCard
            key={operation.id}
            operation={operation}
          />
        ))}

        {filteredOperations.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
              No {selectedFilter === 'all' ? 'operations' : selectedFilter} found
            </Text>
          </View>
        )}
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
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 16,
  },
});