import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../ui/Button';
import { useTheme } from '@/context/ThemeContext';
import { Picker } from '@react-native-picker/picker';
import { mockIncomeSources } from '@/data/mockData';

const incomeSchema = z.object({
  amount: z.string().min(1, 'Amount is required'),
  sourceId: z.string().min(1, 'Source is required'),
  description: z.string().optional(),
});

type IncomeFormData = z.infer<typeof incomeSchema>;

interface AddIncomeFormProps {
  onSubmit: (data: IncomeFormData) => void;
  onCancel: () => void;
}

export default function AddIncomeForm({
  onSubmit,
  onCancel,
}: AddIncomeFormProps) {
  const { colors, spacing } = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IncomeFormData>({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      amount: '',
      sourceId: '',
      description: '',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Amount</Text>
        <Controller
          control={control}
          name="amount"
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
        <Text style={[styles.label, { color: colors.text }]}>Source</Text>
        <Controller
          control={control}
          name="sourceId"
          render={({ field: { onChange, value } }) => (
            <View
              style={[
                styles.pickerContainer,
                {
                  backgroundColor: colors.card,
                  borderColor: errors.sourceId ? colors.error : colors.border,
                },
              ]}
            >
              <Picker
                selectedValue={value}
                onValueChange={onChange}
                style={[styles.picker, { color: colors.text }]}
              >
                <Picker.Item
                  label="Select a source"
                  value=""
                  color={colors.textSecondary}
                />
                {mockIncomeSources.map((source) => (
                  <Picker.Item
                    key={source.id}
                    label={source.name}
                    value={source.id}
                    color={colors.text}
                  />
                ))}
              </Picker>
            </View>
          )}
        />
        {errors.sourceId && (
          <Text style={[styles.errorText, { color: colors.error }]}>
            {errors.sourceId.message}
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
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
  },
  picker: {
    height: 48,
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