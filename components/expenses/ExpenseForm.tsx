import React from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../ui/Button';
import { useTheme } from '@/context/ThemeContext';
import { mockCategories } from '@/data/mockData';
import { Pressable } from 'react-native';

// Define the validation schema
const expenseSchema = z.object({
  amount: z.string().min(1, 'Amount is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  date: z.string().min(1, 'Date is required'),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

interface ExpenseFormProps {
  onSubmit: (data: ExpenseFormData) => void;
  initialData?: Partial<ExpenseFormData>;
}

export default function ExpenseForm({ onSubmit, initialData }: ExpenseFormProps) {
  const { colors, spacing, borderRadius } = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: initialData?.amount || '',
      description: initialData?.description || '',
      category: initialData?.category || '',
      date: initialData?.date || new Date().toISOString().split('T')[0],
    },
  });

  const selectedCategory = watch('category');

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Amount</Text>
        <Controller
          control={control}
          name="amount"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.amountInputContainer}>
              <Text style={[styles.currencySymbol, { color: colors.text }]}>$</Text>
              <TextInput
                style={[
                  styles.input,
                  styles.amountInput,
                  {
                    color: colors.text,
                    borderColor: errors.amount ? colors.error : colors.border,
                    backgroundColor: colors.card,
                  },
                ]}
                placeholderTextColor={colors.textSecondary}
                placeholder="0.00"
                keyboardType="decimal-pad"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            </View>
          )}
        />
        {errors.amount && (
          <Text style={[styles.errorText, { color: colors.error }]}>
            {errors.amount.message}
          </Text>
        )}
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Description</Text>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: errors.description ? colors.error : colors.border,
                  backgroundColor: colors.card,
                },
              ]}
              placeholderTextColor={colors.textSecondary}
              placeholder="What was this expense for?"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.description && (
          <Text style={[styles.errorText, { color: colors.error }]}>
            {errors.description.message}
          </Text>
        )}
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Category</Text>
        <View style={styles.categoriesContainer}>
          {mockCategories.map((category) => (
            <Pressable
              key={category.id}
              style={[
                styles.categoryChip,
                {
                  backgroundColor:
                    selectedCategory === category.name
                      ? colors.primary
                      : colors.secondary,
                  borderRadius: borderRadius.md,
                },
              ]}
              onPress={() => setValue('category', category.name)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  {
                    color:
                      selectedCategory === category.name
                        ? 'white'
                        : colors.text,
                  },
                ]}
              >
                {category.name}
              </Text>
            </Pressable>
          ))}
        </View>
        {errors.category && (
          <Text style={[styles.errorText, { color: colors.error }]}>
            {errors.category.message}
          </Text>
        )}
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Date</Text>
        <Controller
          control={control}
          name="date"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: errors.date ? colors.error : colors.border,
                  backgroundColor: colors.card,
                },
              ]}
              placeholderTextColor={colors.textSecondary}
              placeholder="YYYY-MM-DD"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.date && (
          <Text style={[styles.errorText, { color: colors.error }]}>
            {errors.date.message}
          </Text>
        )}
      </View>

      <Button
        variant="primary"
        fullWidth
        onPress={handleSubmit(onSubmit)}
        style={{ marginTop: spacing.lg }}
      >
        Save Expense
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
  errorText: {
    fontSize: 12,
    marginTop: 4,
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
});