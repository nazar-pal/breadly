import { Calendar } from '@/components/ui/calendar'
import { Drawer } from '@/components/ui/drawer'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { format } from 'date-fns'
import React from 'react'
import { Path, useFormContext, type FieldValues } from 'react-hook-form'
import { Pressable } from 'react-native'
import { DateData } from 'react-native-calendars'

// Narrower for runtime Date checks when field values are typed as unknown
const isDate = (value: unknown): value is Date => value instanceof Date

interface DateFieldProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>
  label: string
  placeholder?: string
  isPickerOpen: boolean
  openPicker: () => void
  closePicker: () => void
  drawerTitle: string
  safeBottomPadding?: boolean
  height?: number | `${number}%` | 'auto'
  valueToLabel?: (value: unknown) => string
  transformSelectedDate?: (date: DateData) => unknown
}

export function FormDateField<TFieldValues extends FieldValues>({
  name,
  label,
  placeholder,
  isPickerOpen,
  openPicker,
  closePicker,
  drawerTitle,
  safeBottomPadding = true,
  height = 'auto',
  valueToLabel,
  transformSelectedDate
}: DateFieldProps<TFieldValues>) {
  const form = useFormContext<TFieldValues>()

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <>
              <Pressable
                className="native:h-12 h-10 flex-row items-center rounded-md border border-input bg-background px-3"
                onPress={openPicker}
              >
                <Text
                  className={
                    field.value ? 'text-foreground' : 'text-muted-foreground'
                  }
                >
                  {(() => {
                    const hasValue =
                      field.value !== undefined &&
                      field.value !== null &&
                      field.value !== ''
                    if (hasValue)
                      return valueToLabel
                        ? valueToLabel(field.value)
                        : isDate(field.value)
                          ? field.value.toLocaleDateString()
                          : String(field.value)

                    return placeholder || label
                  })()}
                </Text>
              </Pressable>
              <Drawer
                isVisible={isPickerOpen}
                onClose={closePicker}
                safeBottomPadding={safeBottomPadding}
                height={height}
                title={drawerTitle}
              >
                {(() => {
                  const selectedKey = (() => {
                    if (isDate(field.value))
                      return format(field.value, 'yyyy-MM-dd')
                    if (typeof field.value === 'string') return field.value
                    return undefined
                  })()
                  const marked = selectedKey
                    ? { [selectedKey]: { selected: true } as const }
                    : undefined

                  return (
                    <Calendar
                      initialDate={selectedKey}
                      markedDates={marked}
                      onDayPress={(date: DateData) => {
                        const nextValue = transformSelectedDate
                          ? transformSelectedDate(date)
                          : new Date(date.year, date.month - 1, date.day)
                        field.onChange(nextValue)
                        closePicker()
                      }}
                    />
                  )
                })()}
              </Drawer>
            </>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

interface InputFieldProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>
  label: string
  placeholder?: string
  autoFocus?: boolean
  multiline?: boolean
  kind?: 'text' | 'number'
  itemClassName?: string
  description?: string
}

export function FormInputField<TFieldValues extends FieldValues>({
  name,
  label,
  placeholder,
  autoFocus,
  multiline,
  kind = 'text',
  itemClassName,
  description
}: InputFieldProps<TFieldValues>) {
  const form = useFormContext<TFieldValues>()
  const toNumeric = (input: string): number | undefined => {
    const sanitized = input.replace(',', '.').trim()
    if (sanitized === '') return undefined
    const parsed = Number(sanitized)
    return Number.isNaN(parsed) ? undefined : parsed
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={itemClassName}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              value={String(field.value ?? '')}
              onChangeText={text => {
                if (kind === 'number') field.onChange(toNumeric(text))
                else field.onChange(text)
              }}
              autoFocus={autoFocus}
              placeholder={placeholder}
              multiline={multiline}
              keyboardType={kind === 'number' ? 'decimal-pad' : 'default'}
            />
          </FormControl>
          {description ? (
            <FormDescription>{description}</FormDescription>
          ) : null}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
