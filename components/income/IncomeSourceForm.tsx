import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../ui/Button';
import { useTheme } from '@/context/ThemeContext';

const incomeSourceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  balance: z.string().min(1, 'Initial balance is required'),
});

type IncomeSourceFormData = z.infer<typeof incomeSourceSchema>;

interface IncomeSourceFormProps {
  onSubmit: (data: IncomeSourceFormData) => void;
  initialData?: Partial<IncomeSourceFormData>;
  onCancel: () => void;
}

export default function IncomeSourceForm({
  onSubmit,
  initialData,
  onCancel,
}: IncomeSourceFormProps) {
  const { colors, spacing } = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IncomeSourceFormData>({
    resolver: zodResolver(incomeSourceSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      balance: initialData?.balance?.toString() || '',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Name</Text>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: errors.name ? colors.error : colors.border,
                  backgroundColor: colors.card,
                },
              ]}
              placeholderTextColor={colors.textSecondary}
              placeholder="e.g., Bank Account, Cash"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.name && (
          <Text style={[styles.errorText, { color: colors.error }]}>
            {errors.name.message}
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
                styles.textArea,
                {
                  color: colors.text,
                  borderColor: errors.description ? colors.error : colors.border,
                  backgroundColor: colors.card,
                },
              ]}
              placeholderTextColor={colors.textSecondary}
              placeholder="Optional description"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              multiline
              numberOfLines={3}
            />
          )}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>
          Initial Balance
        </Text>
        <Controller
          control={control}
          name="balance"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.amountInputContainer}>
              <Text style={[styles.currencySymbol, { color: colors.text }]}>
                $
              </Text>
              <TextInput
                style={[
                  styles.input,
                  styles.amountInput,
                  {
                    color: colors.text,
                    borderColor: errors.balance ? colors.error : colors.border,
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
        {errors.balance && (
          <Text style={[styles.errorText, { color: colors.error }]}>
            {errors.balance.message}
          </Text>
        )}
      </View>

      <View style={styles.buttonsContainer}>
        <Button
          variant="outline"
          onPress={onCancel}
          style={{ flex: 1, marginRight: spacing.sm }}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onPress={handleSubmit(onSubmit)}
          style={{ flex: 1 }}
        >
          Save
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
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
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 24,
  },
});