import React from 'react'
import { Control, Controller, FieldPath } from 'react-hook-form'
import { Pressable, Text, TextInput, View } from 'react-native'

interface TextFieldProps<T extends Record<string, any>> {
  control: Control<T>
  name: FieldPath<T>
  label: string
  placeholder: string
  required?: boolean
  multiline?: boolean
  keyboardType?: 'default' | 'decimal-pad'
  autoFocus?: boolean
}

export function TextField<T extends Record<string, any>>({
  control,
  name,
  label,
  placeholder,
  required = false,
  multiline = false,
  keyboardType = 'default',
  autoFocus = false
}: TextFieldProps<T>) {
  return (
    <View className="mb-6">
      <Text className="mb-2 text-base font-semibold text-foreground">
        {label}
      </Text>
      <Controller
        control={control}
        name={name}
        rules={required ? { required: `${label} is required` } : undefined}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className={`${
              multiline ? 'h-[100px]' : 'min-h-[48px]'
            } rounded-xl border border-border bg-card px-4 py-3 text-base text-foreground`}
            style={
              multiline
                ? { paddingTop: 12, textAlignVertical: 'top' }
                : undefined
            }
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            multiline={multiline}
            numberOfLines={multiline ? 3 : 1}
            keyboardType={keyboardType}
            autoFocus={autoFocus}
          />
        )}
      />
    </View>
  )
}

interface CurrencyFieldProps<T extends Record<string, any>> {
  control: Control<T>
  name: FieldPath<T>
  label: string
  placeholder?: string
  required?: boolean
  description?: string
}

export function CurrencyField<T extends Record<string, any>>({
  control,
  name,
  label,
  placeholder = '0.00',
  required = false,
  description
}: CurrencyFieldProps<T>) {
  return (
    <View className="mb-6">
      <Text className="mb-2 text-base font-semibold text-foreground">
        {label}
      </Text>
      {description && (
        <Text className="mb-2 text-sm text-muted-foreground">
          {description}
        </Text>
      )}
      <Controller
        control={control}
        name={name}
        rules={required ? { required: `${label} is required` } : undefined}
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="flex-row items-center">
            <Text className="mr-3 text-base text-foreground">$</Text>
            <TextInput
              className="min-h-[48px] flex-1 rounded-xl border border-border bg-card px-4 py-3 text-base text-foreground"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={placeholder}
              placeholderTextColor="#9CA3AF"
              keyboardType="decimal-pad"
            />
          </View>
        )}
      />
    </View>
  )
}

interface DateFieldProps<T extends Record<string, any>> {
  control: Control<T>
  name: FieldPath<T>
  label: string
  placeholder?: string
  required?: boolean
}

export function DateField<T extends Record<string, any>>({
  control,
  name,
  label,
  placeholder = 'YYYY-MM-DD',
  required = false
}: DateFieldProps<T>) {
  return (
    <View className="mb-6">
      <Text className="mb-2 text-base font-semibold text-foreground">
        {label}
      </Text>
      <Controller
        control={control}
        name={name}
        rules={required ? { required: `${label} is required` } : undefined}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className="min-h-[48px] rounded-xl border border-border bg-card px-4 py-3 text-base text-foreground"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
          />
        )}
      />
    </View>
  )
}

interface ToggleFieldProps<T extends Record<string, any>> {
  control: Control<T>
  name: FieldPath<T>
  label: string
  description?: string
  options: {
    value: boolean
    label: string
  }[]
}

export function ToggleField<T extends Record<string, any>>({
  control,
  name,
  label,
  description,
  options
}: ToggleFieldProps<T>) {
  return (
    <View className="mb-6">
      <Text className="mb-2 text-base font-semibold text-foreground">
        {label}
      </Text>
      {description && (
        <Text className="mb-2 text-sm text-muted-foreground">
          {description}
        </Text>
      )}
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <View className="flex-row gap-2">
            {options.map(option => (
              <Pressable
                key={option.label}
                className={`flex-1 rounded-xl border py-3 ${
                  value === option.value
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-card'
                }`}
                onPress={() => onChange(option.value)}
              >
                <Text
                  className={`text-center text-base font-semibold ${
                    value === option.value ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      />
    </View>
  )
}
