import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable } from 'react-native';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../ui/Button';
import { useTheme } from '@/context/ThemeContext';
import { mockCategories } from '@/data/mockData';
import { ChevronDown, ChevronUp, Plus, Trash2, AlignLeft } from 'lucide-react-native';

// Define the validation schema for a single expense
const singleExpenseSchema = z.object({
  amount: z.string().min(1, 'Amount is required'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  date: z.string().min(1, 'Date is required'),
});

// Schema for multiple expenses
const expenseFormSchema = z.object({
  mode: z.enum(['single', 'multiple']),
  expenses: z.array(singleExpenseSchema),
});

type ExpenseFormData = z.infer<typeof expenseFormSchema>;

interface ExpenseFormProps {
  onSubmit: (data: ExpenseFormData) => void;
  initialData?: Partial<ExpenseFormData>;
}

export default function ExpenseForm({ onSubmit, initialData }: ExpenseFormProps) {
  const { colors, spacing, borderRadius } = useTheme();
  const [showDescriptions, setShowDescriptions] = useState<Record<number, boolean>>({});

  const {
    control,
    handleSubmit,
    watch,
    setValue,
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      mode: 'single',
      expenses: [
        {
          amount: '',
          description: '',
          category: '',
          date: new Date().toISOString().split('T')[0],
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'expenses',
  });

  const mode = watch('mode');

  const toggleDescription = (index: number) => {
    setShowDescriptions(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const addExpense = () => {
    append({
      amount: '',
      description: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.modeSelector}>
        <Pressable
          style={[
            styles.modeButton,
            {
              backgroundColor: mode === 'single' ? colors.primary : colors.secondary,
              borderTopLeftRadius: borderRadius.md,
              borderBottomLeftRadius: borderRadius.md,
            },
          ]}
          onPress={() => setValue('mode', 'single')}
        >
          <Text
            style={[
              styles.modeButtonText,
              { color: mode === 'single' ? '#FFFFFF' : colors.text },
            ]}
          >
            Single
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.modeButton,
            {
              backgroundColor: mode === 'multiple' ? colors.primary : colors.secondary,
              borderTopRightRadius: borderRadius.md,
              borderBottomRightRadius: borderRadius.md,
            },
          ]}
          onPress={() => setValue('mode', 'multiple')}
        >
          <Text
            style={[
              styles.modeButtonText,
              { color: mode === 'multiple' ? '#FFFFFF' : colors.text },
            ]}
          >
            Multiple
          </Text>
        </Pressable>
      </View>

      {fields.map((field, index) => (
        <View key={field.id} style={styles.expenseContainer}>
          {mode === 'multiple' && (
            <View style={styles.expenseHeader}>
              <Text style={[styles.expenseTitle, { color: colors.text }]}>
                Expense {index + 1}
              </Text>
              {fields.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onPress={() => remove(index)}
                  leftIcon={<Trash2 size={16} color={colors.error} />}
                >
                  Remove
                </Button>
              )}
            </View>
          )}

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Amount</Text>
            <Controller
              control={control}
              name={`expenses.${index}.amount`}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <View style={styles.amountInputContainer}>
                  <Text style={[styles.currencySymbol, { color: colors.text }]}>$</Text>
                  <TextInput
                    style={[
                      styles.input,
                      styles.amountInput,
                      {
                        color: colors.text,
                        borderColor: error ? colors.error : colors.border,
                        backgroundColor: colors.card,
                      },
                    ]}
                    placeholderTextColor={colors.textSecondary}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                    onChangeText={onChange}
                    value={value}
                  />
                </View>
              )}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Category</Text>
            <View style={styles.categoriesContainer}>
              {mockCategories.map((category) => (
                <Controller
                  key={category.id}
                  control={control}
                  name={`expenses.${index}.category`}
                  render={({ field: { onChange, value } }) => (
                    <Pressable
                      style={[
                        styles.categoryChip,
                        {
                          backgroundColor:
                            value === category.name
                              ? colors.primary
                              : colors.secondary,
                          borderRadius: borderRadius.md,
                        },
                      ]}
                      onPress={() => onChange(category.name)}
                    >
                      <Text
                        style={[
                          styles.categoryChipText,
                          {
                            color:
                              value === category.name
                                ? '#FFFFFF'
                                : colors.text,
                          },
                        ]}
                      >
                        {category.name}
                      </Text>
                    </Pressable>
                  )}
                />
              ))}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Date</Text>
            <Controller
              control={control}
              name={`expenses.${index}.date`}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextInput
                  style={[
                    styles.input,
                    {
                      color: colors.text,
                      borderColor: error ? colors.error : colors.border,
                      backgroundColor: colors.card,
                    },
                  ]}
                  placeholderTextColor={colors.textSecondary}
                  placeholder="YYYY-MM-DD"
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
          </View>

          <Pressable
            style={[
              styles.descriptionToggle,
              { backgroundColor: colors.secondary },
            ]}
            onPress={() => toggleDescription(index)}
          >
            <AlignLeft size={16} color={colors.text} />
            <Text
              style={[
                styles.descriptionToggleText,
                { color: colors.text },
              ]}
            >
              {showDescriptions[index] ? 'Hide' : 'Add'} Description
            </Text>
            {showDescriptions[index] ? (
              <ChevronUp size={16} color={colors.text} />
            ) : (
              <ChevronDown size={16} color={colors.text} />
            )}
          </Pressable>

          {showDescriptions[index] && (
            <View style={[styles.formGroup, { marginTop: spacing.sm }]}>
              <Controller
                control={control}
                name={`expenses.${index}.description`}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      styles.descriptionInput,
                      {
                        color: colors.text,
                        borderColor: colors.border,
                        backgroundColor: colors.card,
                      },
                    ]}
                    placeholderTextColor={colors.textSecondary}
                    placeholder="What was this expense for?"
                    onChangeText={onChange}
                    value={value}
                    multiline
                  />
                )}
              />
            </View>
          )}
        </View>
      ))}

      {mode === 'multiple' && (
        <Button
          variant="outline"
          onPress={addExpense}
          style={{ marginTop: spacing.md }}
          leftIcon={<Plus size={20} color={colors.primary} />}
        >
          Add Another Expense
        </Button>
      )}

      <Button
        variant="primary"
        fullWidth
        onPress={handleSubmit(onSubmit)}
        style={{ marginTop: spacing.xl }}
      >
        Save {mode === 'multiple' ? 'Expenses' : 'Expense'}
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  modeSelector: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  expenseContainer: {
    marginBottom: 24,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  expenseTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  descriptionInput: {
    height: 80,
    paddingTop: 12,
    paddingBottom: 12,
    textAlignVertical: 'top',
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontWeight: '600',
    fontSize: 20,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 4,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  descriptionToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    gap: 8,
  },
  descriptionToggleText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
});