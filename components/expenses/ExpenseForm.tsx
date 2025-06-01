import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
  Modal,
  Platform,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../ui/Button';
import { useTheme } from '@/context/ThemeContext';
import { mockCategories } from '@/data/mockData';
import {
  Calendar,
  ChevronDown,
  X,
  Plus,
  Minus,
  Divide,
  Multiply,
  Equal,
  Percent,
} from 'lucide-react-native';

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

type Operation = '+' | '-' | '×' | '÷' | '%' | '=';

export default function ExpenseForm({ onSubmit, initialData }: ExpenseFormProps) {
  const { colors, spacing } = useTheme();
  const [showDescription, setShowDescription] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [calculatorInput, setCalculatorInput] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<Operation | null>(null);
  const [newNumberStarted, setNewNumberStarted] = useState(false);

  const today = new Date().toISOString().split('T')[0];

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
      date: initialData?.date || today,
    },
  });

  const selectedCategory = watch('category');
  const selectedDate = watch('date');

  const handleNumberPress = (num: string) => {
    if (newNumberStarted) {
      setCalculatorInput(num);
      setNewNumberStarted(false);
    } else {
      setCalculatorInput(prev => 
        prev === '0' ? num : prev + num
      );
    }
  };

  const handleOperation = (op: Operation) => {
    const currentValue = parseFloat(calculatorInput);

    if (op === '=') {
      if (previousValue !== null && operation) {
        let result = 0;
        switch (operation) {
          case '+': result = previousValue + currentValue; break;
          case '-': result = previousValue - currentValue; break;
          case '×': result = previousValue * currentValue; break;
          case '÷': result = previousValue / currentValue; break;
          case '%': result = previousValue * (currentValue / 100); break;
        }
        setCalculatorInput(result.toString());
        setPreviousValue(null);
        setOperation(null);
      }
    } else {
      setPreviousValue(currentValue);
      setOperation(op);
      setNewNumberStarted(true);
    }
  };

  const handleDecimal = () => {
    if (!calculatorInput.includes('.')) {
      setCalculatorInput(prev => prev + '.');
    }
  };

  const handleClear = () => {
    setCalculatorInput('0');
    setPreviousValue(null);
    setOperation(null);
  };

  const applyCalculatorValue = () => {
    setValue('amount', calculatorInput);
    setShowCalculator(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
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
      <View style={styles.formSection}>
        <View style={styles.row}>
          <View style={[styles.formGroup, styles.amountContainer]}>
            <Text style={[styles.label, { color: colors.text }]}>Amount</Text>
            <Controller
              control={control}
              name="amount"
              render={({ field: { value } }) => (
                <Pressable
                  onPress={() => setShowCalculator(true)}
                  style={[
                    styles.calculatorButton,
                    { backgroundColor: colors.card, borderColor: colors.border },
                  ]}
                >
                  <Text style={[styles.amountText, { color: colors.text }]}>
                    ${value || '0.00'}
                  </Text>
                  <Text style={[styles.calculatorHint, { color: colors.textSecondary }]}>
                    Tap to calculate
                  </Text>
                </Pressable>
              )}
            />
          </View>

          <View style={[styles.formGroup, styles.categoryContainer]}>
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
                numberOfLines={1}
              >
                {selectedCategory || 'Select'}
              </Text>
              <ChevronDown size={20} color={colors.text} />
            </Pressable>
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.formGroup, { flex: 1 }]}>
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
        </View>

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
                      borderColor: colors.border,
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

        <Button
          variant="primary"
          onPress={handleSubmit(onSubmit)}
          style={{ marginTop: 24 }}
        >
          Save Expense
        </Button>
      </View>

      {/* Calculator Modal */}
      <Modal
        visible={showCalculator}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCalculator(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.calculatorModal, { backgroundColor: colors.card }]}>
            <View style={styles.calculatorHeader}>
              <Text style={[styles.calculatorDisplay, { color: colors.text }]}>
                ${calculatorInput}
              </Text>
              <Button
                variant="outline"
                onPress={() => setShowCalculator(false)}
                style={{ marginLeft: 'auto' }}
              >
                <X size={20} />
              </Button>
            </View>

            <View style={styles.calculatorGrid}>
              {/* Numbers */}
              {[7, 8, 9, 4, 5, 6, 1, 2, 3, 0].map((num) => (
                <Pressable
                  key={num}
                  style={[styles.calcButton, { backgroundColor: colors.secondary }]}
                  onPress={() => handleNumberPress(num.toString())}
                >
                  <Text style={[styles.calcButtonText, { color: colors.text }]}>
                    {num}
                  </Text>
                </Pressable>
              ))}
              
              {/* Decimal */}
              <Pressable
                style={[styles.calcButton, { backgroundColor: colors.secondary }]}
                onPress={handleDecimal}
              >
                <Text style={[styles.calcButtonText, { color: colors.text }]}>.</Text>
              </Pressable>

              {/* Operations */}
              <Pressable
                style={[styles.calcButton, { backgroundColor: colors.primary }]}
                onPress={() => handleOperation('+')}
              >
                <Plus size={24} color="#fff" />
              </Pressable>
              <Pressable
                style={[styles.calcButton, { backgroundColor: colors.primary }]}
                onPress={() => handleOperation('-')}
              >
                <Minus size={24} color="#fff" />
              </Pressable>
              <Pressable
                style={[styles.calcButton, { backgroundColor: colors.primary }]}
                onPress={() => handleOperation('×')}
              >
                <Multiply size={24} color="#fff" />
              </Pressable>
              <Pressable
                style={[styles.calcButton, { backgroundColor: colors.primary }]}
                onPress={() => handleOperation('÷')}
              >
                <Divide size={24} color="#fff" />
              </Pressable>
              <Pressable
                style={[styles.calcButton, { backgroundColor: colors.primary }]}
                onPress={() => handleOperation('%')}
              >
                <Percent size={24} color="#fff" />
              </Pressable>

              {/* Clear and Apply */}
              <Pressable
                style={[styles.calcButton, { backgroundColor: colors.error }]}
                onPress={handleClear}
              >
                <Text style={[styles.calcButtonText, { color: '#fff' }]}>C</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.calcButton,
                  styles.equalButton,
                  { backgroundColor: colors.success },
                ]}
                onPress={applyCalculatorValue}
              >
                <Equal size={24} color="#fff" />
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

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
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
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
                            ? '#fff'
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
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
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
                            selectedDate === dateString ? '#fff' : colors.text,
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
  formSection: {
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  formGroup: {
    flex: 1,
  },
  amountContainer: {
    flex: 1.2,
  },
  categoryContainer: {
    flex: 1,
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
  calculatorButton: {
    height: 64,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  amountText: {
    fontSize: 24,
    fontWeight: '600',
  },
  calculatorHint: {
    fontSize: 12,
    marginTop: 4,
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
    flex: 1,
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
  calculatorModal: {
    borderRadius: 20,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
    }),
  },
  calculatorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  calculatorDisplay: {
    fontSize: 36,
    fontWeight: '600',
    flex: 1,
  },
  calculatorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  calcButton: {
    width: '23%',
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  equalButton: {
    width: '48%',
  },
  calcButtonText: {
    fontSize: 24,
    fontWeight: '600',
  },
});