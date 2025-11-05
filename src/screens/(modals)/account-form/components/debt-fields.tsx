import { FormDateField, FormInputField } from '@/components/form-fields'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Text } from '@/components/ui/text'
import { useFormContext } from 'react-hook-form'
import { Pressable, View } from 'react-native'
import { AccountFormData } from '../lib/form-schemas'
import { OpenBottomSheetPicker } from '../lib/types'

interface Props {
  debtIsOwedToMe: boolean | null | undefined
  openPicker: OpenBottomSheetPicker
  setOpenPicker: (picker: OpenBottomSheetPicker) => void
}

export function DebtFields({
  debtIsOwedToMe,
  openPicker,
  setOpenPicker
}: Props) {
  const form = useFormContext<AccountFormData>()

  return (
    <>
      <FormInputField
        name="debtInitialAmount"
        label={
          debtIsOwedToMe
            ? 'Amount lent (optional)'
            : 'Amount borrowed (optional)'
        }
        placeholder={debtIsOwedToMe ? 'Total lent' : 'Total borrowed'}
        kind="number"
      />
      <FormField
        control={form.control}
        name="debtIsOwedToMe"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Who owes?</FormLabel>
            <FormControl>
              <View className="flex-row gap-2">
                {[
                  { value: false, label: 'I owe' },
                  { value: true, label: 'Owed to me' }
                ].map(option => (
                  <Pressable
                    key={option.label}
                    className={`flex-1 rounded-xl border py-3 ${
                      field.value === option.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-card'
                    }`}
                    onPress={() => field.onChange(option.value)}
                  >
                    <Text
                      className={`text-center text-base font-semibold ${
                        field.value === option.value
                          ? 'text-primary'
                          : 'text-foreground'
                      }`}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormDateField
        name="debtDueDate"
        label="Due date (optional)"
        placeholder="Due date"
        isPickerOpen={openPicker === 'dueDate'}
        openPicker={() => setOpenPicker('dueDate')}
        closePicker={() => setOpenPicker(null)}
        drawerTitle="Pick due date"
        height="auto"
      />
    </>
  )
}
