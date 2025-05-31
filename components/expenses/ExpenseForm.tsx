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
import { Plus, ChevronDown, Calendar } from 'lucide-react-native';

// Define the validation schema
const expenseSchema = z.object({
  amount: z.string().min(1, 'Amount is required'),
  description: z.string().optional(),
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
  const [showDescription, setShowDescription] = useState(false);
  const [expenses, setExpenses] = useState<ExpenseFormData[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: initialData?.amount || '',
      description: initialData?.description || '',
      category: initialData?.category || '',
      date: initialData?.date || today,
    },
  });

  const selectedCategory = watch('category');
  const selectedDate = watch('date');

  const handleAddExpense = (data: ExpenseFormData) => {
    setExpenses([...expenses, data]);
    reset({
      amount: '',
      description: '',
      category: data.category,
      date: data.date,
    });
    setShowDescription(false);
  };

  const handleFinalSubmit = () => {
    handleSubmit((data) => {
      const allExpenses = [...expenses, data];
      onSubmit(allExpenses[0]);
    })();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

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

      <Pressable
        onPress={() => setShowDescription(!showDescription)}
        style={[
          styles.descriptionToggle,
          { backgroundColor: colors.secondary, borderRadius: borderRadius.md },
        ]}
      >
        <Text style={[styles.descriptionToggleText, { color: colors.text }]}>
          {showDescription ? 'Hide Description' : 'Add Description'}
        </Text>
        <ChevronDown
          size={20}
          color={colors.text}
          style={{
            transform: [{ rotate: showDescription ? '180deg' : '0deg' }],
          }}
        />
      </Pressable>

      {showDescription && (
        <View style={styles.formGroup}>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  styles.descriptionInput,
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
                multiline
                numberOfLines={3}
              />
            )}
          />
        </View>
      )}

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Category</Text>
        <Pressable
          onPress={() => setShowCategoryPicker(true)}
          style={[
            styles.pickerButton,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text
            style={[
              styles.pickerButtonText,
              {
                color: selectedCategory ? colors.text : colors.textSecondary,
              },
            ]}
          >
            {selectedCategory || 'Select a category'}
          </Text>
          <ChevronDown size={20} color={colors.text} />
        </Pressable>
        {errors.category && (
          <Text style={[styles.errorText, { color: colors.error }]}>
            {errors.category.message}
          </Text>
        )}
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Date</Text>
        <Pressable
          onPress={() => setShowDatePicker(true)}
          style={[
            styles.pickerButton,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.pickerButtonText, { color: colors.text }]}>
            {selectedDate === today ? 'Today' : formatDate(selectedDate)}
          </Text>
          <Calendar size={20} color={colors.text} />
        </Pressable>
      </View>

      {expenses.length > 0 && (
        <View style={[styles.expensesList, { backgroundColor: colors.secondary }]}>
          <Text style={[styles.expensesListTitle, { color: colors.text }]}>
            Added Expenses ({expenses.length})
          </Text>
          {expenses.map((expense, index) => (
            <View
              key={index}
              style={[
                styles.expenseItem,
                { borderBottomColor: colors.border },
              ]}
            >
              <Text style={[styles.expenseItemAmount, { color: colors.text }]}>
                ${parseFloat(expense.amount).toFixed(2)}
              </Text>
              <Text
                style={[styles.expenseItemCategory, { color: colors.textSecondary }]}
              >
                {expense.category}
              </Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button
          variant="outline"
          onPress={handleSubmit(handleAddExpense)}
          style={{ flex: 1, marginRight: spacing.sm }}
          leftIcon={<Plus size={20} color={colors.text} />}
        >
          Add Another
        </Button>
        <Button variant="primary" onPress={handleFinalSubmit} style={{ flex: 1 }}>
          Save {expenses.length > 0 ? 'All' : ''} Expense
          {expenses.length !== 0 ? 's' : ''}
        </Button>
      </View>

      {/* Category Picker Modal */}
      <Modal
        visible={showCategoryPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCategoryPicker(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowCategoryPicker(false)}
        >
          <View
            style={[styles.modalContent, { backgroundColor: colors.card }]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Select Category
            </Text>
            <ScrollView>
              {mockCategories.map((category) => (
                <Pressable
                  key={category.id}
                  style={[
                    styles.categoryOption,
                    {
                      backgroundColor:
                        selectedCategory === category.name
                          ? colors.primary
                          : 'transparent',
                    },
                  ]}
                  onPress={() => {
                    setValue('category', category.name);
                    setShowCategoryPicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.categoryOptionText,
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
            </ScrollView>
          </View>
        </Pressable>
      </Modal>

      {/* Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowDatePicker(false)}
        >
          <View
            style={[styles.modalContent, { backgroundColor: colors.card }]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Select Date
            </Text>
            <ScrollView>
              {[...Array(7)].map((_, index) => {
                const date = new Date();
                date.setDate(date.getDate() - index);
                const dateString = date.toISOString().split('T')[0];
                const isToday = index === 0;

                return (
                  <Pressable
                    key={dateString}
                    style={[
                      styles.dateOption,
                      {
                        backgroundColor:
                          selectedDate === dateString
                            ? colors.primary
                            : 'transparent',
                      },
                    ]}
                    onPress={() => {
                      setValue('date', dateString);
                      setShowDatePicker(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dateOptionText,
                        {
                          color:
                            selectedDate === dateString ? 'white' : colors.text,
                        },
                      ]}
                    >
                      {isToday ? 'Today' : formatDate(dateString)}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
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
  descriptionInput: {
    height: 80,
    paddingTop: 12,
    paddingBottom: 12,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  descriptionToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    marginBottom: 16,
  },
  descriptionToggleText: {
    fontSize: 14,
    fontWeight: '500',
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  pickerButtonText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    borderRadius: 12,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  categoryOption: {
    padding: 16,
  },
  categoryOptionText: {
    fontSize: 16,
  },
  dateOption: {
    padding: 16,
  },
  dateOptionText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 24,
  },
  expensesList: {
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  expensesListTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  expenseItemAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  expenseItemCategory: {
    fontSize: 14,
  },
});