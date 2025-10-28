import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import React from 'react'
import type {
  Control,
  FieldPath,
  FieldValues,
  RegisterOptions
} from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { View } from 'react-native'

// Reusable input component to avoid duplication between form fields
export function CategoryInput<T extends FieldValues>({
  control,
  name,
  placeholder,
  rules
}: {
  control: Control<T>
  name: FieldPath<T>
  placeholder: string
  rules?: RegisterOptions<T>
}) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error }
      }) => (
        <View>
          <Input
            className="native:h-[80px] mb-5 rounded-xl border-none bg-muted/60 px-4 py-3 text-base"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            multiline
            textAlignVertical="top"
            placeholderClassName="text-muted-foreground"
          />
          {error && (
            <Text className="mt-1 text-sm text-red-500">{error.message}</Text>
          )}
        </View>
      )}
    />
  )
}
