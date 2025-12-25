import { CurrenciesList } from '@/components/currencies-list'
import { FormInputField } from '@/components/form-fields'
import { Drawer } from '@/components/ui/drawer'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Text } from '@/components/ui/text'
import { AccountType } from '@/data/client/db-schema'
import { useFormContext } from 'react-hook-form'
import { Pressable, ScrollView, View } from 'react-native'
import { type AccountFormData } from '../lib/form-schemas'
import { OpenBottomSheetPicker } from '../lib/types'

interface Props {
  formType: 'create' | 'update'
  accountType: AccountType
  debtIsOwedToMe?: boolean
  openPicker: OpenBottomSheetPicker
  setOpenPicker: (picker: OpenBottomSheetPicker) => void
}

export function BaseFields({
  formType,
  accountType,
  debtIsOwedToMe,
  openPicker,
  setOpenPicker
}: Props) {
  const form = useFormContext<AccountFormData>()

  return (
    <>
      <FormInputField
        name="name"
        label="Name *"
        placeholder="Account name"
        autoFocus
      />

      <FormInputField
        name="description"
        label="Description"
        placeholder="Optional description"
        multiline
      />

      <View className="flex-row gap-2">
        <FormInputField
          name="balance"
          label={
            accountType === 'debt'
              ? debtIsOwedToMe
                ? 'Remaining debt owed to you'
                : 'Remaining debt you owe'
              : 'Balance'
          }
          placeholder={
            accountType === 'debt'
              ? debtIsOwedToMe
                ? 'Amount still owed to you'
                : 'Amount you still owe'
              : 'Amount'
          }
          kind="number"
          itemClassName="flex-1"
          description={
            accountType === 'debt'
              ? debtIsOwedToMe
                ? 'Amount that is still owed to you (remaining debt)'
                : 'Amount that you still owe (remaining debt)'
              : undefined
          }
        />

        {formType === 'create' && (
          <FormField
            control={form.control}
            name="currencyId"
            render={({ field }) => (
              <FormItem className="flex-[0.4]">
                <FormLabel>Currency *</FormLabel>
                <FormControl>
                  <>
                    <Pressable
                      className="border-input bg-background dark:bg-input/30 flex h-10 flex-row items-center rounded-md border px-3 py-1 text-base shadow-sm shadow-black/5"
                      onPress={() => setOpenPicker('currency')}
                    >
                      <Text
                        className={
                          field.value
                            ? 'text-foreground text-base'
                            : 'text-muted-foreground text-base'
                        }
                      >
                        {field.value?.toString() || 'Currency'}
                      </Text>
                    </Pressable>
                    <Drawer
                      isVisible={openPicker === 'currency'}
                      onClose={() => setOpenPicker(null)}
                      height="85%"
                      safeBottomPadding={false}
                      title="Select account currency"
                    >
                      <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerClassName="pb-8 px-3"
                      >
                        <CurrenciesList
                          onSelect={currency => {
                            field.onChange(currency.code)
                            setOpenPicker(null)
                          }}
                          selectedCurrency={field.value}
                        />
                      </ScrollView>
                    </Drawer>
                  </>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </View>
    </>
  )
}
