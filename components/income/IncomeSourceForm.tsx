import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../ui/Button';
import { useTheme } from '@/context/ThemeContext';

const sourceSchema = z.object({
  name: z.string().min(1, 'Source name is required'),
});

type SourceFormData = z.infer<typeof sourceSchema>;

interface IncomeSourceFormProps {
  onSubmit: (data: SourceFormData) => void;
  onCancel: () => void;
  initialData?: { name: string };
}

export default function IncomeSourceForm({
  onSubmit,
  onCancel,
  initialData,
}: IncomeSourceFormProps) {
  const { colors, spacing } = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SourceFormData>({
    resolver: zodResolver(sourceSchema),
    defaultValues: {
      name: initialData?.name || '',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>
          Source Name
        </Text>
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
              placeholder="e.g., Salary, Freelance"
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
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
});