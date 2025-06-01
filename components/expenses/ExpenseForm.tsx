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

// ... (schema and types remain the same)

export default function ExpenseForm({ onSubmit, initialData }: ExpenseFormProps) {
  // ... (state and hooks remain the same)

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      {/* Form Section */}
      <View style={styles.formSection}>
        {/* ... (existing form fields remain the same) */}
      </View>

      {/* Added Expenses List */}
      {expenses.length > 0 && (
        <View style={[styles.expensesList, { backgroundColor: colors.card }]}>
          <Text style={[styles.expensesListTitle, { color: colors.text }]}>
            Added Expenses ({expenses.length})
          </Text>
          {expenses.map((expense, index) => (
            <Pressable
              key={index}
              onPress={() => handleEditExpense(index)}
              style={({ pressed }) => [
                styles.expenseItem,
                {
                  backgroundColor: editingExpenseIndex === index 
                    ? colors.secondary 
                    : pressed 
                    ? colors.secondary + '80'
                    : colors.card,
                  borderBottomColor: colors.border,
                },
              ]}
            >
              <View style={styles.expenseItemMain}>
                <View style={styles.expenseItemLeft}>
                  <Text style={[styles.expenseItemAmount, { color: colors.text }]}>
                    ${parseFloat(expense.amount).toFixed(2)}
                  </Text>
                  <View style={styles.expenseItemMeta}>
                    <View style={[styles.categoryBadge, { backgroundColor: colors.secondary }]}>
                      <Text style={[styles.categoryBadgeText, { color: colors.text }]}>
                        {expense.category}
                      </Text>
                    </View>
                    <Text style={[styles.dateText, { color: colors.textSecondary }]}>
                      {formatDate(expense.date)}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.expenseItemRight}>
                  {editingExpenseIndex === index ? (
                    <View style={styles.editActions}>
                      <IconButton
                        icon={<X size={18} />}
                        variant="ghost"
                        size="sm"
                        onPress={() => handleDeleteExpense(index)}
                      />
                    </View>
                  ) : (
                    <ChevronRight size={18} color={colors.textSecondary} />
                  )}
                </View>
              </View>
              
              {expense.description && (
                <Text 
                  style={[styles.descriptionText, { color: colors.textSecondary }]}
                  numberOfLines={1}
                >
                  {expense.description}
                </Text>
              )}
            </Pressable>
          ))}
        </View>
      )}

      {/* ... (modals remain the same) */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // ... (existing styles remain the same)

  expensesList: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 24,
  },
  expensesListTitle: {
    fontSize: 14,
    fontWeight: '600',
    padding: 16,
    paddingBottom: 8,
  },
  expenseItem: {
    padding: 16,
    borderBottomWidth: 1,
  },
  expenseItemMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  expenseItemLeft: {
    flex: 1,
    marginRight: 16,
  },
  expenseItemAmount: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  expenseItemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  expenseItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 13,
    fontWeight: '500',
  },
  dateText: {
    fontSize: 13,
  },
  descriptionText: {
    fontSize: 13,
    marginTop: 4,
    opacity: 0.8,
  },
  editActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});