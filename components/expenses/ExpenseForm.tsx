import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
  Modal,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../ui/Button';
import { useTheme } from '@/context/ThemeContext';
import { mockCategories } from '@/data/mockData';
import {
  Plus,
  ChevronDown,
  Calendar,
  AlignLeft,
  ChevronRight,
  X,
} from 'lucide-react-native';
import IconButton from '../ui/IconButton';

// ... (previous imports and type definitions remain the same)

export default function ExpenseForm({ onSubmit, initialData }: ExpenseFormProps) {
  // ... (previous state and hooks remain the same)

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      {/* Form Section - remains the same */}
      
      {/* Added Expenses List */}
      {expenses.length > 0 && (
        <View
          style={[styles.expensesList, { backgroundColor: colors.secondary }]}
        >
          <Text style={[styles.expensesListTitle, { color: colors.text }]}>
            Added Expenses ({expenses.length})
          </Text>
          {expenses.map((expense, index) => (
            <Pressable
              key={index}
              onPress={() => handleEditExpense(index)}
              style={[
                styles.expenseItem,
                {
                  backgroundColor:
                    editingExpenseIndex === index ? colors.card : 'transparent',
                  borderRadius: 8,
                  marginBottom: 8,
                  padding: 12,
                },
              ]}
            >
              {/* First Row: Amount and Category */}
              <View style={styles.expenseItemMainRow}>
                <Text style={[styles.expenseItemAmount, { color: colors.text }]}>
                  ${parseFloat(expense.amount).toFixed(2)}
                </Text>
                <View
                  style={[
                    styles.categoryBadge,
                    { backgroundColor: colors.card },
                  ]}
                >
                  <Text
                    style={[styles.categoryBadgeText, { color: colors.text }]}
                  >
                    {expense.category}
                  </Text>
                </View>
                <ChevronRight size={20} color={colors.textSecondary} />
              </View>

              {/* Second Row: Date and Description */}
              <View style={styles.expenseItemSecondaryRow}>
                <Text
                  style={[styles.dateText, { color: colors.textSecondary }]}
                >
                  {formatDate(expense.date)}
                </Text>
                {expense.description && (
                  <Text
                    style={[
                      styles.descriptionText,
                      { color: colors.textSecondary },
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    • {expense.description}
                  </Text>
                )}
              </View>
            </Pressable>
          ))}
        </View>
      )}

      {/* Modals remain the same */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // ... (previous styles remain the same)

  expenseItem: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  expenseItemMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  expenseItemSecondaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
  expenseItemAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 'auto',
    marginRight: 12,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  dateText: {
    fontSize: 12,
  },
  descriptionText: {
    fontSize: 12,
    flex: 1,
    marginLeft: 4,
  },
});