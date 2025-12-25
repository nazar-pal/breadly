import { CalendarDialog } from '@/components/ui/calendar-dialog'
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
import { toDateId } from '@marceloterreiro/flash-calendar'
import { useRef } from 'react'
import {
  Path,
  useFormContext,
  useWatch,
  type FieldValues
} from 'react-hook-form'
import { Pressable } from 'react-native'

const isDate = (value: unknown): value is Date => value instanceof Date

/** Get today's date as a DateId */
const getTodayId = (): string => toDateId(new Date())

interface DateFieldProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>
  label: string
  placeholder?: string
  isPickerOpen: boolean
  openPicker: () => void
  closePicker: () => void
  dialogTitle: string
  valueToLabel?: (value: unknown) => string
  transformSelectedDate?: (date: Date) => unknown
  /** If true, only allows selecting future dates (today and onwards) */
  futureOnly?: boolean
  /** If true, only allows selecting past dates (today and before) */
  pastOnly?: boolean
}

export function FormDateField<TFieldValues extends FieldValues>({
  name,
  label,
  placeholder,
  isPickerOpen,
  openPicker,
  closePicker,
  dialogTitle,
  valueToLabel,
  transformSelectedDate,
  futureOnly = false,
  pastOnly = false
}: DateFieldProps<TFieldValues>) {
  const form = useFormContext<TFieldValues>()
  const todayId = getTodayId()
  const fieldValue = useWatch({ control: form.control, name })

  // Use ref to hold the onChange function from render prop
  const onChangeRef = useRef<(value: unknown) => void>(() => {})

  // Format the display value
  const displayValue = (() => {
    const hasValue =
      fieldValue !== undefined && fieldValue !== null && fieldValue !== ''
    if (hasValue) {
      return valueToLabel
        ? valueToLabel(fieldValue)
        : isDate(fieldValue)
          ? fieldValue.toLocaleDateString()
          : String(fieldValue)
    }
    return placeholder || label
  })()

  const handleDateSelect = (date: Date) => {
    const nextValue = transformSelectedDate ? transformSelectedDate(date) : date
    onChangeRef.current(nextValue)
    closePicker()
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        // Store onChange in ref for stable callback reference
        onChangeRef.current = field.onChange

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <>
                <Pressable
                  className="native:h-12 border-input bg-background h-10 flex-row items-center rounded-md border px-3"
                  onPress={openPicker}
                >
                  <Text
                    className={
                      field.value ? 'text-foreground' : 'text-muted-foreground'
                    }
                  >
                    {displayValue}
                  </Text>
                </Pressable>
                <CalendarDialog
                  open={isPickerOpen}
                  onOpenChange={o => !o && closePicker()}
                  title={dialogTitle}
                  selectedDate={fieldValue}
                  onDateSelect={handleDateSelect}
                  calendarMinDateId={futureOnly ? todayId : undefined}
                  calendarMaxDateId={pastOnly ? todayId : undefined}
                />
              </>
            </FormControl>
            <FormMessage />
          </FormItem>
        )
      }}
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
