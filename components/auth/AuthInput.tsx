import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react-native'
import React from 'react'
import { Control, Controller, FieldPath } from 'react-hook-form'
import { View } from 'react-native'

interface AuthInputProps<T extends Record<string, any>> {
  control: Control<T>
  name: FieldPath<T>
  label: string
  icon: LucideIcon
  placeholder: string
  secureTextEntry?: boolean
  keyboardType?: 'default' | 'email-address' | 'number-pad'
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
  autoCorrect?: boolean
  error?: string
}

export function AuthInput<T extends Record<string, any>>({
  control,
  name,
  label,
  icon: Icon,
  placeholder,
  secureTextEntry,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoCorrect = false,
  error
}: AuthInputProps<T>) {
  return (
    <View className="mb-5">
      <Text className="mb-2 text-base font-semibold text-foreground">
        {label}
      </Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <View className="flex-row items-center gap-3">
              <View
                className={cn(
                  'h-14 w-14 items-center justify-center rounded-full',
                  error ? 'bg-destructive/10' : 'bg-secondary'
                )}
              >
                <Icon
                  size={20}
                  className={cn(
                    error ? 'text-destructive' : 'text-muted-foreground'
                  )}
                />
              </View>
              <View className="flex-1">
                <Input
                  className={cn(
                    'h-14 rounded-xl border text-foreground',
                    error
                      ? 'border-destructive bg-destructive/5 focus:border-destructive'
                      : 'border-border bg-secondary focus:border-primary'
                  )}
                  value={value}
                  placeholder={placeholder}
                  placeholderClassName="text-muted-foreground"
                  secureTextEntry={secureTextEntry}
                  keyboardType={keyboardType}
                  autoCapitalize={autoCapitalize}
                  autoCorrect={autoCorrect}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              </View>
            </View>
            {error && (
              <Text className="mt-2 text-sm font-medium text-destructive">
                {error}
              </Text>
            )}
          </>
        )}
      />
    </View>
  )
}
