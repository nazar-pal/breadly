import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useCurrency } from '@/context/CurrencyContext';
import Button from '../ui/Button';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, X } from 'lucide-react-native';

const incomeSchema = z.object({
  amount: z.string().min(1, 'Amount is required'),
  description: z.string().optional(),
});

type IncomeFormData = z.infer<typeof incomeSchema>;

interface IncomeEntryModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { amount: number; description?: string }) => void;
  sourceName: string;
}

export default function IncomeEntryModal({
  visible,
  onClose,
  onSubmit,
  sourceName,
}: IncomeEntryModalProps) {
  const { colors, spacing } = useTheme();
  const { currency } = useCurrency();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IncomeFormData>({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      amount: '',
      description: '',
    },
  });

  const handleFormSubmit = (data: IncomeFormData) => {
    onSubmit({
      amount: parseFloat(data.amount),
      description: data.description,
    });
    reset();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <View
          style={[styles.modalContent, { backgroundColor: colors.card }]}
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Add Income
            </Text>
            <Button
              variant="ghost"
              onPress={onClose}
              leftIcon={<X size={20} color={colors.text} />}
            />
          </View>

          <Text
            style={[styles.sourceLabel, { color: colors.textSecondary }]}
          >
            Source
          </Text>
          <Text style={[styles.sourceName, { color: colors.text }]}>
            {sourceName}
          </Text>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              Amount ({currency.symbol})
            </Text>
            <Controller
              control={control}
              name="amount"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    styles.amountInput,
                    {
                      color: colors.text,
                      borderColor: errors.amount ? colors.error : colors.border,
                      backgroundColor: colors.background,
                    },
                  ]}
                  placeholderTextColor={colors.textSecondary}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.amount && (
              <Text style={[styles.errorText, { color: colors.error }]}>
                {errors.amount.message}
              </Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              Description (Optional)
            </Text>
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
                      backgroundColor: colors.background,
                    },
                  ]}
                  placeholderTextColor={colors.textSecondary}
                  placeholder="Add a note about this income"
                  multiline
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button
              variant="outline"
              onPress={onClose}
              style={{ flex: 1, marginRight: spacing.sm }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onPress={handleSubmit(handleFormSubmit)}
              style={{ flex: 1 }}
              leftIcon={<Check size={20} color="#FFFFFF" />}
            >
              Save
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 -2px 8px rgba(0,0,0,0.1)',
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  sourceLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  sourceName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  amountInput: {
    height: 56,
    fontSize: 24,
    fontWeight: '600',
  },
  descriptionInput: {
    height: 100,
    paddingTop: 12,
    paddingBottom: 12,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 24,
  },
});